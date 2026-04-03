import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    fetch(`https://uni-rent-backend.onrender.com/api/items/${id}/`)
      .then(res => res.json())
      .then(data => setItem(data));
  }, [id]);

  const handleBook = async () => {
    if (!startDate || !endDate) {
      setMessage("Please select start and end dates");
      return;
    }
    setLoading(true);
    setMessage("");

    const res = await fetch(`https://uni-rent-backend.onrender.com/api/items/${id}/book/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ start_date: startDate, end_date: endDate }),
    });

    const data = await res.json();
    setLoading(false);
    setMessage(res.ok ? "✅ Booking request sent!" : `❌ ${data.error}`);
  };

  if (!item) return (
    <>
      <Navbar />
      <div className="page"><p style={{ color: "var(--muted)" }}>Loading...</p></div>
    </>
  );

  const isOwner = String(item.owner.id) === String(userId);

  return (
    <>
      <Navbar />
      <div className="item-detail">
        <button className="btn ghost sm" onClick={() => navigate("/dashboard")} style={{ marginBottom: "24px" }}>
          ← Back
        </button>

        <div className="item-detail-grid">
          <img src={`https://uni-rent-backend.onrender.com${item.image}`} alt={item.title} />

          <div className="item-detail-info">
            <h1>{item.title}</h1>
            <p className="price">₹{item.price_per_day}/day</p>
            <p>{item.description}</p>

            <div className="owner-card">
              <h4>Owner Info</h4>
              <p><strong>{item.owner.username}</strong></p>
              <p>📚 {item.owner.branch} — Year {item.owner.year}</p>
              <p>📞 {item.owner.phone}</p>
            </div>

            {!isOwner && item.is_available && (
              <>
                <div className="booking-form">
                  <div>
                    <label>Start Date</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                  </div>
                  <div>
                    <label>End Date</label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                  </div>
                  <button className="btn primary" onClick={handleBook} disabled={loading}>
                    {loading ? "Sending..." : "Request to Rent"}
                  </button>
                </div>
                {message && <p style={{ marginTop: "12px", fontSize: "14px" }}>{message}</p>}
              </>
            )}

            {!item.is_available && (
              <p style={{ color: "var(--danger)", fontWeight: 600 }}>⚠️ Item currently unavailable</p>
            )}

            {isOwner && (
              <p style={{ color: "var(--muted)", fontSize: "14px" }}>This is your item.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ItemDetail;