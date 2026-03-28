import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function MyItems() {

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchItems = async () => {
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/items/mine/",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await res.json();
      setItems(data);
      setLoading(false);

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <>
      <Navbar />

      <div className="page">

        <h1>My Items</h1>

        {loading ? (
          <p>Loading...</p>
        ) : items.length === 0 ? (
          <p>No items listed yet</p>
        ) : (

          <div className="items-grid">

            {items.map(item => (

              <div key={item.id} className="item-card">

                <img
                  src={`http://127.0.0.1:8000${item.image}`}
                  alt={item.title}
                />

                <div className="item-card-body">

                  <h3>{item.title}</h3>

                  <p className="price">
                    ₹{item.price_per_day}/day
                  </p>

                  <p>
                    {item.is_available
                      ? "Available"
                      : "Currently rented"}
                  </p>

                  {/* ❌ REMOVED mark available button */}
                  {!item.is_available && (
                    <p style={{ color: "#b6ff3b", marginTop: "8px" }}>
                      Waiting for return confirmation
                    </p>
                  )}

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