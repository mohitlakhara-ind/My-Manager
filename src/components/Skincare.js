import React, { useState } from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, Button, CardActions, TextField, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { FaLeaf, FaRegEye, FaRegSmile, FaTimes } from 'react-icons/fa';

const initialRemedies = [
  {
    name: 'Body Mix for Brightening and Softness',
    ingredients: 'Turmeric Powder, Gram Flour (Besan), Milk',
    instructions: [
      'Mix 1 tablespoon of turmeric powder, 2 tablespoons of gram flour, and enough milk to form a thick paste.',
      'Apply the paste all over your body, especially focusing on areas with dark spots or tanning.',
      'Let it dry for 10-15 minutes, then scrub it off with water in circular motions.',
    ],
    icon: <FaLeaf />,
    color: '#FFD700',
    type: 'body',
    favorite: false,
  },
  {
    name: 'Eye Mix for Dark Circles and Puffiness',
    ingredients: 'Cucumber Juice, Aloe Vera Gel',
    instructions: [
      'Mix 2 tablespoons of fresh cucumber juice with 1 tablespoon of aloe vera gel.',
      'Gently apply the mixture under your eyes, focusing on the dark circles and puffiness.',
      'Leave it on for about 15 minutes, then wash it off with lukewarm water.',
    ],
    icon: <FaRegEye />,
    color: '#8A2BE2',
    type: 'eye',
    favorite: false,
  },
  {
    name: 'Face Mix for Glowing Skin and Pigmentation',
    ingredients: 'Lemon Juice, Aloe Vera, Turmeric Powder',
    instructions: [
      'Mix 1 tablespoon of lemon juice, 1 teaspoon of turmeric powder, and 1 teaspoon of aloe vera gel.',
      'Apply the paste on your face and leave it on for 10-15 minutes.',
      'Wash it off with lukewarm water for glowing skin and reduced pigmentation.',
    ],
    icon: <FaRegSmile />,
    color: '#FF6347',
    type: 'face',
    favorite: false,
  },
];

const HomeRemedyMixes = () => {
  const [remedies, setRemedies] = useState(initialRemedies);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [favorites, setFavorites] = useState([]);

  // Toggle the favorite status of a remedy
  const toggleFavorite = (index) => {
    const updatedRemedies = [...remedies];
    updatedRemedies[index].favorite = !updatedRemedies[index].favorite;
    setRemedies(updatedRemedies);

    // Add or remove remedy from favorites
    const updatedFavorites = updatedRemedies.filter(remedy => remedy.favorite);
    setFavorites(updatedFavorites);
  };

  // Clear the search query and filter
  const clearFilters = () => {
    setSearchQuery('');
    setFilterType('');
  };

  // Handle search functionality
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle filter functionality
  const handleFilter = (event) => {
    setFilterType(event.target.value);
  };

  // Filter remedies based on search query and filter type
  const filteredRemedies = remedies.filter((remedy) => {
    return (
      remedy.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterType ? remedy.type === filterType : true)
    );
  });

  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            fontSize: '36px',
            fontWeight: '700',
            color: '#333',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}
        >
          🌿 Natural Home Remedies ✨
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          style={{
            fontSize: '18px',
            color: '#555',
            marginBottom: '20px',
            fontWeight: '500',
            lineHeight: '1.6',
          }}
        >
          Find easy and effective natural remedies for your skin, eyes, and body!
        </motion.p>

        {/* Search and Filter Inputs */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
          <TextField
            label="Search Remedies"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearch}
            sx={{
              width: '250px',
              borderRadius: '25px',
              backgroundColor: '#fff',
              '& .MuiOutlinedInput-root': {
                borderRadius: '25px',
              },
            }}
          />
          <TextField
            label="Filter by Type"
            variant="outlined"
            select
            value={filterType}
            onChange={handleFilter}
            sx={{
              width: '250px',
              borderRadius: '25px',
              backgroundColor: '#fff',
              '& .MuiOutlinedInput-root': {
                borderRadius: '25px',
              },
            }}
          >
            <option value="">All</option>
            <option value="body">Body</option>
            <option value="eye">Eye</option>
            <option value="face">Face</option>
          </TextField>
          <Button
            variant="outlined"
            color="error"
            onClick={clearFilters}
            sx={{
              alignSelf: 'center',
              borderRadius: '25px',
              padding: '10px 20px',
            }}
          >
            Clear Filters
          </Button>
        </Box>
      </Box>

      {/* Favorites Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
          💖 Your Favorite Remedies
        </Typography>
        <Grid container spacing={3}>
          {favorites.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'center', width: '100%' }}>
              No favorite remedies yet!
            </Typography>
          ) : (
            favorites.map((remedy, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    boxShadow: 5,
                    '&:hover': {
                      boxShadow: 10,
                      transform: 'translateY(-10px)',
                      transition: 'all 0.3s ease',
                    },
                    background: '#f0f0f0',
                    borderRadius: 12,
                    padding: 2,
                    transition: 'transform 0.3s ease',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '300px',
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ color: '#333', fontWeight: 'bold' }}>
                      {remedy.icon} {remedy.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, color: '#777', fontWeight: '400' }}>
                      <strong>Ingredients:</strong> {remedy.ingredients}
                    </Typography>

                    {/* Instructions as bullet points */}
                    <Typography variant="body2" sx={{ mb: 2, color: '#777', fontWeight: '400' }}>
                      <strong>Instructions:</strong>
                      <ul style={{ listStyleType: 'disc', marginLeft: '20px', textAlign: 'left' }}>
                        {remedy.instructions.map((step, idx) => (
                          <li key={idx} style={{ marginBottom: '5px' }}>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      sx={{
                        borderRadius: 20,
                        width: '100%',
                        backgroundColor: '#FF6347',
                        '&:hover': {
                          backgroundColor: '#FF4500',
                        },
                        padding: '10px 20px',
                      }}
                      onClick={() => toggleFavorite(index)}
                    >
                      Remove from Favorite
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>

      {/* Remedies Section */}
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
        🌿 Remedies List
      </Typography>
      <Grid container spacing={3}>
        {filteredRemedies.map((remedy, index) => (
          <Grid item xs={12} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card
                sx={{
                  boxShadow: 5,
                  '&:hover': {
                    boxShadow: 10,
                    transform: 'translateY(-10px)',
                    transition: 'all 0.3s ease',
                  },
                  background: '#f0f0f0',
                  borderRadius: 12,
                  padding: 2,
                  transition: 'transform 0.3s ease',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '300px',
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#333', fontWeight: 'bold' }}>
                    {remedy.icon} {remedy.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, color: '#777', fontWeight: '400' }}>
                    <strong>Ingredients:</strong> {remedy.ingredients}
                  </Typography>

                  {/* Instructions as bullet points */}
                  <Typography variant="body2" sx={{ mb: 2, color: '#777', fontWeight: '400' }}>
                    <strong>Instructions:</strong>
                    <ul style={{ listStyleType: 'disc', marginLeft: '20px', textAlign: 'left' }}>
                      {remedy.instructions.map((step, idx) => (
                        <li key={idx} style={{ marginBottom: '5px' }}>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    sx={{
                      borderRadius: 20,
                      width: '100%',
                      backgroundColor: '#FFD700',
                      '&:hover': {
                        backgroundColor: '#FFA500',
                      },
                      padding: '10px 20px',
                    }}
                    onClick={() => toggleFavorite(index)}
                  >
                    {remedy.favorite ? 'Remove from Favorite' : 'Add to Favorite'}
                  </Button>
                </CardActions>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomeRemedyMixes;
