import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function UpdateOther() {
    const { id } = useParams(); // Get the expense ID from the URL params
    const navigate = useNavigate();

    const [expense, setExpense] = useState({
        Expense_id: '',
        Type: '',
        Date: '',
        Status: '',
        Cost: ''
    });

    useEffect(() => {
        // Fetch the expense details based on the ID
        axios.get(`http://localhost:8080/otherExpense/get/${id}`)
            .then((res) => {
                setExpense(res.data.otherExpense);
            })
            .catch((err) => {
                console.log(err);
                // Handle error
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        // Check if the input is the date field
        const newValue = name === 'Date' ? formatDate(value) : value;
    
        setExpense({ ...expense, [name]: newValue });
    };
    
    const formatDate = (dateString) => {
        // Validate the date string and format it
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (dateString.match(dateRegex)) {
            return dateString;
        } else {
            // If the date format is invalid, return an empty string
            return '';
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Send updated expense data to the backend
        axios.put(`http://localhost:8080/otherExpense/update/${id}`, expense)
            .then((res) => {
                console.log(res.data);
                navigate('/otherExpense');
            })
            .catch((err) => {
                console.log(err);
                // Handle error
            });
    };

    const handleBack = () => {
        navigate('/otherExpense'); // Reset specificExpense to null to display all expenses
    };

    return (
        <div className="container">
    <div className="row justify-content-center">
        <div className="col-md-6">
            <div className="card">
                <div className="card-body">
                    <h2 class="card-title text-center mb-5">Update Expense</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="Expense_id" className="form-label">
                                <i className="bi bi-card-list me-2"></i>Expense ID
                            </label>
                            <input type="text" className="form-control" id="Expense_id" name="Expense_id" value={expense.Expense_id} onChange={handleChange} readOnly />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Type" className="form-label">
                                <i className="bi bi-cash me-2"></i>Type
                            </label>
                            <input type="text" className="form-control" id="Type" name="Type" value={expense.Type} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Date" className="form-label">
                                <i className="bi bi-calendar3 me-2"></i>Date
                            </label>
                            <input type="text" className="form-control" id="Date" name="Date" value={expense.Date || ''} onChange={handleChange} readOnly/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Status" className="form-label">
                                <i className="bi bi-bar-chart me-2"></i>Status
                            </label>
                            <input type="text" className="form-control" id="Status" name="Status" value={expense.Status} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Cost" className="form-label">
                                <i className="bi bi-currency-dollar me-2"></i>Cost(Rs.)
                            </label>
                            <input type="text" className="form-control" id="Cost" name="Cost" value={expense.Cost} onChange={handleChange} />
                        </div>

                        <div className="row mb-3">
                            <div className="col">
                                <div className="btn-group" style={{marginLeft: '340px'}}>
                                    <button type="submit" className="btn btn-primary me-5 rounded">Update Expense</button>
                                    <button className="btn btn-secondary rounded" onClick={handleBack}>Back</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

    );
}