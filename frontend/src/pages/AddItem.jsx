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
  const [loading, setLoading] = useState(false);

  // ---------------- AUTO DEPOSIT LOGIC ----------------

  const handlePriceChange = (e) => {

    const value = e.target.value;

    setPrice(value);

    if (value) {

      const suggestedDeposit = value * 3;

      setDeposit(suggestedDeposit);

    } else {

      setDeposit("");

    }

  };

  // ---------------- SUBMIT ITEM ----------------

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("price_per_day", price);
    formData.append("deposit_amount", deposit);
    formData.append("image", image);

    try {

      const res = await fetch(
        "https://uni-rent-backend.onrender.com/api/items/create/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (res.ok) {

        alert("Item listed successfully");

        navigate("/my-items");

      } else {

        const data = await res.json();

        console.log(data);

        alert("Failed to list item");

      }

    } catch (error) {

      console.error(error);

      alert("Server error");

    }

    setLoading(false);

  };

  return (
    <>



      <div className="page">

        <div className="page-header">
          <h1>List Your Item</h1>
          <p>Add details so others can rent your item.</p>
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
            placeholder="Describe the item condition and usage"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />


          <label>Rent Per Day (₹)</label>

          <input
            type="number"
            placeholder="Example: 200"
            value={price}
            onChange={handlePriceChange}
            required
          />


          <label>Deposit Amount (Refundable)</label>

          <input
            type="number"
            placeholder="Auto suggested (3 × rent)"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
          />


          <label>Upload Item Image</label>

          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />


          <button className="btn primary" disabled={loading}>

            {loading ? "Listing..." : "List Item"}

          </button>

        </form>

      </div>
    </>

  );
}

export default AddItem;