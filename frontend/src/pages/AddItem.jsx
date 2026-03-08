import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function AddItem() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async () => {

    if (!title || !description || !price || !category || !condition || !image) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("price_per_day", price);
    formData.append("category", category);
    formData.append("condition", condition);
    formData.append("image", image);

    try {

      const res = await fetch(
        "http://127.0.0.1:8000/api/items/create/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      );

      if (res.ok) {
        navigate("/my-items");
      } else {
        setError("Failed to create item. Try again.");
      }

    } catch (err) {
      setError("Server error. Try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />

      <div className="form-page">

        <button
          className="btn ghost sm"
          onClick={() => navigate("/dashboard")}
          style={{ marginBottom: "24px" }}
        >
          ← Back
        </button>

        <h1>List an Item</h1>

        <div className="form-stack">

          <div>
            <label>Item Title</label>
            <input
              placeholder="e.g. Scientific Calculator"
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label>Description</label>
            <textarea
              rows={4}
              placeholder="Describe your item..."
              onChange={e => setDescription(e.target.value)}
              style={{ resize: "vertical" }}
            />
          </div>

          <div>
            <label>Category</label>
            <select onChange={e => setCategory(e.target.value)}>
              <option value="">Select category</option>
              <option>Electronics</option>
              <option>Books</option>
              <option>Tools</option>
              <option>Sports</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label>Condition</label>
            <select onChange={e => setCondition(e.target.value)}>
              <option value="">Select condition</option>
              <option>New</option>
              <option>Like New</option>
              <option>Good</option>
              <option>Used</option>
            </select>
          </div>

          <div>
            <label>Price per day (₹)</label>
            <input
              type="number"
              placeholder="e.g. 50"
              onChange={e => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label>Upload Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setImage(e.target.files[0])}
            />
          </div>

          {error && (
            <p style={{ color: "var(--danger)", fontSize: "14px" }}>
              {error}
            </p>
          )}

          <button
            className="btn primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Listing..." : "List Item"}
          </button>

        </div>

      </div>
    </>
  );
}

export default AddItem;