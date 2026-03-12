import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function Profile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem("user_id");

        fetch(`http://127.0.0.1:8000/api/users/${userId}/`)
            .then((res) => res.json())
            .then((data) => {
                setUser(data);
            })
            .catch((err) => console.error("Error fetching profile:", err));
    }, []);

    if (!user) return <p style={{ padding: "20px" }}>Loading profile...</p>;

    return (
        <>
            <Navbar />

            <div className="page">
                <h1>My Profile</h1>

                <div className="profile-card">
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone:</strong> {user.phone}</p>
                    <p><strong>Branch:</strong> {user.branch}</p>
                    <p><strong>Year:</strong> {user.year}</p>
                </div>
            </div>
        </>
    );
}

export default Profile;