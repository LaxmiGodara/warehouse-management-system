import fs from "fs";
import path from "path";
import PDFDocument from "../server/node_modules/pdfkit/js/pdfkit.js";

const outputPath = path.resolve(process.cwd(), "Laxmi_Godara_Resume.pdf");

const doc = new PDFDocument({
  size: "A4",
  margin: 46,
  info: {
    Title: "Laxmi Godara Resume",
    Author: "Laxmi Godara",
  },
});

doc.pipe(fs.createWriteStream(outputPath));

const colors = {
  text: "#0f172a",
  muted: "#475569",
  accent: "#0369a1",
  line: "#cbd5e1",
};

function sectionTitle(title) {
  doc.moveDown(0.8);
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor(colors.text)
    .text(title.toUpperCase(), { continued: false });
  const y = doc.y + 4;
  doc
    .moveTo(doc.page.margins.left, y)
    .lineTo(doc.page.width - doc.page.margins.right, y)
    .lineWidth(1)
    .strokeColor(colors.line)
    .stroke();
  doc.moveDown(0.7);
}

function bullet(text, indent = 14) {
  doc
    .font("Helvetica")
    .fontSize(10.5)
    .fillColor(colors.text)
    .text(`• ${text}`, { indent, lineGap: 3 });
}

function linkLine(label, url) {
  doc
    .font("Helvetica")
    .fontSize(10.5)
    .fillColor(colors.text)
    .text(`${label}: `, { continued: true });
  doc
    .fillColor(colors.accent)
    .text(url, { link: url, underline: true });
  doc.fillColor(colors.text);
}

doc
  .font("Helvetica-Bold")
  .fontSize(24)
  .fillColor(colors.text)
  .text("Laxmi Godara", { align: "center" });

doc
  .moveDown(0.2)
  .font("Helvetica")
  .fontSize(11)
  .fillColor(colors.muted)
  .text("Full-Stack Developer | MERN Stack", { align: "center" });

doc.moveDown(0.4);
doc
  .font("Helvetica")
  .fontSize(10.5)
  .fillColor(colors.text)
  .text("lgodara285@gmail.com | 7976533737", { align: "center" });

doc.moveDown(0.2);
doc
  .fillColor(colors.accent)
  .text("LinkedIn", { align: "center", continued: true, link: "https://www.linkedin.com/in/laxmi-godara-b1b0b6241", underline: true });
doc
  .fillColor(colors.muted)
  .text("  |  ", { align: "center", continued: true });
doc
  .fillColor(colors.accent)
  .text("GitHub", { align: "center", continued: true, link: "https://github.com/LaxmiGodara", underline: true });
doc
  .fillColor(colors.muted)
  .text("  |  ", { align: "center", continued: true });
doc
  .fillColor(colors.accent)
  .text("Portfolio", { align: "center", continued: true, link: "https://laxmigodara.netlify.app", underline: true });
doc
  .fillColor(colors.muted)
  .text("  |  ", { align: "center", continued: true });
doc
  .fillColor(colors.accent)
  .text("Twitter", { align: "center", link: "https://x.com/LaxmiCodes", underline: true });

sectionTitle("Summary");
doc
  .font("Helvetica")
  .fontSize(10.8)
  .fillColor(colors.text)
  .text(
    "Full-stack developer with a MERN stack background who intentionally transitioned into tech after clearing UPSC CDS and pursuing Indian Army SSB selection. Built production-ready applications for inventory, POS billing, and automation workflows with a focus on reliable backend logic, secure APIs, and polished user experience.",
    { lineGap: 4 }
  );

sectionTitle("Skills");
doc.font("Helvetica-Bold").fontSize(10.8).fillColor(colors.text).text("Frameworks & Languages");
doc.font("Helvetica").fontSize(10.5).fillColor(colors.text).text("React, Next.js, Node.js, Express.js, JavaScript, TypeScript", { lineGap: 3 });
doc.moveDown(0.3);
doc.font("Helvetica-Bold").fontSize(10.8).text("Styling");
doc.font("Helvetica").fontSize(10.5).text("Tailwind CSS, Responsive UI Design", { lineGap: 3 });
doc.moveDown(0.3);
doc.font("Helvetica-Bold").fontSize(10.8).text("Database & Tools");
doc.font("Helvetica").fontSize(10.5).text("MongoDB, GitHub, Postman, VS Code, Netlify", { lineGap: 3 });
doc.moveDown(0.3);
doc.font("Helvetica-Bold").fontSize(10.8).text("Methodologies");
doc.font("Helvetica").fontSize(10.5).text("Agile, REST API Design, Role-Based Access Control (RBAC)", { lineGap: 3 });

sectionTitle("Projects");
doc.font("Helvetica-Bold").fontSize(11.5).fillColor(colors.text).text("Warehouse Management System (WMS)");
doc.font("Helvetica-Oblique").fontSize(10.2).fillColor(colors.muted).text("MERN Stack Application");
linkLine("Project Link", "https://github.com/LaxmiGodara/warehouse-management-system");
bullet("A production-ready system for real-world inventory and order workflows, solving stock inconsistency, overselling, and full order-to-delivery lifecycle issues.");
bullet("Product and stock management with real-time tracking and reserved quantity logic.");
bullet("Order management with customer autofill, status tracking, structured delivery workflow, payment tracking, invoice generation, RBAC, and REST APIs.");

doc.moveDown(0.7);
doc.font("Helvetica-Bold").fontSize(11.5).fillColor(colors.text).text("Prepaid Wallet POS System");
doc.font("Helvetica-Oblique").fontSize(10.2).fillColor(colors.muted).text("MERN Stack Application");
bullet("Built for controlled POS environments handling money and stock-sensitive workflows with strict balance validation and reliable billing integrity.");
bullet("One member, one wallet, one active card model for accurate POS billing and financial transactions.");
bullet("Atomic billing engine using Node.js and MongoDB transactions to prevent double spending.");
bullet("JWT-secured REST APIs, backend validations, and MongoDB audit logs for complete transaction traceability.");

sectionTitle("Certificates");
doc.font("Helvetica-Bold").fontSize(11).fillColor(colors.text).text("React Essential Training");
linkLine("Certificate Link", "https://www.linkedin.com/learning/certificates/0a40?trk=share_certificate");
doc.font("Helvetica").fontSize(10.5).text("Skills: Web Development - React");

doc.moveDown(0.6);
doc.font("Helvetica-Bold").fontSize(11).fillColor(colors.text).text("Agile Foundations");
linkLine("Certificate Link", "https://www.linkedin.com/learning/certificates/0214d3D");
doc.font("Helvetica").fontSize(10.5).text("Skills: Agile Project Management & Agile Methodologies");

sectionTitle("Education");
doc.font("Helvetica-Bold").fontSize(11).fillColor(colors.text).text("Bachelor of Science (PCM)");
doc.font("Helvetica").fontSize(10.5).text("Jai Narain Vyas University, Rajasthan");

doc.end();
