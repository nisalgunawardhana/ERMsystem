import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker } from 'antd';
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout';
import { toast } from "react-hot-toast"
import axios from "axios"

const NotesPage = () => {
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [noteToUpdate, setNoteToUpdate] = useState({});
    const [showDeletePrompt, setShowDeletePrompt] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState(null);
    const [currentDateTime, setCurrentDateTime] = useState('');

    useEffect(() => {
        fetchNotes();
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

    useEffect(() => {
        const intervalId = setInterval(() => {
            const currentDate = new Date();
            setCurrentDateTime(currentDate.toLocaleString());
        }, 1000); // Update every second
    
        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, []);

    const handleAddNote = () => {
        navigate('/users/notes/create-note'); // Direct to the 'create-note' page
    };

    const handleUpdate = (note) => {
        setNoteToUpdate(note);
        setShowUpdateModal(true);
    };

    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false);
    };

    const handleUpdateSubmit = async () => {
        try {
            await axios.put(`http://localhost:8080/users/notes//update-note/${noteToUpdate._id}`, noteToUpdate);
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

    const handleDelete = (noteId) => {
        setNoteToDelete(noteId);
        setShowDeletePrompt(true);
    };

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
            title: 'Note Number',
            dataIndex: 'note_no',
            key: 'note_no',
        },
        {
            title: 'Note Title',
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
 
    ];

    return (
        <Layout>
            <h2>Notes</h2>
            <Button onClick={handleAddNote}>Add New Note</Button>

            <Table columns={columns} dataSource={notes} rowKey="_id" /> {/* Render the table with notes data */}

            {/* Update Note Modal */}
            <Modal
                title="Update Note"
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
                Are you sure you want to delete this note?
            </Modal>

        </Layout>
    );
};

export default NotesPage;
