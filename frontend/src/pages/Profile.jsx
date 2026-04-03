import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
                        window.location.href = "/login";
                    }
                }

                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return (
        <>
            <Navbar />

            <div className="page">
                {loading ? (
                    <p style={{ color: "var(--muted)" }}>Loading profile...</p>
                ) : user && (
                    <>
                        {/* PROFILE CARD */}
                        <div className="profile-card-modern">
                            <div className="profile-left">
                                <div className="avatar">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>

                                <div>
                                    <h2>{user.username}</h2>
                                    <p style={{ color: "var(--muted)" }}>{user.email}</p>
                                    <p style={{ color: "var(--muted)" }}>
                                        {user.branch} • Year {user.year}
                                    </p>
                                </div>
                            </div>

                            <div className="profile-actions">
                                <button className="btn primary">Edit Profile</button>
                            </div>
                        </div>

                        {/* STATS */}
                        <div className="stats-grid">
                            <div className="stat-box">
                                <h3>{user.total_items}</h3>
                                <p>My Items</p>
                            </div>

                            <div className="stat-box">
                                <h3>{user.incoming_requests}</h3>
                                <p>Requests</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default Profile;