import { BrowserRouter } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import "./App.css";
import { useState } from "react";

function App() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [paymentDues, setPaymentDues] = useState([]);
  return (
    <BrowserRouter>
      <MainLayout
        customers={customers}
        setCustomers={setCustomers}
        products={products}
        setProducts={setProducts}
        orders={orders}
        setOrders={setOrders}
        deliveries={deliveries}
        setDeliveries={setDeliveries}
        paymentDues={paymentDues}
        setPaymentDues={setPaymentDues}
      />
    </BrowserRouter>
  );
}

export default App;
