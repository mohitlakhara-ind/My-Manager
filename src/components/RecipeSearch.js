import React, { useState } from 'react';
import { Button, TextField, CircularProgress, Card, CardContent, Typography } from '@mui/material';
import { motion } from 'framer-motion';

// Replace with your Hugging Face API Key
const HUGGING_FACE_API_KEY = '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'; // Ensure this is kept safe

const RecipeSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [query, setQuery] = useState('');

  // Function to fetch recipe from Hugging Face model
  const fetchRecipe = async (prompt) => {
    const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        options: { use_cache: false }, // Optional: Disable caching for fresh responses
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data from Hugging Face');
    }

    const result = await response.json();
    return result;
  };

  // Retry logic for the API request
  const retryRequest = async (prompt, retries = 3) => {
    let attempt = 0;
    while (attempt < retries) {
      try {
        const result = await fetchRecipe(prompt);
        const recipeIdeas = result[0]?.generated_text.trim(); // Adjust based on response format

        // Set the recipe data
        setRecipes([{
          title: 'Generated Recipe Idea',
          description: recipeIdeas || 'No recipe generated',
        }]);

        return; // Exit if successful
      } catch (err) {
        if (err.message.includes('429')) {
          attempt++;
          console.log(`Retrying request... Attempt ${attempt}`);
          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retry
        } else {
          setError('Something went wrong, please try again!');
          return;
        }
      }
    }
    setError('Failed after multiple attempts!');
  };

  // Handle search query and make API request
  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setRecipes([]);
    
    try {
      const prompt = query
        ? `Generate a recipe based on the following keywords: ${query}`
        : 'Generate an Indian vegetarian recipe that is high in protein and low in cost. The ingredients should be common and easy to find in Indian kitchens. Include preparation steps, cooking time, and serving details.';

      // Add a slight delay before making the request to avoid throttling
      setTimeout(async () => {
        await retryRequest(prompt);
      }, 2000); // 2-second delay before making the request
    } catch (err) {
      setError('Something went wrong, please try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ padding: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Recipe Finder
        </Typography>

        <TextField
          label="Search for a Recipe"
          variant="outlined"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ marginBottom: '20px' }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Search'}
        </Button>

        {error && <Typography color="error" variant="body1" style={{ marginTop: '20px' }}>{error}</Typography>}

        <div style={{ marginTop: '30px' }}>
          {recipes.map((recipe, index) => (
            <Card key={index} style={{ marginBottom: '20px' }}>
              <CardContent>
                <Typography variant="h5">{recipe.title}</Typography>
                <Typography variant="body1">{recipe.description}</Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default RecipeSearch;
