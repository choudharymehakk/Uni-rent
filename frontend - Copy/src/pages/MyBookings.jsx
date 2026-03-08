import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/bookings/mine/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => { setBookings(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <h1>My Booking Requests</h1>
        </div>

        {loading ? (
          <p style={{ color: "var(--muted)" }}>Loading...</p>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <h3>No booking requests yet</h3>
            <p>Browse items and send a request!</p>
          </div>
        ) : (
          bookings.map(b => (
            <div key={b.id} className="booking-card">
              <h3>{b.item.title}</h3>
              <p className="meta">
                📅 {b.start_date} → {b.end_date} &nbsp;·&nbsp; Owner: {b.item.owner.username} ({b.item.owner.phone})
              </p>
              <p className="meta">₹{b.item.price_per_day}/day</p>
              <span className={`status-badge ${b.status}`}>{b.status}</span>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default MyBookings;