import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import Navbar from "../components/Navbar";

function ScanQR() {

    const [scanning, setScanning] = useState(false);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    const startScanner = () => {

        setScanning(true);

        const scanner = new Html5Qrcode("reader");

        scanner.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: 250
            },
            async (decodedText) => {

                try {

                    const bookingId = decodedText.replace("BOOKING_", "");

                    const res = await fetch(
                        `http://127.0.0.1:8000/api/bookings/${bookingId}/pickup/`,
                        {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );

                    if (res.ok) {

                        setMessage("✅ Pickup verified successfully");

                    } else {

                        setMessage("❌ Invalid QR code");

                    }

                    scanner.stop();

                } catch (error) {

                    console.error(error);
                    setMessage("❌ Error scanning QR");

                }

            }
        );

    };

    return (

        <>
            <Navbar />

            <div className="page">

                <div className="page-header">
                    <h1>Pickup Verification</h1>
                </div>

                <div className="scan-card">

                    <h3>Scan Pickup QR</h3>

                    <p className="meta">
                        Ask the owner to show the QR code generated for your booking.
                        Scan it to verify the pickup of the item.
                    </p>

                    {!scanning && (

                        <button
                            className="btn primary"
                            onClick={startScanner}
                        >
                            Start Scanner
                        </button>

                    )}

                    <div
                        id="reader"
                        style={{
                            width: "320px",
                            marginTop: "20px"
                        }}
                    />

                    {message && (

                        <p style={{ marginTop: "15px", fontWeight: "600" }}>
                            {message}
                        </p>

                    )}

                </div>

            </div>

        </>
    );

}

export default ScanQR;