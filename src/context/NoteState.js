import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);
  let authtoken = localStorage.getItem("authToken");

  // Get all Notes
  const getNotes = async () => {
    try {
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authtoken, // Corrected
        },
      });

      if (response.ok) {
        const json = await response.json();
        console.log("Fetched Notes:", json); // Debugging
        setNotes(Array.isArray(json) ? json : []); // Safeguard
      } else {
        console.error("Failed to fetch notes:", response.statusText);
        setNotes([]); // Fallback
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Add a Note
  const addNote = async (title, description, tag) => {
    try {
      const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authtoken, // Corrected
        },
        body: JSON.stringify({ title, description, tag }),
      });

      if (response.ok) {
        const note = await response.json();
        console.log("New Note:", note); // Debugging
        setNotes([...notes, note]); // Append new note
      } else {
        console.error("Failed to add note:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  // Delete a Note
  const deleteNote = async (id) => {
    try {
      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authtoken, // Corrected
        },
      });

      if (response.ok) {
        console.log("Deleted Note Response:", await response.json()); // Debugging
        const newNotes = notes.filter((note) => note._id !== id);
        setNotes(newNotes);
      } else {
        console.error("Failed to delete note:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Edit a Note
  const editNote = async (id, title, description, tag) => {
    try {
      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authtoken, // Corrected
        },
        body: JSON.stringify({ title, description, tag }),
      });

      if (response.ok) {
        console.log("Updated Note Response:", await response.json()); // Debugging

        // Create a new copy of notes and update the relevant note
        const newNotes = notes.map((note) =>
          note._id === id ? { ...note, title, description, tag } : note
        );
        setNotes(newNotes);
      } else {
        console.error("Failed to update note:", response.statusText);
      }
    } catch (error) {
      console.error("Error editing note:", error);
    }
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        addNote,
        deleteNote,
        editNote,
        getNotes,
      }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
