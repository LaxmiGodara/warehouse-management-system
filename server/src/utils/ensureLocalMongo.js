import fs from 'fs/promises';
import net from 'net';
import os from 'os';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_MONGO_ROOT = path.join(os.tmpdir(), 'wms-local-mongo');
const LOCAL_MONGO_DATA_DIR = path.join(LOCAL_MONGO_ROOT, 'data');
const LOCAL_MONGO_LOG_DIR = path.join(LOCAL_MONGO_ROOT, 'log');
const LOCAL_MONGO_LOG_FILE = path.join(LOCAL_MONGO_LOG_DIR, 'mongod.log');
const DEFAULT_MONGOD_BIN = 'C:\\Program Files\\MongoDB\\Server\\8.2\\bin\\mongod.exe';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const canAutoStartLocalMongo = (mongoUri) => {
  if (!mongoUri) {
    return false;
  }

  try {
    const url = new URL(mongoUri);
    const hostname = url.hostname?.toLowerCase();
    const isLocalHost = ['localhost', '127.0.0.1', '::1'].includes(hostname);
    const port = url.port || '27017';

    return isLocalHost && port === '27017';
  } catch {
    return false;
  }
};

const isPortOpen = (host, port) =>
  new Promise((resolve) => {
    const socket = net.connect({ host, port });

    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });

    socket.once('error', () => {
      socket.destroy();
      resolve(false);
    });
  });

const waitForPort = async (host, port, attempts = 30, intervalMs = 1000) => {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (await isPortOpen(host, port)) {
      return true;
    }

    await sleep(intervalMs);
  }

  return false;
};

const writeMongoConfig = async () => {
  await fs.mkdir(LOCAL_MONGO_DATA_DIR, { recursive: true });
  await fs.mkdir(LOCAL_MONGO_LOG_DIR, { recursive: true });

  const config = `storage:
  dbPath: ${LOCAL_MONGO_DATA_DIR}
systemLog:
  destination: file
  logAppend: true
  path: ${LOCAL_MONGO_LOG_FILE}
net:
  port: 27017
  bindIp: 127.0.0.1
`;

  const configPath = path.join(LOCAL_MONGO_ROOT, 'mongod.local.cfg');
  await fs.writeFile(configPath, config, 'utf8');
  return configPath;
};

const getMongodPath = async () => {
  const configuredPath = process.env.MONGOD_BIN?.trim();
  const candidate = configuredPath || DEFAULT_MONGOD_BIN;

  try {
    await fs.access(candidate);
    return candidate;
  } catch {
    return null;
  }
};

const startDetachedMongo = async (mongodPath, configPath) => {
  const child = spawn(mongodPath, ['--config', configPath], {
    detached: true,
    stdio: 'ignore',
    windowsHide: true,
  });

  child.unref();
};

const ensureLocalMongo = async (mongoUri) => {
  if (!canAutoStartLocalMongo(mongoUri)) {
    return;
  }

  if (await isPortOpen('127.0.0.1', 27017)) {
    return;
  }

  const mongodPath = await getMongodPath();
  if (!mongodPath) {
    console.warn(
      'Local MongoDB is not running and mongod.exe was not found. Set MONGOD_BIN or start MongoDB manually.'
    );
    return;
  }

  const configPath = await writeMongoConfig();

  console.log('Local MongoDB is offline. Starting a repo-local mongod instance...');
  await startDetachedMongo(mongodPath, configPath);

  const mongoReady = await waitForPort('127.0.0.1', 27017);
  if (!mongoReady) {
    throw new Error(
      `MongoDB did not become ready on 127.0.0.1:27017. Check ${LOCAL_MONGO_LOG_FILE} for details.`
    );
  }

  console.log(`Local mongod is ready using ${LOCAL_MONGO_DATA_DIR}`);
};

export default ensureLocalMongo;
