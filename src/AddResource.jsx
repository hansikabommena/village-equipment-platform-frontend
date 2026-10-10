import { useState } from "react";

function AddResource({ onBack, onAddResource }) {

  const savedUser = JSON.parse(
    localStorage.getItem("loggedInUser")
  );

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Tractor");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");

  const owner = savedUser?.name || "";
  const ownerEmail = savedUser?.email || "";

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!name || !location || !price) {
      alert("Please fill all details.");
      return;
    }

    if (!savedUser) {
      alert("Please login first.");
      return;
    }

    const newResource = {
      name: name,
      category: category,
      location: location,
      price: Number(price),
      owner: owner,
      ownerEmail: ownerEmail,
      image: null
    };

    try {

      const response = await fetch(
        "http://localhost:8080/api/resources",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newResource)
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add resource");
      }

      const savedResource = await response.json();

      alert("Resource added successfully!");

      onAddResource(savedResource);

    } catch (error) {

      console.error(error);

      alert(
        "Something went wrong. Please check backend."
      );

    }
  };

  return (
    <div className="add-resource-page">

      <button
        className="back-btn"
        onClick={onBack}
      >
        ← Back to Home
      </button>

      <div className="add-resource-card">

        <h1>Add New Resource</h1>

        <p>
          Share your equipment or resource with people in your village.
        </p>

        <form onSubmit={handleSubmit}>

          <label>Resource Name</label>

          <input
            type="text"
            placeholder="Example: Tractor"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Category</label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >

            <option value="Tractor">🚜 Tractor</option>
            <option value="Sprayer">🌱 Sprayer</option>
            <option value="Tanker">💧 Tanker</option>
            <option value="Harvester">🌾 Harvester</option>
            <option value="Tools">🛠️ Tools</option>
            <option value="Hall">🏠 Hall</option>

          </select>

          <label>Location</label>

          <input
            type="text"
            placeholder="Example: Warangal"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <label>Price Per Day</label>

          <input
            type="number"
            placeholder="Example: 800"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <label>Owner Name</label>

          <input
            type="text"
            value={owner}
            readOnly
          />

          <button
            type="submit"
            className="add-resource-btn"
          >
            Add Resource
          </button>

        </form>

      </div>

    </div>
  );
}

export default AddResource;