import { useEffect, useState } from "react";

function AdminDashboard({ onBack }) {
  const [users, setUsers] = useState([]);
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const [editingResource, setEditingResource] = useState(null);
  const [resourceName, setResourceName] = useState("");
  const [resourceCategory, setResourceCategory] = useState("");
  const [resourceLocation, setResourceLocation] = useState("");
  const [resourcePrice, setResourcePrice] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [
        usersResponse,
        resourcesResponse,
        bookingsResponse
      ] = await Promise.all([
        fetch("http://localhost:8080/api/users"),
        fetch("http://localhost:8080/api/resources"),
        fetch("http://localhost:8080/api/bookings"),
      ]);

      if (
        !usersResponse.ok ||
        !resourcesResponse.ok ||
        !bookingsResponse.ok
      ) {
        throw new Error("Failed to load dashboard data");
      }

      const usersData = await usersResponse.json();
      const resourcesData = await resourcesResponse.json();
      const bookingsData = await bookingsResponse.json();

      setUsers(usersData);
      setResources(resourcesData);
      setBookings(bookingsData);
      setLoading(false);

    } catch (error) {
      console.error(error);
      alert("Unable to load admin dashboard.");
      setLoading(false);
    }
  };

  // =========================
  // USER EDIT
  // =========================

  const startEditUser = (user) => {
    setEditingUser(user);
    setEditName(user.name || "");
    setEditEmail(user.email || "");
    setEditPhone(user.phone || "");
  };

  const updateUser = async (e) => {
    e.preventDefault();

    if (!editName || !editEmail || !editPhone) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/users/${editingUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editName,
            email: editEmail,
            phone: editPhone,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        alert(
          "Unable to update user.\n\n" +
          "Status: " +
          response.status +
          "\n" +
          errorText
        );

        return;
      }

      const updatedUser = await response.json();

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user.id === updatedUser.id
            ? updatedUser
            : user
        )
      );

      alert("User updated successfully!");

      setEditingUser(null);
      setEditName("");
      setEditEmail("");
      setEditPhone("");

    } catch (error) {
      console.error(error);
      alert(
        "Unable to connect to backend.\n\n" +
        error.message
      );
    }
  };

  // =========================
  // USER DELETE
  // =========================

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/users/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        alert(
          "Unable to delete user.\n\n" +
          "Status: " +
          response.status +
          "\n" +
          errorText
        );

        return;
      }

      setUsers((previousUsers) =>
        previousUsers.filter(
          (user) => user.id !== id
        )
      );

      alert("User deleted successfully!");

    } catch (error) {
      console.error(error);

      alert(
        "Unable to connect to backend.\n\n" +
        error.message
      );
    }
  };

  // =========================
  // RESOURCE EDIT
  // =========================

  const startEditResource = (resource) => {
    setEditingResource(resource);

    setResourceName(resource.name || "");
    setResourceCategory(resource.category || "");
    setResourceLocation(resource.location || "");
    setResourcePrice(resource.price || "");
  };

  const updateResource = async (e) => {
    e.preventDefault();

    if (
      !resourceName ||
      !resourceCategory ||
      !resourceLocation ||
      !resourcePrice
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
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: resourceName,
            category: resourceCategory,
            location: resourceLocation,
            price: Number(resourcePrice),
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        alert(
          "Unable to update resource.\n\n" +
          "Status: " +
          response.status +
          "\n" +
          errorText
        );

        return;
      }

      const updatedResource = await response.json();

      setResources((previousResources) =>
        previousResources.map((resource) =>
          resource.id === updatedResource.id
            ? updatedResource
            : resource
        )
      );

      alert("Resource updated successfully!");

      setEditingResource(null);
      setResourceName("");
      setResourceCategory("");
      setResourceLocation("");
      setResourcePrice("");

    } catch (error) {
      console.error(error);

      alert(
        "Unable to connect to backend.\n\n" +
        error.message
      );
    }
  };

  // =========================
  // RESOURCE DELETE
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
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        alert(
          "Unable to delete resource.\n\n" +
          "Status: " +
          response.status +
          "\n" +
          errorText
        );

        return;
      }

      setResources((previousResources) =>
        previousResources.filter(
          (resource) => resource.id !== id
        )
      );

      alert("Resource deleted successfully!");

    } catch (error) {
      console.error(error);

      alert(
        "Unable to connect to backend.\n\n" +
        error.message
      );
    }
  };

  // =========================
  // BOOKING COUNTS
  // =========================

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "PENDING"
  ).length;

  const approvedBookings = bookings.filter(
    (booking) => booking.status === "APPROVED"
  ).length;

  const rejectedBookings = bookings.filter(
    (booking) => booking.status === "REJECTED"
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "COMPLETED"
  ).length;

  // =========================
  // EDIT USER SCREEN
  // =========================

  if (editingUser) {
    return (
      <div className="profile-page">

        <button
          className="back-btn"
          onClick={() => setEditingUser(null)}
        >
          ← Back to Admin Dashboard
        </button>

        <div className="profile-card admin-card">

          <div className="profile-icon">
            ✏️
          </div>

          <h1>Edit User</h1>

          <p className="profile-subtitle">
            Update registered user details
          </p>

          <form onSubmit={updateUser}>

            <label>Name</label>

            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Enter name"
            />

            <label>Email</label>

            <input
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              placeholder="Enter email"
            />

            <label>Phone</label>

            <input
              type="text"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              placeholder="Enter phone"
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
  // EDIT RESOURCE SCREEN
  // =========================

  if (editingResource) {
    return (
      <div className="profile-page">

        <button
          className="back-btn"
          onClick={() => setEditingResource(null)}
        >
          ← Back to Admin Dashboard
        </button>

        <div className="profile-card admin-card">

          <div className="profile-icon">
            ✏️
          </div>

          <h1>Edit Resource</h1>

          <p className="profile-subtitle">
            Update resource details
          </p>

          <form onSubmit={updateResource}>

            <label>Resource Name</label>

            <input
              type="text"
              value={resourceName}
              onChange={(e) =>
                setResourceName(e.target.value)
              }
              placeholder="Enter resource name"
            />

            <label>Category</label>

            <select
              value={resourceCategory}
              onChange={(e) =>
                setResourceCategory(e.target.value)
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

            <label>Location</label>

            <input
              type="text"
              value={resourceLocation}
              onChange={(e) =>
                setResourceLocation(e.target.value)
              }
              placeholder="Enter location"
            />

            <label>Price per Day</label>

            <input
              type="number"
              value={resourcePrice}
              onChange={(e) =>
                setResourcePrice(e.target.value)
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
  // ADMIN DASHBOARD
  // =========================

  return (
    <div className="profile-page">

      <button
        className="back-btn"
        onClick={onBack}
      >
        ← Back to Home
      </button>

      <div className="profile-card admin-card">

        <div className="profile-icon">
          👨‍💼
        </div>

        <h1>
          Admin Dashboard
        </h1>

        <p className="profile-subtitle">
          Monitor and manage the Village Equipment platform
        </p>

        {loading ? (

          <p>Loading dashboard...</p>

        ) : (

          <>

            {/* STATISTICS */}

            <div className="admin-stats">

              <div className="admin-stat-card">
                <h2>👥</h2>
                <h3>{users.length}</h3>
                <p>Total Users</p>
              </div>

              <div className="admin-stat-card">
                <h2>📦</h2>
                <h3>{resources.length}</h3>
                <p>Total Resources</p>
              </div>

              <div className="admin-stat-card">
                <h2>📋</h2>
                <h3>{bookings.length}</h3>
                <p>Total Bookings</p>
              </div>

              <div className="admin-stat-card">
                <h2>🟡</h2>
                <h3>{pendingBookings}</h3>
                <p>Pending Bookings</p>
              </div>

            </div>

            {/* BOOKING SUMMARY */}

            <div className="admin-booking-summary">

              <h2>📊 Booking Summary</h2>

              <p>
                🟡 Pending: {pendingBookings}
              </p>

              <p>
                🟢 Approved: {approvedBookings}
              </p>

              <p>
                🔴 Rejected: {rejectedBookings}
              </p>

              <p>
                ✅ Completed: {completedBookings}
              </p>

            </div>

            {/* REGISTERED USERS */}

            <div className="admin-booking-summary">

              <h2>👥 Registered Users</h2>

              {users.length === 0 ? (

                <p>No users found.</p>

              ) : (

                users.map((user) => (

                  <div
                    key={user.id}
                    className="admin-list-item"
                  >

                    <strong>
                      {user.name}
                    </strong>

                    <span>
                      {user.email} — {user.role}
                    </span>

                    <div className="admin-user-actions">

                      <button
                        className="edit-profile-btn"
                        onClick={() =>
                          startEditUser(user)
                        }
                      >
                        ✏️ Edit
                      </button>

                      <button
                        className="reject-btn"
                        onClick={() =>
                          deleteUser(user.id)
                        }
                      >
                        🗑️ Delete
                      </button>

                    </div>

                  </div>

                ))

              )}

            </div>

            {/* AVAILABLE RESOURCES */}

            <div className="admin-booking-summary">

              <h2>📦 Available Resources</h2>

              {resources.length === 0 ? (

                <p>No resources found.</p>

              ) : (

                resources.map((resource) => (

                  <div
                    key={resource.id}
                    className="admin-list-item"
                  >

                    <strong>
                      {resource.name}
                    </strong>

                    <span>
                      {resource.category} —{" "}
                      {resource.location} — ₹
                      {resource.price}/day
                    </span>

                    <div className="admin-user-actions">

                      <button
                        className="edit-profile-btn"
                        onClick={() =>
                          startEditResource(resource)
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

                ))

              )}

            </div>

            {/* RECENT BOOKINGS */}

            <div className="admin-booking-summary">

              <h2>📋 Recent Bookings</h2>

              {bookings.length === 0 ? (

                <p>No bookings found.</p>

              ) : (

                bookings.map((booking) => (

                  <div
                    key={booking.id}
                    className="admin-list-item"
                  >

                    <strong>
                      {booking.resourceName}
                    </strong>

                    <span>
                      👤 {booking.name} | 📅{" "}
                      {booking.startDate} →{" "}
                      {booking.endDate}
                    </span>

                    <span>
                      Status: {booking.status}
                    </span>

                  </div>

                ))

              )}

            </div>

          </>

        )}

        <button
          className="logout-btn"
          onClick={onBack}
        >
          ← Back to Home
        </button>

      </div>

    </div>
  );
}

export default AdminDashboard;