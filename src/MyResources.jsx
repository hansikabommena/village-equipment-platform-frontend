import { useEffect, useState } from "react";

function MyResources({ onBack }) {

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingResource, setEditingResource] = useState(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");


  const loadResources = () => {

    const savedUser = JSON.parse(
      localStorage.getItem("loggedInUser")
    );

    if (!savedUser) {
      setLoading(false);
      return;
    }

    fetch(
      `http://localhost:8080/api/resources/owner/${savedUser.email}`
    )
      .then((response) => {

        if (!response.ok) {
          throw new Error("Failed to fetch resources");
        }

        return response.json();
      })
      .then((data) => {

        setResources(data);
        setLoading(false);

      })
      .catch((error) => {

        console.error(error);
        setLoading(false);

      });
  };


  useEffect(() => {
    loadResources();
  }, []);


  // =========================
  // DELETE RESOURCE
  // =========================

  const deleteResource = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resource?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      const response = await fetch(
        `http://localhost:8080/api/resources/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      alert("Resource deleted successfully!");

      loadResources();

    } catch (error) {

      console.error(error);

      alert(
        "Unable to delete resource. It may have existing bookings."
      );

    }
  };


  // =========================
  // OPEN EDIT FORM
  // =========================

  const startEdit = (resource) => {

    setEditingResource(resource);

    setName(resource.name);
    setCategory(resource.category);
    setLocation(resource.location);
    setPrice(resource.price);

  };


  // =========================
  // UPDATE RESOURCE
  // =========================

  const updateResource = async (e) => {

    e.preventDefault();

    if (
      !name ||
      !category ||
      !location ||
      !price
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {

      const response = await fetch(
        `http://localhost:8080/api/resources/${editingResource.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({

            name: name,
            category: category,
            location: location,
            price: Number(price)

          })
        }
      );

      if (!response.ok) {
        throw new Error("Update failed");
      }

      alert("Resource updated successfully!");

      setEditingResource(null);

      setName("");
      setCategory("");
      setLocation("");
      setPrice("");

      loadResources();

    } catch (error) {

      console.error(error);

      alert("Unable to update resource.");

    }
  };


  // =========================
  // EDIT PAGE
  // =========================

  if (editingResource) {

    return (

      <div className="bookings-page">

        <button
          className="back-btn"
          onClick={() =>
            setEditingResource(null)
          }
        >
          ← Back to My Resources
        </button>


        <div className="booking-card">

          <h1>
            ✏️ Edit Resource
          </h1>

          <p>
            Update your resource details
          </p>


          <form onSubmit={updateResource}>

            <label>
              Resource Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter resource name"
            />


            <label>
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >

              <option value="">
                Select Category
              </option>

              <option value="Tractor">
                Tractor
              </option>

              <option value="Sprayer">
                Sprayer
              </option>

              <option value="Tanker">
                Tanker
              </option>

              <option value="Harvester">
                Harvester
              </option>

              <option value="Tools">
                Tools
              </option>

              <option value="Hall">
                Hall
              </option>

            </select>


            <label>
              Location
            </label>

            <input
              type="text"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
              placeholder="Enter location"
            />


            <label>
              Price per Day
            </label>

            <input
              type="number"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              placeholder="Enter price"
            />


            <button
              type="submit"
              className="confirm-booking-btn"
            >
              💾 Save Changes
            </button>

          </form>

        </div>

      </div>

    );
  }


  // =========================
  // MY RESOURCES PAGE
  // =========================

  return (

    <div className="bookings-page">

      <button
        className="back-btn"
        onClick={onBack}
      >
        ← Back to Owner Dashboard
      </button>


      <div className="bookings-header">

        <h1>
          📦 My Resources
        </h1>

        <p>
          Manage the resources you have added
        </p>

      </div>


      {loading ? (

        <p className="no-bookings">
          Loading resources...
        </p>

      ) : resources.length === 0 ? (

        <p className="no-bookings">
          You have not added any resources yet.
        </p>

      ) : (

        <div className="bookings-list">

          {resources.map((resource) => (

            <div
              className="booking-list-card"
              key={resource.id}
            >

              <div className="booking-info">

                <h2>
                  {resource.name}
                </h2>

                <p>
                  📂 Category: {resource.category}
                </p>

                <p>
                  📍 Location: {resource.location}
                </p>

                <p>
                  💰 ₹{resource.price} / day
                </p>

                <p>
                  👤 Owner: {resource.owner}
                </p>

              </div>


              <div className="booking-status">

                <button
                  className="edit-profile-btn"
                  onClick={() =>
                    startEdit(resource)
                  }
                >
                  ✏️ Edit
                </button>


                <button
                  className="reject-btn"
                  onClick={() =>
                    deleteResource(resource.id)
                  }
                >
                  🗑️ Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );
}

export default MyResources;