import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

function UpdateTax() {
    const { id } = useParams(); // Get the expense ID from the URL params
    const [isOpen, setIsOpen] = useState(false);
    const [totalEPF, setTotalEPF] = useState(0);
    const [totalETF, setTotalETF] = useState(0);
    const [total, setTotal] = useState(0);
    const [profit, setTotalProfits] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalOther, setTotalOther] = useState(0);
    const [totalSupp, setTotalSupp] = useState(0);
    const [totalSalary, setTotalSalary] = useState(0);
    const [Profit_ID, setID] = useState("");
    const [Month, setMonth] = useState("");
    const [Date_created, setDate] = useState("");
    const [Description, setDesc] = useState("");
    const [currentDate, setCurrentDate] = useState('');
    const [totalProfit, setTotalProfit] = useState(0);
    const [rateError, setRateError] = useState('');
    const navigate = useNavigate();

    const [Tax, setTax] = useState({
        Tax_ID: '',
        Taxable_income: '',
        Rate: '',
        Income_tax: '',
        Due_date: '',
        Date_modified: '',
        Status: '',
        Final_profit: ''
    });

    useEffect(() => {
        // Fetch the profit details based on the ID
        axios.get(`http://localhost:8080/tax/get/${id}`)
            .then((res) => {
                setTax(res.data.tax);
            })
            .catch((err) => {
                console.log(err);
                // Handle error
            });
    }, [id]);

    const handleChanges = (e) => {
        const { name, value } = e.target;
        const newValue = name === 'Date' ? formatDate(value) : value;

        // If the name matches specific fields, format the value accordingly
        setTax({ ...Tax, [name]: newValue });
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

    const getCurrentYear = () => {
        const currentDate = new Date();
        return currentDate.getFullYear();
    };

    useEffect(() => {
        let currentYear = getCurrentYear();
        axios.get(`http://localhost:8080/tax/profit/${currentYear}`)
            .then((res) => {
                setTotalProfit(res.data.totalProfit);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const rateRegex = /^[0-9]+(\.[0-9]{1,2})?$/; // Only integers or double values allowed (up to 2 decimal places)

            // Validate input for "Cost" field
            if (!rateRegex.test(Tax.Rate)) {
                // If the input is invalid, update the error message
                setRateError('Invalid input. Only numerical values allowed (up to 2 decimal places).');
                return;
            } else {
                setRateError(''); // Clear any existing error
            }

        const newTax = {
            Tax_ID: Tax.Tax_ID,
            Taxable_income: totalProfit,
            Rate: Tax.Rate,
            Income_tax: (Tax.Rate * totalProfit * 0.01).toFixed(2),
            Due_date: Tax.Due_date,
            Date_modified: currentDate,
            Status: Tax.Status,
            Final_profit: ((parseFloat(totalProfit)) - (Tax.Rate * totalProfit * 0.01)).toFixed(2)
        };

        // Send updated data to the backend
        axios.put(`http://localhost:8080/tax/update/${Tax._id}`, newTax)
            .then((res) => {
                console.log(res.data);
                navigate(`/tax/get/${Tax.Tax_ID}`);
            })
            .catch((err) => {
                console.log(err);
                // Handle error
            });
    };

    const handleBack = () => {
        navigate(`/profit/get/${Tax.Tax_ID}`); // Reset specificExpense to null to display all expenses
    };

    useEffect(() => {
        const getCurrentDate = () => {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            setCurrentDate(formattedDate);
        };

        getCurrentDate();
    }, []); // Run only once after the component mount

    return (
        <div className="container" style={{ marginTop: '90px' }}>
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <form onSubmit={handleSubmit}>
                        <div className="card">
                            <div className="card-body">
                                <h2 class="card-title text-center mb-5">Tax Details</h2>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="id" className="form-label">
                                                <i className="bi bi-card-list me-2"></i>Tax Doc ID
                                            </label>
                                            <input type="text" className={`form-control`} id="id" name='Tax_ID' value={Tax.Tax_ID} onChange={handleChanges} readOnly />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="month" className="form-label">
                                                <i className="bi bi-calendar3 me-2"></i>Taxable Income
                                            </label>
                                            <input type="text" className="form-control" id="month" name='Taxable_income' value={totalProfit.toFixed(2)} onChange={handleChanges} readOnly />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="sales" className="form-label">
                                                <i className="bi bi-currency-dollar me-2"></i>Rate
                                            </label>
                                            <input type="text" className="form-control" id="sales" name='Rate' value={Tax.Rate} onChange={handleChanges} />
                                            {rateError && <div className="text-danger">{rateError}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="supplier" className="form-label">
                                                <i className="bi bi-people me-2"></i>Income Tax
                                            </label>
                                            <input type="text" className="form-control" id="supplier" name='Income_tax' value={(Tax.Rate * totalProfit * 0.01).toFixed(2)} onChange={handleChanges} readOnly />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="salaries" className="form-label">
                                                <i className="bi bi-people-fill me-2"></i>Due Date
                                            </label>
                                            <input type="date" className="form-control" id="salaries" name='Due_date' value={Tax.Due_date ? new Date(Tax.Due_date).toISOString().split('T')[0] : ''} onChange={handleChanges} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="other" className="form-label">
                                                <i className="bi bi-journal me-2"></i>Date modified
                                            </label>
                                            <input type="date" className="form-control" id="other" name='Date_modified' value={currentDate ? new Date(currentDate).toISOString().split('T')[0] : ''} onChange={handleChanges} readOnly/>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="profit" className="form-label">
                                                <i className="bi bi-cash me-2"></i>Payment Status
                                            </label>
                                            <input type="text" className="form-control" id="profit" name='Status' value={Tax.Status} onChange={handleChanges} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="desc" className="form-label">
                                                <i className="bi bi-chat-dots me-2"></i>Final Profit
                                            </label>
                                            <input type="text" className="form-control" id="desc" name='Final_profit' value={((parseFloat(totalProfit)) - (Tax.Rate * totalProfit * 0.01)).toFixed(2)} onChange={handleChanges} readOnly />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                            <button type="submit" className="btn btn-primary me-5 rounded">Update Tax Details</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default UpdateTax;