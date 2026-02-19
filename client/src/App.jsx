import { BrowserRouter } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import "./App.css";
import { useState } from "react";

function App() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([])
  return (
    <BrowserRouter>
      <MainLayout customers={customers} setCustomers={setCustomers} 
      products={products} setProducts={setProducts}/>
    </BrowserRouter>
  );
}

export default App;
