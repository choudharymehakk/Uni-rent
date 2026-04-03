import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function AddItem() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [deposit, setDeposit] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title || !price || !deposit || !image) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("price_per_day", price);
      formData.append("deposit_amount", deposit);
      formData.append("image", image);

      const res = await fetch(
        "https://uni-rent-backend.onrender.com/api/items/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Item added successfully!");
        navigate("/dashboard");
      } else {
        console.error("API Error:", data);
        alert("Failed to add item");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="page" style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "25px" }}>Add New Item</h1>

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
              type="text"
              placeholder="Item Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              type="number"
              placeholder="Price per day"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <input
              type="number"
              placeholder="Deposit amount"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
            />

            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <div style={{ marginTop: "20px" }}>
            <button
              className="btn primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Item"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddItem;