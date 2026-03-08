import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchBookings = () => {
    fetch("http://127.0.0.1:8000/api/bookings/mine/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setBookings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const pickupItem = async (bookingId) => {
    await fetch(
      `http://127.0.0.1:8000/api/bookings/${bookingId}/pickup/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchBookings();
  };

  const completeBooking = async (bookingId) => {
    await fetch(
      `http://127.0.0.1:8000/api/bookings/${bookingId}/complete/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchBookings();
  };

  const today = new Date().toISOString().split("T")[0];

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
                📅 {b.start_date} → {b.end_date}
                &nbsp; · &nbsp;
                Owner: {b.item.owner.username} ({b.item.owner.phone})
              </p>

              <p className="meta">
                ₹{b.item.price_per_day}/day
              </p>

              <span className={`status-badge ${b.status}`}>
                {b.status}
              </span>

              {/* SHOW PICKUP QR */}

              {b.status === "approved" && b.pickup_qr && (
                <div style={{ marginTop: "15px" }}>

                  <p><b>Pickup QR Code</b></p>

                  <img
                    src={`http://127.0.0.1:8000${b.pickup_qr}`}
                    alt="pickup qr"
                    style={{ width: "160px" }}
                  />

                  <p className="meta">
                    Scan this QR during pickup
                  </p>

                  <button
                    className="btn primary"
                    onClick={() => pickupItem(b.id)}
                  >
                    Scan Pickup QR
                  </button>

                </div>
              )}

              {/* SHOW RETURN OPTION ONLY ON END DATE */}

              {b.status === "rented" && today === b.end_date && (

                <div style={{ marginTop: "15px" }}>

                  <p><b>Return Item</b></p>

                  <button
                    className="btn primary"
                    onClick={() => completeBooking(b.id)}
                  >
                    Scan Return QR
                  </button>

                </div>

              )}

            </div>

          ))

        )}

      </div>
    </>
  );
}

export default MyBookings;