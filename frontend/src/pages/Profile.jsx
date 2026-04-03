import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(
                    "https://uni-rent-backend.onrender.com/api/profile/",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                const data = await res.json();

                if (res.ok) {
                    setUser(data);
                } else {
                    if (res.status === 401) {
                        localStorage.removeItem("token");
                        navigate("/login");
                    }
                }

                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    return (
        <>
            <Navbar />

            <div className="page" style={{ maxWidth: "1100px", margin: "0 auto" }}>
                <h1 style={{ marginBottom: "25px" }}>My Profile</h1>

                {loading ? (
                    <p style={{ color: "var(--muted)" }}>Loading profile...</p>
                ) : user && (
                    <>
                        {/* TOP SECTION */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "30px",
                            }}
                        >
                            <div>
                                <h2 style={{ marginBottom: "5px" }}>{user.username}</h2>
                                <p style={{ color: "var(--muted)" }}>{user.email}</p>
                                <p style={{ color: "var(--muted)" }}>
                                    {user.branch} • Year {user.year}
                                </p>
                            </div>

                            <button
                                className="btn secondary"
                                onClick={() => navigate("/edit-profile")}
                            >
                                Edit Profile
                            </button>
                        </div>

                        <hr style={{ borderColor: "#1f2937", marginBottom: "30px" }} />

                        {/* STATS SECTION */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(3, 1fr)",
                                gap: "20px",
                                marginBottom: "35px",
                            }}
                        >
                            <div className="stat-card">
                                <h2>{user.total_items}</h2>
                                <p>My Items</p>
                            </div>

                            <div className="stat-card">
                                <h2>{user.incoming_requests}</h2>
                                <p>Requests</p>
                            </div>

                            <div className="stat-card">
                                <h2>{user.total_bookings || 0}</h2>
                                <p>Bookings</p>
                            </div>
                        </div>

                        {/* ACTION SECTION */}
                        <div style={{ display: "flex", gap: "15px" }}>
                            <button
                                className="btn primary"
                                onClick={() => navigate("/my-items")}
                            >
                                My Items
                            </button>

                            <button
                                className="btn primary"
                                onClick={() => navigate("/add-item")}
                            >
                                + List New Item
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default Profile;