import React, { useState, useEffect, useCallback } from 'react';
import { FaCalendarAlt, FaRegCalendarCheck, FaRegCalendarTimes } from 'react-icons/fa';
import { format } from 'date-fns';
import { Button, TextField, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const MyCalendar = () => {
  const [calendarData, setCalendarData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  // Load the calendar data from localStorage on initial render
  useEffect(() => {
    const storedData = localStorage.getItem('calendarData');
    if (storedData) {
      setCalendarData(JSON.parse(storedData));
    }
  }, []);

  // Save calendar data to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(calendarData).length > 0) {
      localStorage.setItem('calendarData', JSON.stringify(calendarData));
    }
  }, [calendarData]);

  // Helper function to check if a date is Sunday
  const isSunday = useCallback((date) => date.getDay() === 0, []);

  // Handle leave and schedule changes
  const handleLeaveChange = useCallback((date) => {
    if (!date) return;
    const dateStr = format(date, 'yyyy-MM-dd');
    setCalendarData((prevData) => {
      const updatedData = { ...prevData };
      updatedData[dateStr] = updatedData[dateStr]
        ? null
        : { leave: isSunday(date), schedule: '' }; // Handle Sundays as leave by default
      return updatedData;
    });
  }, [isSunday]);

  // Handle schedule updates
  const handleScheduleChange = useCallback((date, schedule) => {
    if (!date || schedule.trim() === '') return; // Prevent empty schedules
    const dateStr = format(date, 'yyyy-MM-dd');
    setCalendarData((prevData) => {
      const updatedData = { ...prevData };
      if (!updatedData[dateStr]) {
        updatedData[dateStr] = { leave: isSunday(date), schedule: '' };
      }
      updatedData[dateStr].schedule = schedule;
      return updatedData;
    });
  }, [isSunday]);

  // Handle date selection
  const handleDateClick = useCallback((date) => {
    setSelectedDate(date);
  }, []);

  // Render the calendar grid
  const renderCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = firstDayOfMonth.getDay();

    const weeks = [];
    let dayCounter = 1;

    // Creating the calendar structure
    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          week.push(null); // Empty cells for days before the 1st of the month
        } else if (dayCounter <= daysInMonth) {
          const currentDate = new Date(currentYear, currentMonth, dayCounter);
          week.push(currentDate);
          dayCounter++;
        } else {
          week.push(null); // Empty cells after the last day of the month
        }
      }
      weeks.push(week);
    }

    return weeks;
  };

  return (
    <Box className="calendar-container" sx={{ padding: 2, maxWidth: '100vw', overflowX: 'auto' }}>
      <Typography variant="h4" gutterBottom>My Calendar</Typography>

      {/* Calendar Grid */}
      <Box
        className="calendar-grid"
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 1,
          maxHeight: '70vh', // Limit the height of the grid
          overflowY: 'auto', // Make the grid scrollable vertically
        }}
      >
        {renderCalendar().map((week, weekIndex) => (
          <Box key={weekIndex} sx={{ display: 'flex' }}>
            {week.map((date, dayIndex) => (
              <motion.div
                key={dayIndex}
                className={`calendar-day ${date ? 'active' : 'inactive'} ${date && isSunday(date) ? 'sunday' : ''}`}
                onClick={() => date && handleDateClick(date)}
                title={date ? format(date, 'yyyy-MM-dd') : 'No Date'}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  cursor: 'pointer',
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: date && isSunday(date) ? '#FFCDD2' : '#E0F7FA',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '60px', // Fixed height for each day
                  boxSizing: 'border-box',
                }}
              >
                {date ? date.getDate() : ''}
                {date && calendarData[format(date, 'yyyy-MM-dd')]?.leave && (
                  <div className="leave-icon" style={{ position: 'absolute', top: 5, right: 5 }}>
                    <FaRegCalendarTimes />
                  </div>
                )}
                {date && calendarData[format(date, 'yyyy-MM-dd')]?.schedule && (
                  <div className="schedule-icon" style={{ position: 'absolute', bottom: 5, left: 5 }}>
                    <FaRegCalendarCheck />
                  </div>
                )}
              </motion.div>
            ))}
          </Box>
        ))}
      </Box>

      {/* Selected Date Details */}
      {selectedDate && (
        <Box className="date-details" sx={{ marginTop: 2 }}>
          <Typography variant="h6">Selected Date: {format(selectedDate, 'dd MMM yyyy')}</Typography>

          <Button
            variant="contained"
            color={calendarData[format(selectedDate, 'yyyy-MM-dd')]?.leave ? 'secondary' : 'primary'}
            onClick={() => handleLeaveChange(selectedDate)}
            startIcon={calendarData[format(selectedDate, 'yyyy-MM-dd')]?.leave ? <FaRegCalendarCheck /> : <FaCalendarAlt />}
            sx={{ marginRight: 2 }}
          >
            {calendarData[format(selectedDate, 'yyyy-MM-dd')]?.leave ? 'Cancel Leave' : 'Mark as Leave'}
          </Button>

          <TextField
            label="Enter Schedule"
            variant="outlined"
            fullWidth
            value={calendarData[format(selectedDate, 'yyyy-MM-dd')]?.schedule || ''}
            onChange={(e) => handleScheduleChange(selectedDate, e.target.value)}
            sx={{ marginTop: 2 }}
          />
        </Box>
      )}
    </Box>
  );
};

export default MyCalendar;
