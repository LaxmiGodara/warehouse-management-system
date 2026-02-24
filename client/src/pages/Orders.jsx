import { useState } from "react";

function Orders({ orders, setOrders, products }) {
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState([{ productId: "", quantity: 1 }]);

  const handleAddItem = () => {
    setItems([...items, { productId: "", quantity: 1 }]);
  };

  const handleDelete = (indexToDelete) => {
    setItems(items.filter((_, index) => index !== indexToDelete));
  };

  const orderAmount = items.reduce((total, item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return total;
    return total + product.mrp * item.quantity;
  }, 0);

  const handleCreateOrder = () => {
    if (!customerName) return;

    const newOrder = {
      id: Date.now(),
      customerName,
      items: items
        .filter((item) => item.productId)
        .map((item) => {
          const product = products.find((p) => p.id === item.productId);
          return {
            productId: product.id,
            productName: product.name,
            quantity: Number(item.quantity),
            rate: product.mrp,
          };
        }),
      orderAmount,
      createdAt: new Date(),
    };

    setOrders([...orders, newOrder]);
    setCustomerName("");
    setItems([{ productId: "", quantity: 1 }]);
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
          <select
            value={item.productId}
            onChange={(e) => {
              const updated = [...items];
              updated[index].productId = Number(e.target.value);
              setItems(updated);
            }}
          >
            <option value="">-- Select Product --</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => {
              const updated = [...items];
              updated[index].quantity = Number(e.target.value);
              setItems(updated);
            }}
          />

          <button onClick={() => handleDelete(index)}>Delete</button>
        </div>
      ))}

      <button onClick={handleAddItem}>Add Item</button>

      <p>
        <strong>Order Total: ₹{orderAmount}</strong>
      </p>

      <button onClick={handleCreateOrder}>Create Order</button>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <h3>{order.customerName}</h3>
            <p>₹{order.orderAmount}</p>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.productName} - {item.quantity}
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
