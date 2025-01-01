import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Schedule as ScheduleIcon,
  Spa as SpaIcon,
  RestaurantMenu as RestaurantMenuIcon,
  AttachMoney as AttachMoneyIcon,
  AccountCircle as AccountCircleIcon,
  StickyNote2 as StickyNote2Icon,
  Login as LoginIcon,
  AppRegistration as AppRegistrationIcon,
} from '@mui/icons-material';

function NavigationBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('auth-token'));
  }, []);

  const handleDrawerToggle = (isOpen) => {
    setDrawerOpen(isOpen);
  };

  const renderMenuButtons = () => (
    <>
      <Button color="inherit" component={Link} to="/" startIcon={<HomeIcon />}>
        Home
      </Button>
      <Button color="inherit" component={Link} to="/weekly-schedule" startIcon={<ScheduleIcon />}>
        Weekly Schedule
      </Button>
      <Button color="inherit" component={Link} to="/skin-care" startIcon={<SpaIcon />}>
        Skin Care
      </Button>
      <Button color="inherit" component={Link} to="/food-suggestions" startIcon={<RestaurantMenuIcon />}>
        Food Suggestions
      </Button>
      <Button color="inherit" component={Link} to="/expense-manager" startIcon={<AttachMoneyIcon />}>
        Expense Manager
      </Button>
      {isLoggedIn ? (
        <>
          <Button color="inherit" component={Link} to="/profile" startIcon={<AccountCircleIcon />}>
            Profile
          </Button>
          <Button color="inherit" component={Link} to="/notes" startIcon={<StickyNote2Icon />}>
            Notes
          </Button>
        </>
      ) : (
        <>
          <Button color="inherit" component={Link} to="/Login" startIcon={<LoginIcon />}>
            Login
          </Button>
          <Button color="inherit" component={Link} to="/SignUp" startIcon={<AppRegistrationIcon />}>
            Sign Up
          </Button>
        </>
      )}
    </>
  );

  const renderDrawerList = () => (
    <List sx={{ width: 250 }} role="navigation">
      <ListItem button component={Link} to="/" onClick={() => handleDrawerToggle(false)}>
        <HomeIcon sx={{ marginRight: '8px' }} />
        <ListItemText primary="Home" />
      </ListItem>
      <Divider />
      <ListItem button component={Link} to="/weekly-schedule" onClick={() => handleDrawerToggle(false)}>
        <ScheduleIcon sx={{ marginRight: '8px' }} />
        <ListItemText primary="Weekly Schedule" />
      </ListItem>
      <ListItem button component={Link} to="/skin-care" onClick={() => handleDrawerToggle(false)}>
        <SpaIcon sx={{ marginRight: '8px' }} />
        <ListItemText primary="Skin Care" />
      </ListItem>
      <ListItem button component={Link} to="/food-suggestions" onClick={() => handleDrawerToggle(false)}>
        <RestaurantMenuIcon sx={{ marginRight: '8px' }} />
        <ListItemText primary="Food Suggestions" />
      </ListItem>
      <ListItem button component={Link} to="/expense-form" onClick={() => handleDrawerToggle(false)}>
        <AttachMoneyIcon sx={{ marginRight: '8px' }} />
        <ListItemText primary="Expense Form" />
      </ListItem>
      <Divider />
      {isLoggedIn ? (
        <>
          <ListItem button component={Link} to="/profile" onClick={() => handleDrawerToggle(false)}>
            <AccountCircleIcon sx={{ marginRight: '8px' }} />
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button component={Link} to="/notes" onClick={() => handleDrawerToggle(false)}>
            <StickyNote2Icon sx={{ marginRight: '8px' }} />
            <ListItemText primary="Notes" />
          </ListItem>
        </>
      ) : (
        <>
          <ListItem button component={Link} to="/Login" onClick={() => handleDrawerToggle(false)}>
            <LoginIcon sx={{ marginRight: '8px' }} />
            <ListItemText primary="Login" />
          </ListItem>
          <ListItem button component={Link} to="/SignUp" onClick={() => handleDrawerToggle(false)}>
            <AppRegistrationIcon sx={{ marginRight: '8px' }} />
            <ListItemText primary="Sign Up" />
          </ListItem>
        </>
      )}
    </List>
  );

  return (
    <AppBar position="sticky" sx={{ backgroundColor: theme.palette.primary.main }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          MyLifeManager
        </Typography>
        {isMobile ? (
          <IconButton
            color="inherit"
            edge="end"
            onClick={() => handleDrawerToggle(true)}
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <div>{renderMenuButtons()}</div>
        )}
        <Drawer anchor="right" open={drawerOpen} onClose={() => handleDrawerToggle(false)}>
          {renderDrawerList()}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}

export default NavigationBar;
