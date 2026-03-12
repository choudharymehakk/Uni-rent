import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function Profile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem("user_id");

        fetch(`http://127.0.0.1:8000/api/users/${userId}/`)
            .then((res) => res.json())
            .then((data) => setUser(data))
            .catch((err) => console.error("Error fetching profile:", err));
    }, []);

    if (!user) return <p style={{ padding: "20px" }}>Loading profile...</p>;

    return (
        <>
            <Navbar />

            <div className="profile-page">
                <div className="profile-card">

                    <div className="profile-header">
                        <div className="avatar">
                            {user.username.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <h2>{user.username}</h2>
                            <p className="branch">{user.branch.toUpperCase()} • Year {user.year}</p>
                        </div>
                    </div>

                    <div className="profile-info">
                        <div className="info-row">
                            <span>Email</span>
                            <p>{user.email}</p>
                        </div>

                        <div className="info-row">
                            <span>Phone</span>
                            <p>{user.phone}</p>
                        </div>

                        <div className="info-row">
                            <span>Branch</span>
                            <p>{user.branch}</p>
                        </div>

                        <div className="info-row">
                            <span>Year</span>
                            <p>{user.year}</p>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default Profile;