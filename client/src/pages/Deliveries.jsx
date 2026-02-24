import { useState } from "react";

export default function Deliveries({
  orders,
  products,
  deliveries,
  setDeliveries,
  setProducts,
  paymentDues,
  setPaymentDues,
}) {
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");

  const selectedOrder = orders.find((order) => order.id === selectedOrderId);

  const handleSaveDelivery = () => {
    if (!selectedOrderId) {
      alert("Please select an order");
      return;
    }

    if (!deliveryStatus) {
      alert("Please select delivery status");
      return;
    }

    const newDelivery = {
      id: Date.now(),
      orderId: selectedOrderId,
      status: deliveryStatus,
      deliveredAt: new Date(),
    };

    if (deliveryStatus === "DELIVERED" && selectedOrder) {
      for (let item of selectedOrder.items) {
        const product = products.find((p) => p.id === item.productId);

        if (!product || product.totalQty < item.quantity) {
          alert(`Not enough stock for ${product?.name}`);
          return;
        }
      }

      const updatedProducts = products.map((product) => {
        const orderedItem = selectedOrder.items.find(
          (item) => item.productId === product.id,
        );

        if (orderedItem) {
          return {
            ...product,
            totalQty: product.totalQty - orderedItem.quantity,
          };
        }

        return product;
      });

      setProducts(updatedProducts);

      const newPaymentDue = {
        id: Date.now(),
        orderId: selectedOrder.id,
        customerName: selectedOrder.customerName,
        orderAmount: selectedOrder.orderAmount,
        paidAmount: 0,
        balanceAmount: selectedOrder.orderAmount,
        status: "NOT_PAID",
      };

      setPaymentDues([...paymentDues, newPaymentDue]);
    }

    setDeliveries([...deliveries, newDelivery]);
    alert("Delivery saved successfully");
  };

  return (
    <div>
      <h1 className="page-title">Deliveries</h1>

      <div>
        <label>Select Order:</label>
        <select
          value={selectedOrderId}
          onChange={(e) => setSelectedOrderId(Number(e.target.value))}
        >
          <option value="">-- Select Order --</option>
          {orders.map((order) => (
            <option key={order.id} value={order.id}>
              {order.id} - {order.customerName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Delivery Status:</label>
        <select
          value={deliveryStatus}
          onChange={(e) => setDeliveryStatus(e.target.value)}
        >
          <option value="">--Select Status--</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="NOT_DELIVERED">NOT_DELIVERED</option>
          <option value="PENDING">PENDING</option>
        </select>
      </div>

      <button onClick={handleSaveDelivery}>Save Delivery</button>
    </div>
  );
}
