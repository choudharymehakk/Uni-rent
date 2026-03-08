import { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function AddItem() {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [deposit, setDeposit] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {

    e.preventDefault();

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("price_per_day", price);
    formData.append("deposit_amount", deposit);
    formData.append("image", image);

    const res = await fetch(
      "http://127.0.0.1:8000/api/items/create/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData
      }
    );

    if (res.ok) {

      alert("Item listed successfully");

      navigate("/my-items");

    } else {

      alert("Error listing item");

    }
  };

  return (
    <>
      <Navbar />

      <div className="page">

        <div className="page-header">
          <h1>List Your Item</h1>
        </div>

        <form className="form" onSubmit={handleSubmit}>

          <label>Item Title</label>
          <input
            type="text"
            placeholder="Example: DSLR Camera"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Description</label>
          <textarea
            placeholder="Describe your item"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label>Rent Per Day (₹)</label>
          <input
            type="number"
            placeholder="Example: 200"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          {/* DEPOSIT FIELD ADDED HERE */}

          <label>Deposit Amount (Refundable) ₹</label>
          <input
            type="number"
            placeholder="Example: 1000"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            required
          />

          <label>Upload Image</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />

          <button className="btn primary">
            List Item
          </button>

        </form>

      </div>
    </>
  );
}

export default AddItem;