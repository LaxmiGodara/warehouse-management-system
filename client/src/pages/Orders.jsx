import { useState } from "react";

function Orders() {
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState([{ product: "", quantity: "", unit: "" }]);
  const [orders, setOrders] = useState([]);

  const handleAddItem = () => {
    setItems([...items, { product: "", quantity: "", unit: "" }]);
  };

  const handleDelete = (indexToDelete) => {
    setItems(items.filter((item, index) => index !== indexToDelete));
  };

  const handleCreateOrder = () => {
    const newOrder = {
      id: Date.now(),
      customerName,
      items,
      createdAt: new Date(),
    };

    setOrders([...orders, newOrder]);

    setCustomerName("");
    setItems([{ product: "", quantity: "", unit: "" }]);
  };

  return (
    <div className="orders">
      <h1>Create Order</h1>

      <input
        placeholder="Customer Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
      />

      {items.map((item, index) => (
        <div key={index} className="item-row">
          <input
            placeholder="Product"
            value={item.product}
            onChange={(e) => {
              const updatedItems = [...items];
              updatedItems[index].product = e.target.value;
              setItems(updatedItems);
            }}
          />

          <input
            placeholder="Quantity"
            type="number"
            min="0"
            value={item.quantity}
            onChange={(e) => {
              const updatedItems = [...items];
              updatedItems[index].quantity = e.target.value;
              setItems(updatedItems);
            }}
          />
          

          <button onClick={() => handleDelete(index)}>Delete</button>
        </div>
      ))}

      <button onClick={handleAddItem}>Add Item</button>
      <button onClick={handleCreateOrder}>Create Order</button>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <h3>{order.customerName}</h3>

            <p>Created At: {new Date(order.createdAt).toLocaleString()}</p>

            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.product} - {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
