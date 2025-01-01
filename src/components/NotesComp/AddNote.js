import React, { useContext, useState } from "react";
import { TextField, Button, Chip, Typography, Box, CircularProgress, Snackbar, Alert as MuiAlert } from "@mui/material";
import { motion } from "framer-motion";
import noteContext from "../../context/noteContext";

const AddNote = () => {
  const context = useContext(noteContext);
  const { addNote } = context;

  const [note, setNote] = useState({ title: "", description: "", tags: [] });
  const [tagInput, setTagInput] = useState(""); // To handle tag input field
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent multiple submissions
  const [alert, setAlert] = useState(null); // State for alert messages

  // Function to display alerts using Snackbar
  const showAlert = (message, type) => {
    setAlert({ message, type });
  };

  // Handle form submission
  const handleClick = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent duplicate submissions

    setIsSubmitting(true);
    const tagString = note.tags.join(", "); // Combine tags into a string
    try {
     addNote(note.title, note.description, tagString);
      showAlert("Note added successfully!", "success");
      setNote({ title: "", description: "", tags: [] }); // Reset form
      setTagInput("");
    } catch (error) {
      showAlert("Failed to add note. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle changes for title and description
  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  // Handle tag input changes
  const handleTagChange = (e) => {
    setTagInput(e.target.value);
  };

  // Add tags on Enter key or blur
  const addTags = (e) => {
    if (e.key === "Enter" || e.type === "blur") {
      e.preventDefault();
      if (tagInput.trim() === "") return; // Prevent empty tags
      const newTags = tagInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag); // Clean up empty tags
      setNote({ ...note, tags: [...new Set([...note.tags, ...newTags])] });
      setTagInput(""); // Clear input field
    }
  };

  // Remove individual tags
  const removeTag = (index) => {
    const updatedTags = note.tags.filter((_, i) => i !== index);
    setNote({ ...note, tags: updatedTags });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Input Section */}
      <Box
        sx={{
          padding: 3,
          borderRadius: 2,
          boxShadow: 2,
          backgroundColor: "#f5f5f5",
          width: "100%",
          maxWidth: 600,
          margin: "0 auto",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Add a New Note
        </Typography>

        <TextField
          fullWidth
          name="title"
          label="Note Title"
          variant="outlined"
          value={note.title}
          onChange={onChange}
          sx={{ marginBottom: 2 }}
        />

        <TextField
          fullWidth
          name="description"
          label="Note Content"
          variant="outlined"
          multiline
          rows={4}
          value={note.description}
          onChange={onChange}
          sx={{ marginBottom: 2 }}
        />

        {/* Tag Input */}
        <TextField
          fullWidth
          label="Add Tags (comma-separated)"
          variant="outlined"
          value={tagInput}
          onChange={handleTagChange}
          onKeyDown={addTags}
          onBlur={addTags}
          sx={{ marginBottom: 2 }}
        />

        <Box sx={{ marginBottom: 2 }}>
          {note.tags.length === 0 && (
            <Typography variant="body2" color="textSecondary">
              No tags added yet
            </Typography>
          )}
          {note.tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              onDelete={() => removeTag(index)}
              sx={{ marginRight: 1, marginBottom: 1 }}
            />
          ))}
        </Box>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleClick}
          disabled={
            note.title.trim().length < 3 || note.description.trim().length < 5
          }
          sx={{ padding: "10px 0", fontWeight: "bold" }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Add Note"
          )}
        </Button>
      </Box>

      {/* Snackbar for Alert */}
      <Snackbar
        open={alert !== null}
        autoHideDuration={3000}
        onClose={() => setAlert(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert onClose={() => setAlert(null)} severity={alert?.type}>
          {alert?.message}
        </MuiAlert>
      </Snackbar>
    </motion.div>
  );
};

export default AddNote;
