import React, { useState } from "react";
import { Container, Grid, Avatar, Typography, Tabs, Tab, Box, TextField } from "@mui/material";
import { motion } from "framer-motion";
import { styled } from "@mui/system";

// Styled Components using MUI
const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  margin: "auto",
}));

const SectionBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
}));

// Motion variants
const fadeVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ProfilePage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: 'Mohit Lakhara',
    email: 'mohit@example.com',
    description: 'BCA Student | Tech Enthusiast | React Developer',
    role: 'Student',
    skills: 'React.js, Node.js, MongoDB, Material-UI, Framer Motion',
    maxMonthlyBudget: 5000,
    contact: 'mohit@example.com',
  });

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeVariant}
    >
      <Container maxWidth="md" sx={{ mt: 4 }}>
        {/* Profile Header */}
        <SectionBox>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <ProfileAvatar src="/path/to/profile-pic.jpg" alt="User Profile" />
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="h4" align="center">
                {formData.name}
              </Typography>
              <Typography variant="body1" align="center">
                {formData.description}
              </Typography>
            </Grid>
          </Grid>
        </SectionBox>

        {/* Tabs */}
        <Box sx={{ mt: 3 }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            centered
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="About" />
            <Tab label="Skills" />
            <Tab label="Contact" />
            <Tab label="Budget" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <SectionBox>
          {tabIndex === 0 && (
            <motion.div initial="hidden" animate="visible" variants={fadeVariant}>
              <Typography variant="h6">About Me</Typography>
              <Typography variant="body1">
                Hi, I am {formData.name}, a passionate BCA student who loves coding and building web apps.
              </Typography>
            </motion.div>
          )}
          {tabIndex === 1 && (
            <motion.div initial="hidden" animate="visible" variants={fadeVariant}>
              <Typography variant="h6">Skills</Typography>
              <Typography variant="body1">{formData.skills}</Typography>
            </motion.div>
          )}
          {tabIndex === 2 && (
            <motion.div initial="hidden" animate="visible" variants={fadeVariant}>
              <Typography variant="h6">Contact</Typography>
              <Typography variant="body1">Email: {formData.contact}</Typography>
            </motion.div>
          )}
          {tabIndex === 3 && (
            <motion.div initial="hidden" animate="visible" variants={fadeVariant}>
              <Typography variant="h6">Budget</Typography>
              <TextField
                label="Max Monthly Budget"
                type="number"
                name="maxMonthlyBudget"
                value={formData.maxMonthlyBudget}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </motion.div>
          )}
        </SectionBox>
      </Container>
    </motion.div>
  );
};

export default ProfilePage;
