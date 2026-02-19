import { useState } from "react";

function Customers({ customers, setCustomers }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [isActive, setIsActive] = useState(true);

  const handleCreateCustomer = () => {
    if (!name || !phone || !email || !location) return;

    const newCustomer = {
      id: Date.now(),
      name,
      phone,
      email,
      location,
    };

    setCustomers([...customers, newCustomer]);

    setName("");
    setPhone("");
    setEmail("");
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
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <textarea
          rows={5}
          cols={30}
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        <span>Is Active</span>
      </label>

      <button onClick={handleCreateCustomer}>Add Customer</button>

      <div className="customer-list">
        {customers.map((customer) => (
          <div key={customer.id} className="customer-card">
            <strong>{customer.name}</strong>
            <div>{customer.phone}</div>
            <div>{customer.email}</div>
            <div>{customer.location}</div>
            <div
              className={customer.isActive ? "badge-active" : "badge-inactive"}
            >
              {customer.isActive ? "Active" : "Inactive"}
            </div>  
          </div>
        ))}
      </div>
    </div>
  );
}

export default Customers;
