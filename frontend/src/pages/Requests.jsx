import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function Requests() {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");

  const fetchRequests = () => {

    fetch("http://127.0.0.1:8000/api/bookings/incoming/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setRequests(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const respond = async (id, action) => {

    await fetch(
      `http://127.0.0.1:8000/api/bookings/${id}/respond/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action })
      }
    );

    fetchRequests();
  };

  const generateQR = async (id) => {

    await fetch(
      `http://127.0.0.1:8000/api/bookings/${id}/respond/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "approve" })
      }
    );

    fetchRequests();
  };

  const pickupItem = async (id) => {

    await fetch(
      `http://127.0.0.1:8000/api/bookings/${id}/pickup/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );

    fetchRequests();
  };

  return (
    <>
      <Navbar />

      <div className="page">

        <div className="page-header">
          <h1>Requests</h1>
        </div>

        {loading ? (

          <p>Loading...</p>

        ) : requests.length === 0 ? (

          <div className="empty-state">
            <h3>No requests</h3>
          </div>

        ) : (

          requests.map(r => {

            const isOwner = r.item.owner.id == userId;
            const isRenter = r.requester.id == userId;

            return (

              <div key={r.id} className="booking-card">

                <h3>{r.item.title}</h3>

                <p className="meta">
                  Owner: {r.item.owner.username}
                </p>

                <p className="meta">
                  Renter: {r.requester.username}
                </p>

                <p className="meta">
                  📅 {r.start_date} → {r.end_date}
                </p>

                <span className={`status-badge ${r.status}`}>
                  {r.status}
                </span>

                {/* Pending */}
                {r.status === "pending" && isOwner && (

                  <div style={{ marginTop: "10px" }}>

                    <button
                      className="btn primary"
                      onClick={() => respond(r.id, "approve")}
                    >
                      Approve
                    </button>

                    <button
                      className="btn secondary"
                      style={{ marginLeft: "10px" }}
                      onClick={() => respond(r.id, "reject")}
                    >
                      Reject
                    </button>

                  </div>

                )}

                {/* Owner side QR */}
                {r.status === "approved" && isOwner && (

                  <div style={{ marginTop: "15px" }}>

                    <h4>Pickup QR</h4>

                    {r.pickup_qr ? (

                      <img
                        src={`http://127.0.0.1:8000${r.pickup_qr}`}
                        alt="QR"
                        style={{ width: "150px", marginTop: "10px" }}
                      />

                    ) : (

                      <button
                        className="btn primary"
                        onClick={() => generateQR(r.id)}
                      >
                        Generate QR
                      </button>

                    )}

                  </div>

                )}

                {/* Renter side scan */}
                {r.status === "approved" && isRenter && (

                  <button
                    className="btn primary"
                    style={{ marginTop: "10px" }}
                    onClick={() => pickupItem(r.id)}
                  >
                    Scan Pickup QR
                  </button>

                )}

                {/* Chat box */}
                <div style={{ marginTop: "15px" }}>

                  <h4>Chat</h4>

                  <div className="chat-box">

                    <p className="meta">Messages will appear here</p>

                  </div>

                  <input
                    type="text"
                    placeholder="Type message..."
                    className="chat-input"
                  />

                  <button className="btn secondary" style={{ marginTop: "5px" }}>
                    Send
                  </button>

                </div>

              </div>

            );

          })

        )}

      </div>
    </>
  );
}

export default Requests;