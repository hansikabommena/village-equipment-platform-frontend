import { useState } from "react";

function Profile({ onBack, onLogout }) {

  const savedUser = JSON.parse(
    localStorage.getItem("loggedInUser")
  );

  const [user, setUser] = useState(savedUser);

  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(savedUser?.name || "");
  const [email, setEmail] = useState(savedUser?.email || "");
  const [phone, setPhone] = useState(savedUser?.phone || "");

  const [loading, setLoading] = useState(false);

  const handleEditProfile = () => {
    setEditing(true);
  };

  const handleSaveProfile = async (e) => {

    e.preventDefault();

    if (!name || !email || !phone) {
      alert("Please fill all details.");
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        `http://localhost:8080/api/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: name,
            email: email,
            phone: phone
          })
        }
      );

      if (!response.ok) {
        throw new Error("Profile update failed");
      }

      const updatedUser = await response.json();

      setUser(updatedUser);

      localStorage.setItem(
        "loggedInUser",
        JSON.stringify(updatedUser)
      );

      setEditing(false);

      alert("Profile updated successfully!");

    } catch (error) {

      console.error(error);

      alert("Unable to update profile.");

    } finally {

      setLoading(false);

    }
  };

  const handleLogout = () => {

    localStorage.removeItem("loggedInUser");

    onLogout();
  };

  return (
    <div className="profile-page">

      <button
        className="back-btn"
        onClick={onBack}
      >
        ← Back to Home
      </button>

      <div className="profile-card">

        <div className="profile-icon">
          👤
        </div>

        <h1>My Profile</h1>

        <p className="profile-subtitle">
          Manage your VillageShare account
        </p>

        {editing ? (

          <form onSubmit={handleSaveProfile}>

            <div className="profile-edit-form">

              <label>
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />

              <label>
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

              <label>
                Phone Number
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
              />

              <button
                type="submit"
                className="edit-profile-btn"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : "💾 Save Changes"}
              </button>

              <button
                type="button"
                className="logout-btn"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>

            </div>

          </form>

        ) : (

          <>
            <div className="profile-details">

              <div className="profile-item">
                <span>👤</span>

                <div>
                  <small>Full Name</small>
                  <p>
                    {user?.name || "Not available"}
                  </p>
                </div>
              </div>

              <div className="profile-item">
                <span>📧</span>

                <div>
                  <small>Email</small>
                  <p>
                    {user?.email || "Not available"}
                  </p>
                </div>
              </div>

              <div className="profile-item">
                <span>📱</span>

                <div>
                  <small>Phone Number</small>
                  <p>
                    {user?.phone || "Not available"}
                  </p>
                </div>
              </div>

              <div className="profile-item">
                <span>👤</span>

                <div>
                  <small>Role</small>
                  <p>
                    {user?.role || "VILLAGER"}
                  </p>
                </div>
              </div>

            </div>

            <button
              className="edit-profile-btn"
              onClick={handleEditProfile}
            >
              ✏️ Edit Profile
            </button>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              🚪 Logout
            </button>

          </>

        )}

      </div>

    </div>
  );
}

export default Profile;