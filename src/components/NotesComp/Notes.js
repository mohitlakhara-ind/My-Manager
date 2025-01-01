import React, { useContext, useEffect, useState } from 'react';
import noteContext from '../../context/noteContext';
import Noteitem from './NotesComp';

const Notes = () => {
    const { notes, getNotes, editNote } = useContext(noteContext);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [note, setNote] = useState({ id: '', etitle: '', edescription: '', etag: '' });

    useEffect(() => {
        getNotes(); // Fetch notes on component mount
    }, [getNotes]);

    const openModal = (currentNote) => {
        setNote({
            id: currentNote._id,
            etitle: currentNote.title,
            edescription: currentNote.description,
            etag: currentNote.tag,
        });
        setIsModalOpen(true);
    };

    const handleUpdate = () => {
        editNote(note.id, note.etitle, note.edescription, note.etag);
        closeModal();
    };

    const handleChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {/* Modal for editing a note */}
            {isModalOpen && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Note</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="etitle" className="form-label">Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="etitle"
                                            name="etitle"
                                            value={note.etitle}
                                            onChange={handleChange}
                                            minLength={5}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="edescription" className="form-label">Description</label>
                                        <textarea
                                            className="form-control"
                                            id="edescription"
                                            name="edescription"
                                            value={note.edescription}
                                            onChange={handleChange}
                                            minLength={5}
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="etag" className="form-label">Tag</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="etag"
                                            name="etag"
                                            value={note.etag}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    disabled={note.etitle.length < 5 || note.edescription.length < 5}
                                    onClick={handleUpdate}
                                >
                                    Update Note
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Notes Section */}
            <div className="row my-3">
                <h2>Your Notes</h2>
                <div className="container mx-2">
                    {!Array.isArray(notes) || notes.length === 0 ? (
                        <p>No notes to display</p>
                    ) : (
                        notes.map((note) => (
                            <Noteitem key={note._id} updateNote={openModal} note={note} />
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default Notes;
