import "./App.css";
import { useState } from "react";

import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import Profile from "./Profile";
import OwnerBookings from "./OwnerBookings";
import OwnerDashboard from "./OwnerDashboard";
import MyResources from "./MyResources";
import AdminDashboard from "./AdminDashboard";
function App() {

  const [page, setPage] = useState("login");
  if (page === "adminDashboard") {
  return (
    <AdminDashboard
      onBack={() => setPage("home")}
    />
  );
}

  if (page === "home") {

  return (

    <Home
      onProfile={() => setPage("profile")}
      onLogout={() => setPage("login")}
      onOwnerBookings={() => setPage("ownerBookings")}
      onOwnerDashboard={() => setPage("ownerDashboard")}
      onAdminDashboard={() => setPage("adminDashboard")}
    />

  );

}

  if (page === "profile") {
    return (
      <Profile
        onBack={() => setPage("home")}
        onLogout={() => setPage("login")}
      />
    );
  }
  if (page === "ownerDashboard") {
  return (
    <OwnerDashboard
      onBack={() => setPage("home")}
      onBookingRequests={() => setPage("ownerBookings")}
      onMyResources={() => setPage("myResources")}
    />
  );
}
if (page === "myResources") {
  return (
    <MyResources
      onBack={() => setPage("ownerDashboard")}
    />
  );
}

  if (page === "ownerBookings") {
    return (
      <OwnerBookings
        onBack={() => setPage("home")}
      />
    );
  }

  if (page === "register") {
    return (
      <Register
        onLogin={() => setPage("login")}
      />
    );
  }

  return (
    <Login
      onRegister={() => setPage("register")}
      onLogin={() => setPage("home")}
    />
  );
}

export default App;