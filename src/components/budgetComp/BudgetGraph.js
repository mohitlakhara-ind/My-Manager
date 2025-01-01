import React, { useEffect, useState } from "react";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { CircularProgress, Box, Typography, Alert, Button } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const BudgetGraph = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const categories = [
    "Room Rent",
    "Groceries",
    "Travel",
    "Enjoyment",
    "Emergency Fund",
    "Others",
  ];
  const categoryTotals = categories.map((category) =>
    budgets
      .filter((entry) => entry.category === category)
      .reduce((sum, entry) => sum + parseInt(entry.value), 0)
  );

  const sortedBudgets = [...budgets].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  const dates = [...new Set(sortedBudgets.map((entry) => entry.date))];
  const dailyTotals = dates.map((date) =>
    sortedBudgets
      .filter((entry) => entry.date === date)
      .reduce((sum, entry) => sum + parseInt(entry.value), 0)
  );

  const chartColors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
  ];

  const barData = {
    labels: categories,
    datasets: [
      {
        label: "Expenses by Category",
        data: categoryTotals,
        backgroundColor: chartColors,
      },
    ],
  };

  const pieData = {
    labels: categories,
    datasets: [
      {
        data: categoryTotals,
        backgroundColor: chartColors,
        hoverOffset: 4,
      },
    ],
  };

  const lineData = {
    labels: dates,
    datasets: [
      {
        label: "Daily Expenses",
        data: dailyTotals,
        backgroundColor: "#36A2EB",
        borderColor: "#36A2EB",
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const doughnutData = {
    labels: categories,
    datasets: [
      {
        data: categoryTotals,
        backgroundColor: chartColors,
      },
    ],
  };

  const stackedBarData = {
    labels: categories,
    datasets: [
      {
        label: "Spending",
        data: categoryTotals,
        backgroundColor: "#FF6384",
      },
      {
        label: "Remaining Budget",
        data: categoryTotals.map((value) => Math.max(5000 - value, 0)),
        backgroundColor: "#36A2EB",
      },
    ],
  };

  const stackedBarOptions = {
    plugins: {
      legend: {
        position: "top",
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
        Budget Overview
      </Typography>
      {loading ? (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading your budget data...
          </Typography>
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Alert severity="error">{error}</Alert>
          <Button variant="contained" sx={{ mt: 2 }} onClick={fetchBudgets}>
            Retry
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 3,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
              Bar Chart
            </Typography>
            <Bar data={barData} options={{ responsive: true }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
              Pie Chart
            </Typography>
            <Pie data={pieData} options={{ responsive: true }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
              Line Chart
            </Typography>
            <Line data={lineData} options={{ responsive: true }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
              Doughnut Chart
            </Typography>
            <Doughnut data={doughnutData} options={{ responsive: true }} />
          </Box>
          <Box sx={{ gridColumn: { xs: "span 1", md: "span 2" } }}>
            <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
              Stacked Bar Chart
            </Typography>
            <Bar data={stackedBarData} options={stackedBarOptions} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default BudgetGraph;
