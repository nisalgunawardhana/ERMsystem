import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function UpdateProfit() {
    const { id } = useParams(); // Get the expense ID from the URL params
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalOther, setTotalOther] = useState(0);
    const [totalSupp, setTotalSupp] = useState(0);
    const navigate = useNavigate();

    const [Profit, setProfit] = useState({
        Profit_ID: '',
        Month: '',
        Sales_income: '',
        Supplier_expenses: '',
        Salaries: '',
        Other_expenses: '',
        Monthly_profit: '',
        Date_created: '',
        Description: ''
    });

    useEffect(() => {
        // Fetch the profit details based on the ID
        axios.get(`http://localhost:8080/profit/gett/${id}`)
            .then((res) => {
                setProfit(res.data.profit);
            })
            .catch((err) => {
                console.log(err);
                // Handle error
            });
    }, [id]);

    const handleChanges = (e) => {
        
        const { name, value } = e.target;

        const newValue = name === 'Date' ? formatDate(value) : value;
        
        setProfit({ ...Profit, [name]: newValue });
        
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
        axios.put(`http://localhost:8080/profit/update/${Profit._id}`, Profit)
            .then((res) => {
                console.log(res.data);
                navigate(`/profit/get/${Profit.Profit_ID}`);
            })
            .catch((err) => {
                console.log(err);
                // Handle error
            });
    };

    const handleBack = () => {
        navigate(`/profit/get/${Profit.Profit_ID}`); // Reset specificExpense to null to display all expenses
    };

    return (
        <div>
        <form onSubmit={handleSubmit}>
            <div className="card border-light shadow-sm" style={{ marginLeft: '300px', marginTop: '10px', width: '1000px' }}>
                <div className="card-body">
                    <h2 class="card-title text-center mb-5">Update Profit Log</h2>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="id" className="form-label">
                                    <i className="bi bi-card-list me-2"></i>Profit Log ID
                                </label>
                                <input type="text" className="form-control" id="id" value={Profit.Profit_ID} onChange={handleChanges}  />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="month" className="form-label">
                                    <i className="bi bi-calendar3 me-2"></i>Month
                                </label>
                                <input type="text" className="form-control" id="month" value={Profit.Month} onChange={handleChanges} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="sales" className="form-label">
                                    <i className="bi bi-currency-dollar me-2"></i>Sales income
                                </label>
                                <input type="text" className="form-control" id="sales" value={Profit.Sales_income} onChange={handleChanges}  />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="supplier" className="form-label">
                                    <i className="bi bi-people me-2"></i>Supplier Expenses
                                </label>
                                <input type="text" className="form-control" id="supplier" value={Profit.Supplier_expenses} onChange={handleChanges}  />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="salaries" className="form-label">
                                    <i className="bi bi-people-fill me-2"></i>Employee salaries
                                </label>
                                <input type="text" className="form-control" id="salaries" value={Profit.Salaries} onChange={handleChanges} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="other" className="form-label">
                                    <i className="bi bi-journal me-2"></i>Other Expenses
                                </label>
                                <input type="text" className="form-control" id="other" value={Profit.Other_expenses} onChange={handleChanges} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="profit" className="form-label">
                                    <i className="bi bi-cash me-2"></i>Monthly Profit
                                </label>
                                <input type="text" className="form-control" id="profit" value={Profit.Monthly_profit} onChange={handleChanges} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="date" className="form-label">
                                    <i className="bi bi-calendar2 me-2"></i>Date created
                                </label>
                                <input type="date" className="form-control" id="date" value={Profit.Date_created ? new Date(Profit.Date_created).toISOString().split('T')[0] : ''} onChange={handleChanges} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="desc" className="form-label">
                                    <i className="bi bi-chat-dots me-2"></i>Description
                                </label>
                                <textarea className="form-control" id="desc" value={Profit.Description} onChange={handleChanges} rows={5} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="btn-group" style={{ marginLeft: '700px' }}>
                                <button type="submit" className="btn btn-primary me-5 rounded">Update Details</button>
                                <button className="btn btn-secondary rounded" onClick={handleBack}>Back</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        </div>
        

    );
}