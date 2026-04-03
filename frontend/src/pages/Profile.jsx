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

            <div className="page">
                <h1>My Profile</h1>

                {loading ? (
                    <p style={{ color: "var(--muted)" }}>Loading profile...</p>
                ) : user && (
                    <div className="profile-card">

                        <h2>{user.username}</h2>

                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Branch:</strong> {user.branch}</p>
                        <p><strong>Year:</strong> {user.year}</p>

                        <hr style={{ margin: "15px 0", borderColor: "#1f2937" }} />

                        {/* STATS */}
                        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                            <div>
                                <strong style={{ color: "#22c55e" }}>
                                    {user.total_items}
                                </strong>
                                <p style={{ color: "var(--muted)", fontSize: "14px" }}>
                                    My Items
                                </p>
                            </div>

                            <div>
                                <strong style={{ color: "#22c55e" }}>
                                    {user.incoming_requests}
                                </strong>
                                <p style={{ color: "var(--muted)", fontSize: "14px" }}>
                                    Requests
                                </p>
                            </div>

                            <div>
                                <strong style={{ color: "#22c55e" }}>
                                    {user.total_bookings || 0}
                                </strong>
                                <p style={{ color: "var(--muted)", fontSize: "14px" }}>
                                    Bookings
                                </p>
                            </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button
                                className="btn primary"
                                onClick={() => navigate("/edit-profile")}
                            >
                                Edit Profile
                            </button>

                            <button
                                className="btn secondary"
                                onClick={() => navigate("/my-items")}
                            >
                                My Items
                            </button>

                            <button
                                className="btn secondary"
                                onClick={() => navigate("/add-item")}
                            >
                                + List Item
                            </button>
                        </div>

                    </div>
                )}
            </div>
        </>
    );
}

export default Profile;