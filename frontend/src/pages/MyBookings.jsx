import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [messages, setMessages] = useState({});
  const [inputs, setInputs] = useState({});

  const token = localStorage.getItem("token");
  const userId = parseInt(localStorage.getItem("user_id"));

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

  // ✅ AUTO LOAD CHAT
  useEffect(() => {
    if (bookings.length > 0) {
      bookings.forEach(b => fetchMessages(b.id));
    }
  }, [bookings]);

  // ✅ AUTO REFRESH CHAT
  useEffect(() => {
    const interval = setInterval(() => {
      bookings.forEach(b => fetchMessages(b.id));
    }, 3000);

    return () => clearInterval(interval);
  }, [bookings]);

  return (
    <>
      <Navbar />

      <div className="page">
        <div className="page-header">
          <h1>My Bookings</h1>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : bookings.length === 0 ? (
          <p>No bookings</p>
        ) : (
          bookings.map(b => (
            <div key={b.id} className="booking-card">

              <h3>{b.item.title}</h3>

              <p>Owner: {b.item.owner.username}</p>
              <p>Status: {b.status}</p>

              {/* ✅ MARK RETURN */}
              {b.status === "rented" && (
                <button
                  className="btn primary"
                  onClick={async () => {
                    await fetch(
                      `http://127.0.0.1:8000/api/bookings/${b.id}/mark-returned/`,
                      {
                        method: "POST",
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );

                    fetchBookings();
                  }}
                >
                  Mark as Returned
                </button>
              )}

              {/* ---------------- CHAT ---------------- */}
              <div style={{ marginTop: "15px" }}>
                <h4>Chat</h4>

                <div
                  style={{
                    background: "#111",
                    padding: "10px",
                    borderRadius: "8px",
                    marginTop: "10px",
                    maxHeight: "200px",
                    overflowY: "auto",
                  }}
                >
                  {(messages[b.id] || []).map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        textAlign: msg.sender_id === userId ? "right" : "left",
                        marginBottom: "5px",
                      }}
                    >
                      <span
                        style={{
                          background: msg.sender_id === userId ? "#b6ff3b" : "#333",
                          padding: "5px 10px",
                          borderRadius: "10px",
                          color: msg.sender_id === userId ? "black" : "white",
                        }}
                      >
                        {msg.text}
                      </span>
                    </div>
                  ))}
                </div>

                <input
                  type="text"
                  value={inputs[b.id] || ""}
                  onChange={(e) =>
                    setInputs(prev => ({
                      ...prev,
                      [b.id]: e.target.value
                    }))
                  }
                  placeholder="Type message..."
                  className="chat-input"
                />

                <button
                  className="btn secondary"
                  style={{ marginTop: "5px" }}
                  onClick={() => sendMessage(b.id)}
                >
                  Send
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </>
  );
}

export default MyBookings;