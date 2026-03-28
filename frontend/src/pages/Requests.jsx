import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function Requests() {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [messages, setMessages] = useState({});
  const [inputs, setInputs] = useState({});

  const token = localStorage.getItem("token");
  const userId = parseInt(localStorage.getItem("user_id"));

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

  // ---------------- CHAT ----------------
  const fetchMessages = async (bookingId) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/bookings/${bookingId}/messages/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setMessages(prev => ({ ...prev, [bookingId]: data }));
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async (bookingId) => {
    const text = inputs[bookingId]?.trim();
    if (!text) return;

    await fetch(
      `http://127.0.0.1:8000/api/bookings/${bookingId}/send-message/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      }
    );

    setInputs(prev => ({ ...prev, [bookingId]: "" }));
    fetchMessages(bookingId);
  };

  useEffect(() => {
    if (requests.length > 0) {
      requests.forEach(r => fetchMessages(r.id));
    }
  }, [requests]);

  useEffect(() => {
    const interval = setInterval(() => {
      requests.forEach(r => fetchMessages(r.id));
    }, 3000);

    return () => clearInterval(interval);
  }, [requests]);

  // ---------------- APPROVE / REJECT ----------------
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

  // ---------------- CONFIRM RETURN ----------------
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
          <p>No requests</p>
        ) : (

          requests.map(r => {

            const isOwner = r.item.owner.id === userId;

            return (

              <div key={r.id} className="booking-card">

                <h3>{r.item.title}</h3>

                <p>Renter: {r.requester.username}</p>

                <p>Status: {r.status}</p>

                {/* ✅ APPROVE / REJECT */}
                {r.status === "pending" && isOwner && (
                  <>
                    <button
                      className="btn primary"
                      onClick={() => respond(r.id, "approve")}
                    >
                      Approve
                    </button>

                    <button
                      className="btn secondary"
                      onClick={() => respond(r.id, "reject")}
                    >
                      Reject
                    </button>
                  </>
                )}

                {/* ✅ CONFIRM RETURN */}
                {r.status === "return_pending" && isOwner && (
                  <button
                    className="btn primary"
                    onClick={() => completeBooking(r.id)}
                  >
                    Confirm Return
                  </button>
                )}

                {/* ---------------- CHAT ---------------- */}
                <div style={{ marginTop: "15px" }}>
                  <h4>Chat</h4>

                  {(messages[r.id] || []).map(msg => (
                    <div
                      key={msg.id}
                      style={{
                        textAlign: msg.sender_id === userId ? "right" : "left"
                      }}
                    >
                      {msg.text}
                    </div>
                  ))}

                  <input
                    type="text"
                    value={inputs[r.id] || ""}
                    onChange={(e) =>
                      setInputs(prev => ({
                        ...prev,
                        [r.id]: e.target.value
                      }))
                    }
                  />

                  <button onClick={() => sendMessage(r.id)}>
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