// Step 2: Basic Code for App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DailySchedule from './components/DailySchedule';
import StudySchedule from './components/StudySchedule';
// import MyCalendar from './components/MyCalendar';
import Skincare from './components/Skincare';
// import FoodSuggestions from './components/FoodSuggestions';
// import ExpenseManager from './components/ExpenseManager';
// import BudgetForm from './components/budgetComp/BudgetForm';
import ProfilePage from './components/Profile';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/NotesComp/Home';
import Navbar from './components/Navbar'; // Add more components as needed
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import RecipeSearch from './components/RecipeSearch';
import BudgetHome from './components/budgetComp/BudgetHome';

// Create a theme with default MUI settings
const theme = createTheme();
function App() {
  return (
    <ThemeProvider theme={theme}>
    <Router>
    <Navbar/>
      <div className="App pt-5 m-3">
        
        <Routes>

           // <Route path="/" element={<DailySchedule />} />
          // <Route path="/weekly-schedule" element={<StudySchedule />} />
          // <Route path="/skincare" element={<Skincare />} />
          <Route path="/expense-manager" element={<BudgetHome />} />
          <Route path="/food-suggestions" element={<RecipeSearch />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/notes" element={<Home/>} /> 
          {/* <Route path="/expense-form" element={<BudgetForm />} /> */}
        </Routes>
      </div>
    </Router>
    </ThemeProvider>
  );
}

export default App;
