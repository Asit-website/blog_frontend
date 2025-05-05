import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// const baseurl = "https://blog-back-7jx6.onrender.com";
// const baseurl = "http://localhost:4000";
const baseurl = `https://backblog.kusheldigi.com`


function Login({setToken}) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${baseurl}/api/v1/auth/login`, formData);
      console.log('resonse',response);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        alert("Login successful!");
        setToken(response.data.token);
        navigate("/")
      }
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;


const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f5f5f5",
    },
    card: {
      width: "100%",
      maxWidth: "400px",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      padding: "20px 30px",
    },
    heading: {
      fontSize: "24px",
      color: "#333333",
      textAlign: "center",
      marginBottom: "20px",
      fontWeight: "600",
    },
    inputGroup: {
      marginBottom: "15px",
    },
    label: {
      fontSize: "14px",
      color: "#555555",
      marginBottom: "5px",
      display: "block",
      fontWeight: "500",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      fontSize: "14px",
      border: "1px solid #cccccc",
      borderRadius: "4px",
      outline: "none",
    },
    inputFocus: {
      borderColor: "#0066ff",
    },
    button: {
      width: "100%",
      padding: "10px 15px",
      backgroundColor: "#0066ff",
      color: "#ffffff",
      border: "none",
      borderRadius: "4px",
      fontSize: "16px",
      cursor: "pointer",
      marginTop: "10px",
    },
    buttonDisabled: {
      backgroundColor: "#cccccc",
      cursor: "not-allowed",
    },
    error: {
      color: "red",
      fontSize: "14px",
      marginTop: "10px",
      textAlign: "center",
    },
  };
  