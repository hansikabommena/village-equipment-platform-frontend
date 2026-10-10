
import { useState } from "react";

function Register({ onLogin }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("VILLAGER");

  const handleRegister = async (e) => {

    e.preventDefault();

    if (!name || !email || !phone || !password || !confirmPassword) {
      alert("Please fill all details.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const userData = {
      name: name,
      email: email,
      phone: phone,
      password: password,
      role: role
    };

    try {

      const response = await fetch(
        "http://localhost:8080/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(userData)
        }
      );

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      await response.json();

      alert("Registration successful!");

      onLogin();

    } catch (error) {

      console.error(error);

      alert("Unable to register. Please try again.");

    }
  };

  return (
    <div className="login-page">

      <div className="login-box">

        <h1>🌾 VillageShare</h1>

        <h2>Create Account</h2>

        <p>
          Join your village resource community
        </p>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="VILLAGER">
              👤 Villager
            </option>

            <option value="OWNER">
              🏠 Resource Owner
            </option>

            <option value="ADMIN">
              👨‍💼 Admin
            </option>
          </select>

          <button
            type="submit"
            className="login-btn"
          >
            Register
          </button>

        </form>

        <p className="signup-text">
          Already have an account?
        </p>

        <button
          className="link-btn"
          onClick={onLogin}
        >
          Login
        </button>

      </div>

    </div>
  );
}

export default Register;