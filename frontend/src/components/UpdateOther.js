import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate} from 'react-router-dom';
import Layout from './Layout';

export default function UpdateOther() {
    const { id } = useParams(); // Get the expense ID from the URL params
    const [costError, setCostError] = useState('');
    const navigate = useNavigate();

    const [expense, setExpense] = useState({
        Expense_id: '',
        Type: '',
        Date: '',
        Status: '',
        Cost: ''
    });

    useEffect(() => {
        // Fetch the expense details based on the ID that need to be edited
        axios.get(`http://localhost:8080/otherExpense/get/${id}`)
            .then((res) => {
                setExpense(res.data.otherExpense);
            })
            .catch((err) => {
                console.log(err);
                // Handle error
            });
    }, [id]);

    //function to save new value in each input field
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

    //function to submit updated details
    const handleSubmit = (e) => {
        e.preventDefault();

        const costRegex = /^[0-9]+(\.[0-9]{1,2})?$/; // Only integers or double values allowed (up to 2 decimal places)

            // Validate input for "Cost" field
            if (!costRegex.test(expense.Cost)) {
                // If the input is invalid, update the error message
                setCostError('Invalid input. Only numerical values allowed (up to 2 decimal places).');
                return;
            } else {
                setCostError(''); // Clear any existing error
            }

        // Send updated expense data to the backend
        axios.put(`http://localhost:8080/otherExpense/update/${id}`, expense)
            .then((res) => {
                console.log(res.data);
                navigate('/dashboard/finance/otherExpense');
            })
            .catch((err) => {
                console.log(err);
                // Handle error
            });
    };

    return (
        <Layout>
        <div className="container" style={{ marginTop: '20px', marginBottom: '40px' }}>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <div className="col text-center mb-4">
                                <h2 className="card-title text-center">Expense Details</h2>
                            </div>
                            {/*Form to Update Expense*/}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="Expense_id" className="form-label">
                                        <i className="bi bi-card-list me-2"></i>Expense ID
                                    </label>
                                    <input type="text" className="form-control" id="Expense_id" name="Expense_id" value={expense.Expense_id} onChange={handleChange} readOnly />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="type" className="form-label"><i class="bi bi-chat-left-text"></i>  Type of Expense</label>
                                    <select className="form-select" id="Type" name="Type" value={expense.Type} onChange={handleChange} required>
                                        <option value="">Select Type</option>
                                        <option value="Transportation">Transportation</option>
                                        <option value="Construction">Construction</option>
                                        <option value="Repair">Repair</option>
                                        <option value="Utilities">Utilities</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="Date" className="form-label">
                                        <i className="bi bi-calendar3 me-2"></i>Date
                                    </label>
                                    <input type="date" className="form-control" id="Date" name="Date" value={expense.Date ? new Date(expense.Date).toISOString().split('T')[0] : ''} onChange={handleChange} readOnly />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="Status" className="form-label">
                                        <i className="bi bi-bar-chart me-2"></i>Status
                                    </label>
                                    <input type="text" className="form-control" id="Status" name="Status" value={expense.Status} onChange={handleChange} required/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="Cost" className="form-label">
                                        <i className="bi bi-currency-dollar me-2"></i>Amount(Rs.)
                                    </label>
                                    <input type="text" className="form-control" id="Cost" name="Cost" value={expense.Cost} onChange={handleChange} required/>
                                </div>
                                {costError && <div className="text-danger mb-2">{costError}</div>}
                                <div className="row mb-3">
                                    <div className="col">
                                        <div className="btn-group" style={{ marginLeft: '220px' }}>
                                            <button type="submit" className="btn btn-outline-primary me-5"><i className="ri-edit-line"></i>  Update Expense</button>{/*Update button*/}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </Layout>
    );
}