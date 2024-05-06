import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout';
import { toast } from "react-hot-toast"
import axios from "axios"

const NotesPage = () => {
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [selectedNoteIds, setSelectedNoteIds] = useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [noteToUpdate, setNoteToUpdate] = useState({});
    const [showDeletePrompt, setShowDeletePrompt] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [currentDateTime, setCurrentDateTime] = useState('');

    useEffect(() => {
        fetchNotes();
    }, []);

    //displaying date and time
    useEffect(() => {
        const intervalId = setInterval(() => {
            const currentDate = new Date();
            setCurrentDateTime(currentDate.toLocaleString());
        }, 1000); // Update every second
    
        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await axios.get('http://localhost:8080/users/notes/all-notes');
            setNotes(response.data); // Update state with the array of notes
        } catch (error) {
            console.error('Error fetching notes:', error);
            toast.error('Error fetching notes');
        }
    };

    // Handler for selecting individual note
    const handleCheckboxChange = (noteId) => {
    setSelectedNoteIds(prevSelectedNoteIds => {
        if (prevSelectedNoteIds.includes(noteId)) {
            return prevSelectedNoteIds.filter(id => id !== noteId);
        } else {
            return [...prevSelectedNoteIds, noteId];
        }
    });
};

    // Handler for selecting all notes
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedNoteIds([]);
        } else {
            const allNoteIds = notes.map(record => record._id);
            setSelectedNoteIds(allNoteIds);
        }
        setSelectAll(!selectAll);
    };

    // Handler for clearing selected notes
     const handleClearSelection = () => {
        setSelectedNoteIds([]);
        setSelectAll(false);
    };

    // Delete selected notes
    const handleDeleteSelected = async () => {
        // Check if there are selected notes
        if (selectedNoteIds.length === 0) {
            // If no users are selected, show a message and return
            toast.error('No notes selected');
            return;
        }

        try {
            await axios.delete('http://localhost:8080/users/notes/delete-multiple', 
                { data: { NoteIds: selectedNoteIds } 
            });
            toast.success('Selected notes deleted successfully');
            fetchNotes();   // Fetch updated notes
            setSelectedNoteIds([]);
        } catch (error) {
            console.error('Error deleting selected notes:', error);
            toast.error('Error deleting selected notes');
        }
    };

    const handleAddNote = () => {
        navigate('/users/notes/create-note'); // Direct to the 'create-note' page
    };

    //update
    const handleUpdate = (note) => {
        setNoteToUpdate(note);
        setShowUpdateModal(true);
    };

    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false);
    };

    const handleUpdateSubmit = async () => {
        try {
            await axios.put(`http://localhost:8080/users/notes/update-note/${noteToUpdate._id}`, noteToUpdate);
            toast.success("Note updated successfully");
            setShowUpdateModal(false);
            fetchNotes();
        } catch (error) {
            console.error("Error updating note:", error);
            toast.error("Error updating note");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNoteToUpdate({
            ...noteToUpdate,
            [name]: value
        });
    };

    //delete
    const handleDelete = (noteId) => {
        setNoteToDelete(noteId);
        setShowDeletePrompt(true);
    };

    //delete confirmation
    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/users/notes/delete-note/${noteToDelete}`);
            setNotes(notes.filter(note => note._id !== noteToDelete));
            toast.success("Note deleted successfully");
        } catch (error) {
            console.error("Error deleting note:", error);
            toast.error("Error deleting note");
        }
        setShowDeletePrompt(false);
    };

    const cancelDelete = () => {
        setShowDeletePrompt(false);
    };

    const columns = [
        {
            title: 'Meeting Number',
            dataIndex: 'note_no',
            key: 'note_no',
        },
        {
            title: 'Meeting Title',
            dataIndex: 'note_title',
            key: 'note_title',
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt) => new Date(createdAt).toLocaleDateString('en-GB') // Convert createdAt to a readable date format
        },
        {
            title: 'Description',
            dataIndex: 'note_description',
            key: 'note_description',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <span>
                    <Button onClick={() => handleUpdate(record)}>Update</Button>
                    <Button onClick={() => handleDelete(record._id)}>Delete</Button>
                </span>
            ),
        },
        {
            title: 'Select',
            dataIndex: 'note._id',
            key: 'select',
            render: (_, record) => (
                <input
                    type="checkbox"
                    checked={selectedNoteIds.includes(record._id)}
                    onChange={() => handleCheckboxChange(record._id)}
                    />
            ),
        },
    ];

    return (
        <Layout>
            
            <div className="row">
                <div className="col-md-6">
                    <div className="notes p-3">
                        <h2>Meetings</h2>
                    </div>
                </div>
                
                {/* Current Date and Time */}
                <div className="col-md-6 text-md-end mb-6">
                    <div className="date-time p-4">
                        <span className="date">{currentDateTime.split(',')[0]}</span>
                        <span className="time"> | {currentDateTime.split(',')[1]}</span>
                    </div>                     
                </div>
            </div>

            <div className="three-buttons" style={{ marginLeft: 'auto' }}>
                    <Button variant="btn btn-outline-dark" onClick={handleAddNote} style={{ marginRight: '10px' }}>Add New Note</Button>
                    <Button variant="btn btn-outline-danger" onClick={handleDeleteSelected}>Delete Selected</Button>
                    <Button variant="btn btn-outline-dark" onClick={handleSelectAll} style={{ marginLeft: '10px' }}>
                        {selectAll ? 'Deselect All' : 'Select All'}
                    </Button>
                    <Button variant="btn btn-outline-danger" onClick={handleClearSelection} style={{ marginLeft: '10px' }}>Clear Selection</Button>
            </div> 
            <br/>
        
            {/* table */}
            <Table columns={columns} dataSource={notes} rowKey="_id" /> {/* Render the table with notes data */}

            {/* Update Note Modal */}
            <Modal
                title="Update Meeting"
                visible={showUpdateModal}
                onCancel={handleCloseUpdateModal}
                footer={[
                    <Button key="cancel" onClick={handleCloseUpdateModal}>Cancel</Button>,
                    <Button key="submit" type="primary" onClick={handleUpdateSubmit}>Update</Button>,
                ]}
            >
                <Form>
                    <Form.Item label="Note Title">
                        <Input name="note_title" value={noteToUpdate.note_title} onChange={handleInputChange} />
                    </Form.Item>

                    <Form.Item label="Note Description">
                        <Input.TextArea name="note_description" value={noteToUpdate.note_description} onChange={handleInputChange} />
                    </Form.Item>

                </Form>
            </Modal>

            {/* Delete Note Confirmation Modal */}
            <Modal
                title="Confirm Deletion"
                visible={showDeletePrompt}
                onOk={confirmDelete}
                onCancel={cancelDelete}
                okText="Delete"
                cancelText="Cancel"
            >
                Are you sure you want to delete this meeting?
            </Modal>

        </Layout>
    );
};

export default NotesPage;
