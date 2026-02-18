import { BrowserRouter } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import "./App.css";
import { useState } from "react";

function App() {
  const [customers, setCustomers] = useState([]);
  return (
    <BrowserRouter>
      <MainLayout customers={customers} setCustomers={setCustomers} />
    </BrowserRouter>
  );
}

export default App;
