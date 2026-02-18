import { Routes, Route } from "react-router-dom";
import NavItem from "../components/NavItem";
import Dashboard from "../pages/Dashboard";
import Customers from "../pages/Customers";
import Orders from "../pages/Orders";
import Deliveries from "../pages/Deliveries";
import Stock from "../pages/Stock";
import Payments from "../pages/Payments";

export default function MainLayout({ customers, setCustomers }) {
  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <NavItem to="/">Dashboard</NavItem>
        <NavItem to="/customers">Customers</NavItem>
        <NavItem to="/orders">Orders</NavItem>
        <NavItem to="/deliveries">Deliveries</NavItem>
        <NavItem to="/stock">Stock</NavItem>
        <NavItem to="/payments">Payments</NavItem>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/customers"
            element={
              <Customers customers={customers} setCustomers={setCustomers} />
            }
          />
          <Route path="/orders" element={<Orders />} />
          <Route path="/deliveries" element={<Deliveries />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/payments" element={<Payments />} />
        </Routes>
      </main>
    </div>
  );
}
