import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Profile() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        phone: "",
        branch: "",
        year: ""
    });

    const fetchProfile = () => {
        fetch("https://uni-rent-backend.onrender.com/api/profile/", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                setUser(data);
                setForm(data);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const updateProfile = async () => {
        try {
            const res = await fetch(
                "https://uni-rent-backend.onrender.com/api/profile/update/",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(form),
                }
            );

            if (!res.ok) {
                alert("Update failed");
                return;
            }

            alert("Profile updated ✅");

            setEditing(false);
            fetchProfile();

        } catch (err) {
            console.error(err);
            alert("Error updating profile");
        }
    };

    return (
        <>
            <Navbar />

            <div style={{ padding: "30px", display: "flex", gap: "20px" }}>

                {loading ? (
                    <p>Loading...</p>
                ) : (

                    <>
                        {/* LEFT PROFILE */}
                        <div
                            style={{
                                flex: 2,
                                background: "#111",
                                borderRadius: "16px",
                                padding: "25px",
                                border: "1px solid #222"
                            }}
                        >

                            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>

                                <div
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        borderRadius: "50%",
                                        background: "#b6ff3b",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "30px",
                                        fontWeight: "bold",
                                        color: "black"
                                    }}
                                >
                                    {user.username[0].toUpperCase()}
                                </div>

                                <div>
                                    <h2>{user.username}</h2>

                                    {/* EMAIL */}
                                    <p>
                                        {editing ? (
                                            <input
                                                value={form.email}
                                                onChange={(e) =>
                                                    setForm({ ...form, email: e.target.value })
                                                }
                                            />
                                        ) : user.email}
                                    </p>

                                    {/* PHONE */}
                                    <p>
                                        {editing ? (
                                            <input
                                                value={form.phone}
                                                onChange={(e) =>
                                                    setForm({ ...form, phone: e.target.value })
                                                }
                                            />
                                        ) : user.phone}
                                    </p>

                                </div>
                            </div>

                            {/* DETAILS */}
                            <div style={{ marginTop: "20px" }}>

                                <p>
                                    <b>Branch:</b>{" "}
                                    {editing ? (
                                        <input
                                            value={form.branch}
                                            onChange={(e) =>
                                                setForm({ ...form, branch: e.target.value })
                                            }
                                        />
                                    ) : user.branch}
                                </p>

                                <p>
                                    <b>Year:</b>{" "}
                                    {editing ? (
                                        <input
                                            value={form.year}
                                            onChange={(e) =>
                                                setForm({ ...form, year: e.target.value })
                                            }
                                        />
                                    ) : user.year}
                                </p>

                                <p><b>Total Items:</b> {user.total_items}</p>

                            </div>

                            {/* BUTTONS */}
                            <div style={{ marginTop: "20px" }}>

                                {!editing ? (
                                    <button
                                        className="btn primary"
                                        onClick={() => setEditing(true)}
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            className="btn primary"
                                            onClick={updateProfile}
                                        >
                                            Save
                                        </button>

                                        <button
                                            className="btn secondary"
                                            onClick={() => setEditing(false)}
                                            style={{ marginLeft: "10px" }}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}

                            </div>

                        </div>

                        {/* RIGHT PANEL */}
                        <div style={{ flex: 1 }}>

                            <div
                                style={{
                                    background: "#111",
                                    padding: "20px",
                                    borderRadius: "16px",
                                    border: "1px solid #222"
                                }}
                            >
                                <h3>Quick Actions</h3>

                                <button
                                    className="btn primary"
                                    style={{ width: "100%", marginTop: "10px" }}
                                    onClick={() => navigate("/add-item")}
                                >
                                    + Add Item
                                </button>

                                <button
                                    className="btn secondary"
                                    style={{ width: "100%", marginTop: "10px" }}
                                    onClick={() => navigate("/my-items")}
                                >
                                    View My Items
                                </button>

                            </div>

                        </div>

                    </>
                )}

            </div>
        </>
    );
}

export default Profile;