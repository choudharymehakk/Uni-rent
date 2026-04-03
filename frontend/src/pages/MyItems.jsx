import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function MyItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(
          "https://uni-rent-backend.onrender.com/api/items/mine/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();

        if (res.ok) {
          setItems(data);
        } else {
          if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }
          console.error("API Error:", data);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <>
      <Navbar />

      <div className="page">
        <h1>My Items</h1>

        {loading ? (
          <p style={{ color: "var(--muted)" }}>Loading your items...</p>
        ) : items && items.length > 0 ? (
          <div className="items-grid">
            {items.map((item) => (
              <div key={item.id} className="item-card">
                <img
                  src={
                    item.image
                      ? `https://uni-rent-backend.onrender.com${item.image}`
                      : "https://via.placeholder.com/300"
                  }
                  alt={item.title}
                />

                <div className="item-card-body">
                  <h3>{item.title}</h3>

                  <p className="price">
                    ₹{item.price_per_day}/day
                  </p>

                  <p>
                    Deposit: ₹{item.deposit_amount}
                  </p>

                  <p>
                    Status: {item.is_available ? "Available" : "Rented"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No items yet</h3>
            <p>You haven't listed anything yet.</p>
          </div>
        )}
      </div>
    </>
  );
}

export default MyItems;