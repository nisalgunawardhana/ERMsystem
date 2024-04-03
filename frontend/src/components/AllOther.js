import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { Modal, Button } from 'react-bootstrap';

export default function AllOther() {

    const [other, setOther] = useState([]);

    useEffect(() => {
        function getOther() {
            axios.get("http://localhost:8080/otherExpense/").then((res) => {
                setOther(res.data);
            }).catch((err) => {
                alert(err.message);
            })
        }
        getOther();
    }, [])

    const [filteredOther, setFilteredOther] = useState([]); // State to hold filtered data
    const [searchTerm, setSearchTerm] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [specificExpense, setSpecificExpense] = useState(null);

    useEffect(() => {
        function getOther() {
            const url = searchTerm ? `http://localhost:8080/otherExpense/?search=${searchTerm}` : "http://localhost:8080/otherExpense/";
            axios.get(url)
                .then((res) => {
                    setOther(res.data);
                    setFilteredOther(res.data);
                })
                .catch((err) => {
                    alert(err.message);
                })
        }
        getOther();
    }, []);

    const handleBack = () => {
        setSpecificExpense(null);
    };

    const [expenseToDelete, setExpenseToDelete] = useState(null);
    const [showDeletePrompt, setShowDeletePrompt] = useState(false);

    const handleDelete = async (id) => {
        setExpenseToDelete(id);
        setShowDeletePrompt(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/otherExpense/delete/${expenseToDelete}`);
            setShowDeletePrompt(false);
            alert("Expense deleted successfully.");
            // Update the state to reflect the deletion
            setOther(other.filter(expense => expense._id !== expenseToDelete));
        } catch (error) {
            console.error("Error deleting expense:", error);
            alert("Error deleting expense. Please try again later.");
        }
        setShowDeletePrompt(false);
    };

    const cancelDelete = () => {
        setShowDeletePrompt(false);
    };

    const [month, setMonth] = useState({ Month: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMonth(prevState => ({ ...prevState, [name]: value }));
    };

    const submit = (e) => {
        e.preventDefault();
        // Redirect to the page where total amount is fetched for the entered month
        window.location.href = `/profit/${month.Month}`;
    };

    const columns = [
        { field: 'Expense_id', label: 'Expense ID', sortable: true },
        { field: 'Type', label: 'Type', sortable: false },
        { field: 'Date', label: 'Date', sortable: true },
        { field: 'Status', label: 'Status', sortable: false },
        { field: 'Cost', label: 'Cost', sortable: true },

    ];

    const [sortConfig, setSortConfig] = useState(null);

    useEffect(() => {
        // Function to filter data based on search term
        const filteredData = other.filter(entry =>
            Object.values(entry).some(value =>
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredOther(filteredData);
    }, [searchTerm, other]); // Trigger filtering whenever search term or original data changes

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const requestSort = (field) => {
        const direction = sortConfig && sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ field, direction });
    };

    const getSortIcon = (field) => {
        if (sortConfig && sortConfig.field === field) {
            return sortConfig.direction === 'asc' ? '▲' : '▼';
        }
        return '';
    };

    const sortedData = () => {
        if (!sortConfig) return filteredOther;
        return [...filteredOther].sort((a, b) => {
            const aValue = a[sortConfig.field];
            const bValue = b[sortConfig.field];
    
            // Check if the values are not strings
            if (typeof aValue !== 'string' || typeof bValue !== 'string') {
                // Handle comparison for non-string values (e.g., Date)
                return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
            }
    
            // Use localeCompare for string values
            return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        });
    };    

    return (
        <div className="container" >

            <div className="row mb-3">
                <div className="col">
                    <input type="text" className="form-control" value={searchTerm} onChange={handleSearchChange} placeholder="Search..." />
                </div>
            </div>

            <br /><br />

            <div>
                <div className="d-flex justify-content-start mb-3 align-items-center">
                    <h3 className="me-5">All Other Expenses</h3>
                    <Link to="/otherExpense/add" className="btn btn-success">Add Expense</Link>
                </div>

                <br></br>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col">
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th style={{ cursor: 'pointer' }} onClick={() => requestSort('Expense_id')}>
                                                Expense ID
                                                {getSortIcon('Expense_id')}
                                            </th>
                                            <th>Type</th>
                                            <th style={{ cursor: 'pointer' }} onClick={() => requestSort('Date')}>
                                                Date
                                                {getSortIcon('Date')}
                                            </th>
                                            <th>Status</th>
                                            <th style={{ cursor: 'pointer' }} onClick={() => requestSort('Cost')}>
                                                Cost
                                                {getSortIcon('Cost')}
                                            </th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedData().map(expense => (
                                            <tr key={expense._id}>
                                                <td>{expense.Expense_id}</td>
                                                <td>{expense.Type}</td>
                                                <td>{expense.Date}</td>
                                                <td>{expense.Status}</td>
                                                <td>{expense.Cost}</td>
                                                <td>
                                                    <Link to={`/otherExpense/update/${expense._id}`} className="btn btn-primary me-2">Update</Link>
                                                    <button className="btn btn-danger" onClick={() => handleDelete(expense._id)}>Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {showDeletePrompt && (
                    <Modal show={showDeletePrompt} onHide={cancelDelete}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Deletion</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Are you sure you want to delete this expense?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={confirmDelete}>Yes</Button>
                            <Button variant="secondary" onClick={cancelDelete}>No</Button>
                        </Modal.Footer>
                    </Modal>
                )}
            </div>

        </div>
    )
}