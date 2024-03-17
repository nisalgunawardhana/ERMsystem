import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from "react-router-dom";

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

    const [searchTerm, setSearchTerm] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [specificExpense, setSpecificExpense] = useState(null);

    useEffect(() => {
        function getOther() {
            const url = searchTerm ? `http://localhost:8080/otherExpense/?search=${searchTerm}` : "http://localhost:8080/otherExpense/";
            axios.get(url)
                .then((res) => {
                    setOther(res.data);
                })
                .catch((err) => {
                    alert(err.message);
                })
        }
        getOther();
    }, [searchTerm]);

    const handleSearch = () => {
        const url = searchDate ? `http://localhost:8080/otherExpense/?date=${searchDate}` : "http://localhost:8080/otherExpense/";
        axios.get(url)
            .then((res) => {
                const foundExpense = res.data.find(expense => expense.Date === searchDate);
                if (foundExpense) {
                    setSpecificExpense(foundExpense);
                } else {
                    setSpecificExpense(null);
                    alert("No expense found for the selected date.");
                }
            })
            .catch((err) => {
                alert(err.message);
            })
    };

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

    return (
        <div className="container">
            {!specificExpense ? (
                <div className="row mb-3">
                    <div className="col">
                        <input type="date" className="form-control" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
                    </div>
                    <div className="col-auto">
                        <button className="btn btn-primary" onClick={handleSearch}>Search</button>
                    </div>
                </div>
            ) : (
                <button className="btn btn-secondary mb-3" onClick={handleBack}>Back</button>
            )}
            <br /><br />

            {specificExpense ? (
                <div>
                    <h3>Expense Details</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Expense_id</th>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Cost</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr key={specificExpense._id}>
                                <td>{specificExpense.Expense_id}</td>
                                <td>{specificExpense.Type}</td>
                                <td>{specificExpense.Date}</td>
                                <td>{specificExpense.Status}</td>
                                <td>{specificExpense.Cost}</td>
                                <td>
                                    <Link to={`/otherExpense/update/${specificExpense._id}`} className="btn btn-primary me-2">Update</Link>
                                    <button className="btn btn-danger" onClick={() => handleDelete(specificExpense._id)}>Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : (

                <div>
                    <div className="d-flex justify-content-start mb-3 align-items-center">
                        <h3 className="me-5">All Other Expenses</h3>
                        <Link to="/otherExpense/add" className="btn btn-success">Add Expense</Link>
                    </div>

                    <br></br>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Expense_id</th>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Cost</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {other.map(expense => (
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
                    {showDeletePrompt && (
                        <div>
                            <div>
                                <p>Are you sure you want to delete this expense?</p>
                                <div>
                                    <button className="btn btn-danger me-2" onClick={confirmDelete}>Yes</button>
                                    <button className="btn btn-secondary" onClick={cancelDelete}>No</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}