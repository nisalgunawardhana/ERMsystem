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
        setExpense({ ...expense, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Send updated expense data to the backend
        axios.put(`http://localhost:8080/otherExpense/update/${id}`, expense)
            .then((res) => {
                console.log(res.data);
                navigate('/');
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
            <h2>Update Expense</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="Expense_id" className="form-label">Expense ID</label>
                    <input type="text" className="form-control" id="Expense_id" name="Expense_id" value={expense.Expense_id} onChange={handleChange} readOnly/>
                </div>
                <div className="mb-3">
                    <label htmlFor="Type" className="form-label">Type</label>
                    <input type="text" className="form-control" id="Type" name="Type" value={expense.Type} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="Date" className="form-label">Date</label>
                    <input type="date" className="form-control" id="Date" name="Date" value={expense.Date} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="Status" className="form-label">Status</label>
                    <input type="text" className="form-control" id="Status" name="Status" value={expense.Status} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="Cost" className="form-label">Cost</label>
                    <input type="text" className="form-control" id="Cost" name="Cost" value={expense.Cost} onChange={handleChange} />
                </div>
                
                <div className="row mb-3">
                    <div className="col">
                       <div className="btn-group">
                          <button type="submit" className="btn btn-primary me-5 rounded">Update Expense</button>
                          <button className="btn btn-secondary rounded" onClick={handleBack}>Back</button>
                       </div>
                    </div>
                </div>
            </form>
        </div>
    );
}