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
                    console.error("API Error:", data);
                }

                setLoading(false);
            } catch (err) {
                console.error("Error:", err);
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return (
        <>
            <Navbar />

            <div className="page">
                <h1>My Profile</h1>

                {loading ? (
                    <p style={{ color: "var(--muted)" }}>Loading profile...</p>
                ) : user ? (
                    <div className="profile-card">
                        <h2>{user.username}</h2>

                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Branch:</strong> {user.branch}</p>
                        <p><strong>Year:</strong> {user.year}</p>
                    </div>
                ) : (
                    <p>Unable to load profile</p>
                )}
            </div>
        </>
    );
}

export default Profile;