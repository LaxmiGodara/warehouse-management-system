import { useState } from "react";

function Orders() {
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState([{ product: "", quantity: 1 }]);
  const [orders, setOrders] = useState([]);

  const handleAddItem = () => {
    setItems([...items, { product: "", quantity: 1 }]);
  };

  const handleCreateOrder = () => {
    const newOrder = {
      id: Date.now(),
      customerName,
      items,
    };

    setOrders([...orders, newOrder]);

    setCustomerName("");
    setItems([{ product: "", quantity: 1 }]);
  };

  return (
    <div className="orders">
      <h1>Create Order</h1>

      {/* Customer Input */}
      <input
        placeholder="Customer Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
      />

      {/* Items */}
      {items.map((item, index) => (
        <div key={index} className="item-row">
          <input placeholder="Product" value={item.product} />
          <input type="number" min="1" value={item.quantity} />
        </div>
      ))}

      <button onClick={handleAddItem}>Add Item</button>

      <button onClick={handleCreateOrder}>Create Order</button>

      {/* Orders List */}
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            {order.customerName}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
