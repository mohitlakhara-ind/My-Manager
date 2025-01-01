import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Typography,
  Alert,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";

const BudgetManager = () => {
  const [budgets, setBudgets] = useState([]);
  const [filteredBudgets, setFilteredBudgets] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterDate, setFilterDate] = useState("");

  const fetchBudgets = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) throw new Error("No auth token found. Please login.");

      const response = await fetch(
        "http://localhost:5000/api/budget/fetchallbudgets",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": authToken,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch budgets.");
      }

      const data = await response.json();
      setBudgets(data);
      setFilteredBudgets(data);
      generateCategorySummary(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateCategorySummary = (data) => {
    const categorySummary = data.reduce((acc, curr) => {
      if (!acc[curr.category]) acc[curr.category] = 0;
      acc[curr.category] += curr.value;
      return acc;
    }, {});
    setSummary(categorySummary);
  };

  useEffect(() => {
    fetchBudgets();
  }, []);



 
  if (error)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: "20px" }}
    >
      {/* Category-wise Summary */}
      <Typography variant="h5" gutterBottom>
        Category-Wise Summary
      </Typography>
      <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Total Spending</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(summary).map(([category, total]) => (
              <TableRow key={category}>
                <TableCell>{category}</TableCell>
                <TableCell>{total} ₹</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </motion.div>
  );
};

export default BudgetManager;
