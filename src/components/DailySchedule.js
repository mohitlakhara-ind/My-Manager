import React, { useState, useMemo } from 'react';
import { Box, Typography, Grid, Card, CardContent, LinearProgress, Chip, IconButton, Badge, TextField } from '@mui/material';
import { AccessAlarm, FitnessCenter, Book, Restaurant, CheckCircle, Cancel, Brightness4, Brightness7 } from '@mui/icons-material';

const DailyTasks = () => {
  const [taskStatus, setTaskStatus] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const tasksData = {
    Morning: [
        { time: "5:00 AM", activity: "Wake up, freshen up", category: "Personal", icon: <AccessAlarm /> },
        { time: "5:20 AM - 6:00 AM", activity: "Exercise (30-45 minutes)", category: "Work", icon: <FitnessCenter /> },
        { time: "6:00 AM - 7:30 AM", activity: "Breakfast prep & breakfast", category: "Personal", icon: <Restaurant /> },
        { time: "7:30 AM - 8:00 AM", activity: "Get ready for college", category: "Work", icon: <Book /> },
      ],
      CollegeTime: [
        { time: "8:30 AM - 2:30 PM", activity: "College lectures/classes", category: "Study", icon: <Book /> }
      ],
      Afternoon: [
        { time: "2:30 PM - 4:00 PM", activity: "Lunch prep & lunch & sleep part 1", category: "Personal", icon: <Restaurant /> }
      ],
      Evening: [
        { time: "4:30 PM - 6:00 PM", activity: "College studies (assignments, revision)", category: "Study", icon: <Book /> },
        { time: "6:30 PM - 7:30 PM", activity: "Coding practice (focus on building your skills)", category: "Work", icon: <FitnessCenter /> }
      ],
      Night: [
        { time: "7:30 PM - 8:00 PM", activity: "Dinner prep & dinner", category: "Personal", icon: <Restaurant /> },
        { time: "10:00 PM - 11:00 PM", activity: "Relax time (read, music, spend time with Avni 😉)", category: "Personal", icon: <Book /> },
        { time: "11:00 PM - 12:30 AM", activity: "Study or coding session", category: "Work", icon: <Book /> }
      ],
      SleepTime: [
        { time: "12:30 AM - 5:00 AM", activity: "Second sleep (4.5 hours)", category: "Personal", icon: <AccessAlarm /> }
      ]
    // other time slots
  };

  const handleTaskToggle = (timeOfDay, index) => {
    const taskKey = `${timeOfDay}-${index}`;
    setTaskStatus(prev => ({
      ...prev,
      [taskKey]: !prev[taskKey]
    }));
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const taskCategories = useMemo(() => {
    return Object.entries(tasksData).map(([timeOfDay, tasks]) => ({
      timeOfDay,
      tasks: tasks.filter(task => task.activity.toLowerCase().includes(searchQuery)),
    }));
  }, [tasksData, searchQuery]);

  return (
    <Box sx={{ padding: 4, backgroundColor: darkMode ? '#121212' : '#f3f4f7', minHeight: '100vh' }}>
      {/* <IconButton
        onClick={() => setDarkMode(!darkMode)}
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 10,
          color: darkMode ? '#fff' : '#000',
        }}
      >
        {darkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton> */}

      {/* Search Bar */}
      <TextField
        label="Search Tasks"
        variant="outlined"
        fullWidth
        sx={{ marginBottom: 4 }}
        onChange={handleSearchChange}
      />

      {taskCategories.map(({ timeOfDay, tasks }) => (
        <Box key={timeOfDay} sx={{ marginBottom: 6 }}>
          <Typography
            variant="h5"
            sx={{
              marginBottom: '20px',
              fontWeight: 'bold',
              color: '#fff',
              backgroundColor: darkMode ? '#3f51b5' : '#1976d2',
              padding: '14px 20px',
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            {timeOfDay}
          </Typography>

          <Grid container spacing={4}>
            {tasks.map((task, index) => {
              const taskKey = `${timeOfDay}-${index}`;
              const isTaskSelected = taskStatus[taskKey];

              return (
                <Grid item xs={12} sm={6} md={4} key={taskKey}>
                  <Card
                    variant="outlined"
                    sx={{
                      backgroundColor: isTaskSelected ? '#d1e7fd' : darkMode ? '#424242' : '#ffffff',
                      boxShadow: '0 6px 14px rgba(0, 0, 0, 0.15)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      padding: 2,
                      transition: 'box-shadow 0.3s ease',
                      '&:hover': { boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)' },
                    }}
                    onClick={() => handleTaskToggle(timeOfDay, index)}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{
                          color: darkMode ? '#fff' : '#333',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {task.icon}
                        <span style={{ marginLeft: 8 }}>{task.time}</span>
                        <Badge
                          badgeContent={task.priority}
                          color={task.priority === 'High' ? 'error' : task.priority === 'Medium' ? 'warning' : 'success'}
                          sx={{ marginLeft: 'auto' }}
                        />
                      </Typography>
                      <Typography variant="body2" sx={{ marginBottom: '10px', color: darkMode ? '#bbb' : '#555' }}>
                        {task.activity}
                      </Typography>
                      <Chip
                        label={task.category}
                        color="primary"
                        sx={{
                          marginTop: 2,
                          fontSize: '14px',
                          backgroundColor: darkMode ? '#444' : '#E0F7FA',
                          color: darkMode ? '#ffffff' : '#00796B',
                          fontWeight: 'bold',
                        }}
                      />
                      <Box sx={{ marginTop: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={isTaskSelected ? 100 : 0}
                          sx={{
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: darkMode ? '#555' : '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#3f51b5',
                            },
                          }}
                        />
                      </Box>
                      <Box sx={{ marginTop: 1 }}>
                        {isTaskSelected ? (
                          <CheckCircle sx={{ color: 'green', fontSize: 28 }} />
                        ) : (
                          <Cancel sx={{ color: 'red', fontSize: 28 }} />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default DailyTasks;
