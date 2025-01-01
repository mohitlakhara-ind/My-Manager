import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import jsPDF from "jspdf"; // For PDF generation
import "jspdf-autotable"; // For table formatting
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";

const BudgetList = () => {
  const [budgets, setBudgets] = useState([]);
  const [filteredBudgets, setFilteredBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterDate, setFilterDate] = useState("");

  const fetchBudgets = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        throw new Error("No auth token found. Please login.");
      }

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
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    filterBudgets(event.target.value, filterCategory, filterDate);
  };

  const handleFilterCategory = (event) => {
    setFilterCategory(event.target.value);
    filterBudgets(searchTerm, event.target.value, filterDate);
  };

  const handleFilterDate = (event) => {
    setFilterDate(event.target.value);
    filterBudgets(searchTerm, filterCategory, event.target.value);
  };

  const filterBudgets = (search, category, date) => {
    let filtered = budgets;

    if (search) {
      filtered = filtered.filter(
        (budget) =>
          budget.category.toLowerCase().includes(search.toLowerCase()) ||
          budget.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "All") {
      filtered = filtered.filter((budget) => budget.category === category);
    }

    if (date) {
      filtered = filtered.filter((budget) => {
        const budgetDate = new Date(budget.date).toLocaleDateString();
        return budgetDate === new Date(date).toLocaleDateString();
      });
    }

    setFilteredBudgets(filtered);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
  
    // Title Page
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text("Budget Manager Report", 105, 60, { align: "center" });
  
    // Subtitle
    const currentDate = new Date().toLocaleDateString();
    doc.setFontSize(14);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${currentDate}`, 105, 70, { align: "center" });
  
    // Decorative Divider
    doc.setDrawColor(0, 162, 232);
    doc.setLineWidth(1);
    doc.line(30, 80, 180, 80);
  
    // Dynamic Logo Placeholder (optional)
    const logo = false; // Replace with your logo path
    if (logo) {
      const img = new Image();
      img.src = logo;
      doc.addImage(img, "PNG", 85, 90, 40, 40); // Adjust size and position
    } else {
      doc.setFontSize(10);
      doc.text("Your Logo Here", 105, 100, { align: "center" });
      doc.setDrawColor(200, 200, 200);
      doc.rect(85, 90, 40, 40);
    }
  
    // Add Data Page
    doc.addPage();
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Detailed Budget Report", 105, 20, { align: "center" });
  
    // Table Data Preparation
    const tableData = filteredBudgets.map((budget, index) => [
      index + 1,
      budget.category,
      budget.spendingType,
      budget.description,
      budget.value < 0
        ? `- ₹${Math.abs(budget.value)}`
        : `+ ₹${budget.value}`,
      new Date(budget.date).toLocaleDateString(),
    ]);
  
    // Add Auto Table for Budget Details
    doc.autoTable({
      startY: 30,
      head: [["#", "Category", "Type", "Description", "Value", "Date"]],
      body: tableData,
      styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 5,
        lineColor: [220, 220, 220],
      },
      headStyles: {
        fillColor: [0, 162, 232],
        textColor: 255,
        fontSize: 12,
        halign: "center",
      },
      bodyStyles: {
        textColor: 50,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 35 },
        2: { cellWidth: 25, halign: "center" },
        3: { cellWidth: 60 },
        4: { cellWidth: 25, halign: "right" },
        5: { cellWidth: 30, halign: "center" },
      },
      theme: "striped",
      margin: { top: 30 },
      didDrawCell: (data) => {
        if (data.column.index === 4 && data.cell.raw) {
          const value = data.cell.raw;
          const isIncome = value.startsWith("-");
          const isExpense = value.startsWith("+");
          const textColor = isIncome ? [0, 128, 0] : [255, 0, 0]; // Green for income, Red for expense
          doc.setTextColor(...textColor);
          doc.text(value, data.cell.x + data.cell.width / 2, data.cell.y + 5, {
            align: "center",
          });
          doc.setTextColor(0); // Reset to default text color
        }
      },
    });
  
    // Add Totals Section
    const totalSpending = filteredBudgets.reduce(
      (sum, budget) => sum + parseFloat(budget.value),
      0
    );
    const totalIncome = filteredBudgets
      .filter((budget) => budget.value < 0)
      .reduce((sum, budget) => sum + parseFloat(budget.value), 0);
    const totalExpense = filteredBudgets
      .filter((budget) => budget.value > 0)
      .reduce((sum, budget) => sum + parseFloat(budget.value), 0);
  
    // Add Summary Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    const summaryY = doc.lastAutoTable.finalY + 15;
    doc.text(`Summary:`, 14, summaryY);
  
    // Income section
    doc.setTextColor(0, 128, 0); // Green for Income
    doc.text(`Total Income: ₹${Math.abs(totalIncome).toFixed(2)}`, 14, summaryY + 10);
  
    // Expense section
    doc.setTextColor(255, 0, 0); // Red for Expense
    doc.text(`Total Expense: ₹${totalExpense.toFixed(2)}`, 14, summaryY + 20);
  
    // Net Spending section (Dynamic color based on surplus or deficit)
    const netColor = totalSpending < 0 ? [0, 128, 0] : [255, 0, 0]; // Green for surplus, red for deficit
    doc.setTextColor(...netColor);
    doc.text(`Net Spending: ₹${totalSpending.toFixed(2)}`, 14, summaryY + 30);
  
    // Save PDF
    doc.save("Enhanced_Budget_Report.pdf");
  };
  

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
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
      <Typography
        variant="h4"
        gutterBottom
        style={{ fontWeight: "bold", color: "#1976d2" }}
      >
        Budget List
      </Typography>
      <Box
        display="flex"
        flexWrap="wrap"
        gap="20px"
        marginBottom="20px"
        alignItems="center"
      >
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            endAdornment: <SearchIcon color="action" />,
          }}
          style={{ flex: "1" }}
        />
        <FormControl variant="outlined" style={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filterCategory}
            onChange={handleFilterCategory}
            label="Category"
          >
            <MenuItem value="All">All</MenuItem>
            {[...new Set(budgets.map((budget) => budget.category))].map(
              (category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
        <TextField
          label="Filter by Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filterDate}
          onChange={handleFilterDate}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={downloadPDF}
          startIcon={<DownloadIcon />}
          style={{ height: "fit-content" }}
        >
          Download PDF
        </Button>
      </Box>
      {filteredBudgets.length === 0 ? (
        <Alert severity="info">No budgets found!</Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredBudgets.map((budget) => (
            <Grid item xs={12} sm={6} md={4} key={budget._id}>
              <Card
                component={motion.div}
                whileHover={{ scale: 1.05 }}
                style={{
                  borderRadius: "15px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    style={{ color: "#1976d2", fontWeight: "bold" }}
                  >
                    {budget.category}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Type: {budget.spendingType}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Description: {budget.description}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Value: <b>{budget.value} ₹</b>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Date: {new Date(budget.date).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </motion.div>
  );
};

export default BudgetList;
