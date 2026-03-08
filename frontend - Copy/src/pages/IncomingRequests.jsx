import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function IncomingRequests() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/bookings/incoming/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => { setBookings(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleRespond = async (bookingId, action) => {
    const res = await fetch(`http://127.0.0.1:8000/api/bookings/${bookingId}/respond/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action }),
    });

    if (res.ok) {
      setBookings(bookings.map(b =>
        b.id === bookingId
          ? { ...b, status: action === "approve" ? "approved" : "rejected" }
          : b
      ));
    } else {
      alert("Something went wrong");
    }
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <h1>Incoming Requests</h1>
        </div>

        {loading ? (
          <p style={{ color: "var(--muted)" }}>Loading...</p>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <h3>No incoming requests</h3>
            <p>When students request your items, they'll show up here.</p>
          </div>
        ) : (
          bookings.map(b => (
            <div key={b.id} className="booking-card">
              <h3>{b.item.title}</h3>
              <p className="meta">
                👤 {b.requester.username} · {b.requester.branch} Y{b.requester.year} · 📞 {b.requester.phone}
              </p>
              <p className="meta">📅 {b.start_date} → {b.end_date}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "12px" }}>
                <span className={`status-badge ${b.status}`}>{b.status}</span>
                {b.status === "pending" && (
                  <>
                    <button className="btn primary sm" onClick={() => handleRespond(b.id, "approve")}>
                      ✓ Approve
                    </button>
                    <button className="btn danger sm" onClick={() => handleRespond(b.id, "reject")}>
                      ✗ Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default IncomingRequests;