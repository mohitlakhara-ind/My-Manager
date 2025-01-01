import React from "react";
import AddNote from "./AddNote";
 import NoteState from '../../context/NoteState'
//  import NoteComponent from './NotesComp'
import Notes from "./Notes";
export default function Home() {
  return (
    <div>
      <NoteState>
        <AddNote />
        <Notes />
      </NoteState>
    </div>
  );
}
