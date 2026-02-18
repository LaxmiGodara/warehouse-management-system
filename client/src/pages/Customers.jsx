import { useState } from "react";

function Customers({ customers, setCustomers }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  const handleCreateCustomer = () => {
    if (!name || !phone || !location) return;

    const newCustomer = {
      id: Date.now(),
      name,
      phone,
      location,
    };

    setCustomers([...customers, newCustomer]);

    setName("");
    setPhone("");
    setLocation("");
  };

  return (
    <div className="customers">
      <h1>Customers</h1>

      <div className="customer-form">
        <input
          placeholder="Customer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button onClick={handleCreateCustomer}>Add Customer</button>
      </div>

      <div className="customer-list">
        {customers.map((customer) => (
          <div key={customer.id} className="customer-card">
            <strong>{customer.name}</strong>
            <div>{customer.phone}</div>
            <div>{customer.location}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Customers;
