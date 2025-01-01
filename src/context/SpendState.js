import SpendContext from "./spendContext";
import { useState } from "react";

const SpendState = (props) => {
  const host = "http://localhost:5000"; // Replace with your backend URL
  const spendsInitial = [];
  const [spends, setSpends] = useState(spendsInitial);
  const authtoken = localStorage.getItem("authToken");

  // Get all Spends
  const getSpends = async () => {
    try {
      const response = await fetch(`${host}/api/budget/fetchallspends`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authtoken,
        },
      });

      if (response.ok) {
        const json = await response.json();
        console.log("Fetched Spends:", json); // Debugging
        setSpends(Array.isArray(json) ? json : []);
      } else {
        console.error("Failed to fetch spends:", response.statusText);
        setSpends([]); // Fallback
      }
    } catch (error) {
      console.error("Error fetching spends:", error);
    }
  };

  // Add a Spend
  const addSpend = async (amount, category, description, date) => {
    try {
      const response = await fetch(`${host}/api/budget/addspend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authtoken,
        },
        body: JSON.stringify({ amount, category, description, date }),
      });

      if (response.ok) {
        const spend = await response.json();
        console.log("New Spend:", spend); // Debugging
        setSpends([...spends, spend]); // Append new spend
      } else {
        console.error("Failed to add spend:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding spend:", error);
    }
  };

  // Delete a Spend
  const deleteSpend = async (id) => {
    try {
      const response = await fetch(`${host}/api/budget/deletespends/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authtoken,
        },
      });

      if (response.ok) {
        console.log("Deleted Spend Response:", await response.json()); // Debugging
        const newSpends = spends.filter((spend) => spend._id !== id);
        setSpends(newSpends);
      } else {
        console.error("Failed to delete spend:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting spend:", error);
    }
  };

  // Edit a Spend
  const editSpend = async (id, amount, category, description, date) => {
    try {
      const response = await fetch(`${host}/api/budget/updatespend/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authtoken,
        },
        body: JSON.stringify({ amount, category, description, date }),
      });

      if (response.ok) {
        console.log("Updated Spend Response:", await response.json()); // Debugging

        // Create a new copy of spends and update the relevant spend
        const newSpends = spends.map((spend) =>
          spend._id === id
            ? { ...spend, amount, category, description, date }
            : spend
        );
        setSpends(newSpends);
      } else {
        console.error("Failed to update spend:", response.statusText);
      }
    } catch (error) {
      console.error("Error editing spend:", error);
    }
  };

  return (
    <SpendContext.Provider
      value={{
        spends,
        addSpend,
        deleteSpend,
        editSpend,
        getSpends,
      }}
    >
      {props.children}
    </SpendContext.Provider>
  );
};

export default SpendState;
