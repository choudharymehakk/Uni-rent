import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function EditProfile() {
    const [form, setForm] = useState({
        email: "",
        branch: "",
        year: "",
        phone: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
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
                setForm(data);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdate = async () => {
        const res = await fetch(
            "https://uni-rent-backend.onrender.com/api/profile/",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(form),
            }
        );

        if (res.ok) {
            alert("Profile updated");
            navigate("/profile");
        }
    };

    return (
        <>
            <Navbar />

            <div className="page" style={{ maxWidth: "900px", margin: "0 auto" }}>
                <h1 style={{ marginBottom: "25px" }}>Edit Profile</h1>

                <div
                    style={{
                        background: "#0f172a",
                        padding: "25px",
                        borderRadius: "12px",
                        border: "1px solid #1f2937",
                    }}
                >
                    <div className="form-group">

                        <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Email"
                        />

                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Phone"
                        />

                        <input
                            name="branch"
                            value={form.branch}
                            onChange={handleChange}
                            placeholder="Branch"
                        />

                        <input
                            name="year"
                            value={form.year}
                            onChange={handleChange}
                            placeholder="Year"
                        />

                    </div>

                    <div style={{ marginTop: "20px" }}>
                        <button className="btn primary" onClick={handleUpdate}>
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EditProfile;