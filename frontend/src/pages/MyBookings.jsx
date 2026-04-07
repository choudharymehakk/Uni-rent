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
    fetch("https://uni-rent-backend.onrender.com/api/bookings/mine/", {
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

  // ---------------- PAYMENT ----------------

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleOnlinePayment = async (booking) => {
    const res = await loadRazorpay();

    if (!res) {
      alert("Razorpay failed");
      return;
    }

    try {
      const response = await fetch(
        "https://uni-rent-backend.onrender.com/api/create-order/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: booking.item.price_per_day || 500,
            booking_id: booking.id,
          }),
        }
      );

      const data = await response.json();

      const options = {
        key: "rzp_live_SZou5LgBiy1ewg",
        amount: data.amount,
        currency: "INR",
        name: "UniRent",
        description: "Rental Payment",
        order_id: data.order_id,

        handler: async function (res) {
          await fetch(
            "https://uni-rent-backend.onrender.com/api/verify-payment/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_payment_id: res.razorpay_payment_id,
                razorpay_order_id: res.razorpay_order_id,
                razorpay_signature: res.razorpay_signature,
                booking_id: booking.id,
              }),
            }
          );

          alert("Payment Successful ✅");
          fetchBookings();
        },

        prefill: {
          name: booking.requester?.username || "User",
        },

        theme: {
          color: "#00ff99",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  const handleCashPayment = async (bookingId) => {
    try {
      await fetch(
        `https://uni-rent-backend.onrender.com/api/bookings/${bookingId}/cash/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

        }
      );

      alert("Marked as Cash Payment 💵");
      fetchBookings();

    } catch (err) {
      console.error(err);
      alert("Cash update failed");
    }
  };

  // ---------------- CHAT ----------------
  const fetchMessages = async (bookingId) => {
    try {
      const res = await fetch(
        `https://uni-rent-backend.onrender.com/api/bookings/${bookingId}/messages/`,
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
      `https://uni-rent-backend.onrender.com/api/bookings/${bookingId}/send-message/`,
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
    if (bookings.length > 0) {
      bookings.forEach(b => fetchMessages(b.id));
    }
  }, [bookings]);

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
              <img
                src={b.item.image}
                alt="item"
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "10px"
                }}
              />

              <h3>{b.item.title}</h3>

              <p>Owner: {b.item.owner.username}</p>
              {b.is_paid && (
                <p style={{ color: "#00ff99", fontWeight: "bold" }}>
                  ✅ Paid
                </p>
              )}

              {/* 🔥 PAYMENT BUTTONS ADDED HERE */}
              {b.status === "rented" && !b.is_paid && (
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>

                  <button
                    onClick={() => handleCashPayment(b.id)}
                    disabled={b.is_paid}
                    style={{
                      background: "#111",
                      color: "#00ff99",
                      border: "1px solid #00ff99",
                      padding: "10px",
                      borderRadius: "8px",
                      cursor: b.is_paid ? "not-allowed" : "pointer",
                      opacity: b.is_paid ? 0.6 : 1,
                    }}
                  >
                    💵 Pay Cash
                  </button>

                  <button
                    onClick={() => handleOnlinePayment(b)}
                    disabled={b.is_paid}
                    style={{
                      background: b.is_paid ? "#555" : "#00ff99",
                      color: "black",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "none",
                      cursor: b.is_paid ? "not-allowed" : "pointer",
                      fontWeight: "bold",
                      opacity: b.is_paid ? 0.6 : 1,
                    }}
                  >
                    {b.is_paid ? "✅ Paid" : "💳 Pay Online"}
                  </button>

                </div>
              )}

              {/* ✅ PAID STATUS */}
              {b.is_paid && (
                <p style={{ color: "#00ff99", fontWeight: "bold" }}>
                  ✅ Paid
                </p>
              )}

              {/* RETURN BUTTON */}
              {b.status === "rented" && (
                <button
                  className="btn primary"
                  onClick={async () => {
                    try {
                      const res = await fetch(
                        `https://uni-rent-backend.onrender.com/api/bookings/${b.id}/mark-returned/`,
                        {
                          method: "POST",
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );

                      const data = await res.json();

                      if (!res.ok) {
                        alert(data.error || "Failed to mark returned");
                        return;
                      }

                      alert("Item returned ✅");
                      fetchBookings(); // refresh UI

                    } catch (err) {
                      console.error(err);
                      alert("Server error");
                    }
                  }}
                >
                  Mark as Returned
                </button>
              )}

              {/* CHAT (unchanged) */}
              <div style={{ marginTop: "15px" }}>
                <h4>Chat</h4>

                <div style={{
                  background: "#111",
                  padding: "10px",
                  borderRadius: "8px",
                  marginTop: "10px",
                  maxHeight: "200px",
                  overflowY: "auto",
                }}>
                  {(messages[b.id] || []).map((msg) => (
                    <div key={msg.id} style={{
                      textAlign: msg.sender_id === userId ? "right" : "left",
                      marginBottom: "5px",
                    }}>
                      <span style={{
                        background: msg.sender_id === userId ? "#b6ff3b" : "#333",
                        padding: "5px 10px",
                        borderRadius: "10px",
                        color: msg.sender_id === userId ? "black" : "white",
                      }}>
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