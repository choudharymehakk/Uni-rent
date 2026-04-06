import axios from "axios";

// 🔥 Load Razorpay script
const loadRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export default function PaymentButton({ booking, user, refresh }) {

    // 💳 ONLINE PAYMENT
    const handleOnlinePayment = async () => {
        const res = await loadRazorpay();

        if (!res) {
            alert("Razorpay SDK failed");
            return;
        }

        try {
            const { data } = await axios.post(
                "https://uni-rent-backend.onrender.com/api/create-order/",
                {
                    amount: booking.item.price_per_day || 500,
                    booking_id: booking.id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const options = {
                key: "YOUR_KEY_ID",
                amount: data.amount,
                currency: "INR",
                name: "UniRent",
                description: "Rental Payment",
                order_id: data.order_id,

                handler: async function (response) {
                    await axios.post(
                        "https://uni-rent-backend.onrender.com/api/verify-payment/",
                        {
                            ...response,
                            booking_id: booking.id,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    );

                    alert("Payment Successful ✅");
                    refresh();
                },

                prefill: {
                    name: user.username,
                    email: user.email,
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

    // 💵 CASH PAYMENT
    const handleCashPayment = async () => {
        try {
            await axios.patch(
                `https://uni-rent-backend.onrender.com/api/bookings/${booking.id}/`,
                {
                    payment_method: "cash",
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            alert("Marked as Cash Payment 💵");
            refresh();

        } catch (err) {
            console.error(err);
            alert("Cash update failed");
        }
    };

    return (
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>

            {/* CASH BUTTON */}
            <button
                onClick={handleCashPayment}
                style={{
                    background: "#111",
                    color: "#00ff99",
                    border: "1px solid #00ff99",
                    padding: "10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                }}
            >
                💵 Pay Cash
            </button>

            {/* ONLINE BUTTON */}
            <button
                onClick={handleOnlinePayment}
                style={{
                    background: "#00ff99",
                    color: "black",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                }}
            >
                💳 Pay Online
            </button>
        </div>
    );
}