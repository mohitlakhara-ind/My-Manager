import React, { useState } from "react";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [alert, setAlert] = useState({ show: false, message: "", type: "", head: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = credentials;

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", json.authToken);
        console.log("Login successful");
        setAlert({
          show: true,
          message: "Login successful!",
          type: "success",
          head: "Success",
        });

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setAlert({
          show: true,
          message: json.message || "Invalid credentials",
          type: "danger",
          head: "Error",
        });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setAlert({
        show: true,
        message: "An error occurred. Please try again.",
        type: "danger",
        head: "Error",
      });
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        maxWidth: "400px",
        margin: "auto",
        padding: "2rem",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        backgroundColor: "#fff",
      }}
    >
      <Typography
        component={motion.h1}
        variant="h4"
        align="center"
        mb={2}
        sx={{ fontWeight: "bold" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        Login
      </Typography>
      {alert.show && (
        <Alert severity={alert.type === "success" ? "success" : "error"} sx={{ mb: 2 }}>
          <strong>{alert.head}:</strong> {alert.message}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={credentials.email}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          required
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={credentials.password}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          required
        />
        <Button
          component={motion.button}
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2, padding: "0.8rem", fontWeight: "bold" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Login
        </Button>
      </form>
    </Box>
  );
};

export default LoginForm;
