import { useState } from "react";

export default function Stock({ products, setProducts }) {
  const [editingId, setEditingId] = useState(null);
  const [editedQty, setEditedQty] = useState("");

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setEditedQty(product.totalQty);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedQty("");
  };

  const handleUpdate = (id) => {
    const updatedProducts = products.map((product) => {
      if (product.id === id) {
        return {
          ...product,
          totalQty: Number(editedQty),
        };
      }
      return product;
    });

    setProducts(updatedProducts);
    setEditingId(null);
    setEditedQty("");
  };

  return (
    <div>
      <h1 className="page-title">Stock</h1>

      {products.length === 0 && <p>No products available</p>}

      {products.length > 0 && (
        <table style={{ width: "100%", marginTop: "20px" }}>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Product Name</th>
              <th>Total Qty</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1}</td>

                <td>{product.name}</td>

                <td>
                  {editingId === product.id ? (
                    <input
                      type="number"
                      value={editedQty}
                      onChange={(e) => setEditedQty(e.target.value)}
                    />
                  ) : (
                    product.totalQty
                  )}
                </td>

                <td>
                  {editingId === product.id ? (
                    <>
                      <button onClick={() => handleUpdate(product.id)}>
                        Update
                      </button>
                      <button onClick={handleCancel}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => handleEditClick(product)}>
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
