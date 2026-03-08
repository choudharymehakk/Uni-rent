import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function MyItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/items/mine/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => { setItems(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    const res = await fetch(`http://127.0.0.1:8000/api/items/${id}/delete/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setItems(items.filter(item => item.id !== id));
    else alert("Could not delete item");
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <h1>My Listed Items</h1>
          <button className="btn primary" onClick={() => navigate("/add-item")}>
            + List New Item
          </button>
        </div>

        {loading ? (
          <p style={{ color: "var(--muted)" }}>Loading...</p>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <h3>No items listed yet</h3>
            <p>List something to start earning!</p>
          </div>
        ) : (
          <div className="my-items-list">
            {items.map(item => (
              <div key={item.id} className="my-item-card">
                <img src={`http://127.0.0.1:8000${item.image}`} alt={item.title} />
                <div className="my-item-card-info">
                  <h3>{item.title}</h3>
                  <p className="price">₹{item.price_per_day}/day</p>
                  <span className={`status-badge ${item.is_available ? "approved" : "rejected"}`}>
                    {item.is_available ? "Available" : "Rented Out"}
                  </span>
                </div>
                <div className="my-item-card-actions">
                  <button className="btn ghost sm" onClick={() => navigate(`/item/${item.id}`)}>View</button>
                  <button className="btn danger sm" onClick={() => handleDelete(item.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default MyItems;