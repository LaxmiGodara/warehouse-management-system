# Warehouse Management System (WMS)

A production-ready Warehouse Management System (WMS) using the MERN stack to handle real-world inventory and order workflows.

In real-world warehouse systems, managing inventory accurately is challenging due to issues like stock inconsistency, overselling, and lack of proper workflow between order creation, payment, and delivery. Many basic systems fail to handle real business constraints such as reserved stock and controlled stock deduction.

 WMS deals with that  by following the  real business workflows, ensures data integrity, and prevents common inventory issues like negative stock and incorrect stock updates.

## Key Features

• Product & Stock Management with real-time quantity tracking  
• Order Management system with customer selection and auto-filled details  
• Reserved Quantity logic to prevent overselling  
• Stock updates only after successful delivery (no negative stock allowed)  
• Role-Based Access Control (Admin/Staff)  
• Payment tracking with append-only entries and invoice generation  

## Technical Implementation

• Developed REST APIs using Node.js and Express.js  
• Designed scalable MongoDB schemas for products, orders, and customers  
• Built responsive UI using React.js  
• Implemented business logic aligned with real warehouse workflows

## Project Structure
warehouse-management-system/
├── client/
└── server/

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

#### 1. Clone the repository

git clone https://github.com/LaxmiGodara/warehouse-management-system.git
cd warehouse-management-system


#### 2. Install server dependencies
cd server
npm install


#### 3. Install client dependencies

cd ../client
npm install



## Steps to run the App

### Start the backend

cd server
npm run dev


### Start the frontend
cd client
npm run dev

Frontend will run on:

http://localhost:5173


Backend will run on:

http://localhost:<PORT>


## Available Scripts

### Client

npm run dev
npm run build
npm run lint
npm run preview


### Server

npm run dev
npm start


## Main Modules

- Dashboard
- Customers
- Products
- Orders
- Deliveries
- Stock
- Payments



