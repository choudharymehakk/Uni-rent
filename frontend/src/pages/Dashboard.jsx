import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Dashboard() {

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://uni-rent-backend.onrender.com/api/items/")
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching items:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />

      <div className="page">

        <div className="page-header">
          <h1>Browse Items</h1>

          <button
            className="btn primary"
            onClick={() => navigate("/add-item")}
          >
            + List an Item
          </button>
        </div>


        {loading ? (
          <p style={{ color: "var(--muted)" }}>Loading items...</p>
        ) : items.length === 0 ? (

          <div className="empty-state">
            <h3>No items listed yet</h3>
            <p>Be the first to list something!</p>
          </div>

        ) : (

          <div className="items-grid">

            {items.map(item => (

              <div
                key={item.id}
                className="item-card"
                onClick={() => navigate(`/item/${item.id}`)}
              >

                <img
                  src={`https://uni-rent-backend.onrender.com${item.image}`}
                  alt={item.title}
                />

                <div className="item-card-body">

                  <h3>{item.title}</h3>

                  <p className="price">
                    ₹{item.price_per_day}/day
                  </p>

                  <p className="owner">
                    by {item.owner.username} · {item.owner.branch} Y{item.owner.year}
                  </p>
                  <p>Rent: ₹{item.price_per_day}/day</p>
                  <p>Deposit: ₹{item.deposit_amount}</p>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
    </>
  );
}

export default Dashboard;