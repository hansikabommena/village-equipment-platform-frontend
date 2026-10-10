import { useState } from "react";

function Login({ onRegister, onLogin }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {

      const response = await fetch(
        "http://localhost:8080/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: email,
            password: password
          })
        }
      );

      if (!response.ok) {
        alert("Invalid email or password.");
        return;
      }

      const user = await response.json();

      console.log("Logged in user:", user);

      localStorage.setItem(
        "loggedInUser",
        JSON.stringify(user)
      );

      alert("Login successful!");

      onLogin();

    } catch (error) {

      console.error(error);

      alert("Unable to connect to backend.");

    }
  };

  return (
    <div className="login-page">

      <div className="login-box">

        {/* PROJECT NAME */}
        <h1>🌾 Village Equipment</h1>

        <h2>Welcome Back!</h2>

        <p>
          Login to continue sharing resources
        </p>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="login-btn"
          >
            Login
          </button>

        </form>

        <p className="signup-text">
          Don't have an account?
        </p>

        <button
          className="link-btn"
          onClick={onRegister}
        >
          Register
        </button>

      </div>

    </div>
  );
}

export default Login;