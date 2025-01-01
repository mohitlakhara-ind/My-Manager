import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";

const CATEGORY_LIMITS = {
  RoomRent: 2000,
  Groceries: 3000,
  Travel: 300,
  Enjoyment: 400,
  EmergencyFund: 300,
};

export default function BudgetForm() {
  const [formData, setFormData] = useState({
    spendingType: "",
    category: "",
    description: "",
    value: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [categoryTotals, setCategoryTotals] = useState({
    RoomRent: 0,
    Groceries: 0,
    Travel: 0,
    Enjoyment: 0,
    EmergencyFund: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.spendingType ||
      !formData.category ||
      !formData.description ||
      !formData.value ||
      !formData.date
    ) {
      setError(true);
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    const value = parseFloat(formData.value);
    if (isNaN(value) || value <= 0) {
      setError(true);
      setErrorMessage("Please enter a valid positive value.");
      return;
    }

    // Check if category exceeds its limit
    const category = formData.category;
    const updatedTotal = categoryTotals[category] + value;
    if (updatedTotal > CATEGORY_LIMITS[category]) {
      setError(true);
      setErrorMessage(
        `The total for ${category} cannot exceed ₹${CATEGORY_LIMITS[category]}.`
      );
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "http://localhost:5000/api/budget/addbudget",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setSuccess(true);
        setCategoryTotals((prevState) => ({
          ...prevState,
          [category]: updatedTotal,
        }));
        setFormData({
          spendingType: "",
          category: "",
          description: "",
          value: "",
          date: new Date().toISOString().split("T")[0],
        });
      } else {
        const resData = await response.json();
        setError(true);
        setErrorMessage(resData.error || "Failed to save the budget entry.");
      }
    } catch (err) {
      setError(true);
      setErrorMessage("An error occurred while saving the budget entry.");
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          p: 3,
          backgroundColor: "#f4f4f4",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              maxWidth: 500,
              width: "100%",
              backgroundColor: "#fff",
              boxShadow: 4,
              borderRadius: 3,
              p: 3,
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{ mb: 3, textAlign: "center" }}
            >
              Add Budget Entry
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Spending Type"
                name="spendingType"
                value={formData.spendingType}
                onChange={handleChange}
                fullWidth
                select
                required
                sx={{ mb: 3 }}
              >
                <MenuItem value="Income">Income</MenuItem>
                <MenuItem value="Expense">Expense</MenuItem>
              </TextField>

              <TextField
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                fullWidth
                select
                required
                sx={{ mb: 3 }}
              >
                {Object.keys(CATEGORY_LIMITS).map((key) => (
                  <MenuItem key={key} value={key}>
                    {key}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                required
                sx={{ mb: 3 }}
              />

              <TextField
                label="Value (₹)"
                name="value"
                value={formData.value}
                onChange={handleChange}
                fullWidth
                type="number"
                required
                sx={{ mb: 3 }}
              />

              <TextField
                label="Date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                fullWidth
                type="date"
                required
                sx={{ mb: 3 }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 2,
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                  >
                    Submit
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={() =>
                      setFormData({
                        spendingType: "",
                        category: "",
                        description: "",
                        value: "",
                        date: new Date().toISOString().split("T")[0],
                      })
                    }
                  >
                    Reset
                  </Button>
                </motion.div>
              </Box>
            </form>
          </Box>
        </motion.div>

        <Snackbar
          open={success}
          autoHideDuration={4000}
          onClose={() => setSuccess(false)}
        >
          <Alert
            onClose={() => setSuccess(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            Budget entry saved successfully!
          </Alert>
        </Snackbar>

        <Snackbar
          open={error}
          autoHideDuration={4000}
          onClose={() => setError(false)}
        >
          <Alert
            onClose={() => setError(false)}
            severity="error"
            sx={{ width: "100%" }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}
