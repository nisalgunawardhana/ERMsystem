import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Layout from './Layout';

function AddTax({ EPF, ETF }) {
    const [totalProfit, setTotalProfit] = useState(0);
    const [totalSalary, setTotalSalary] = useState(0);
    const [Tax_ID, setID] = useState("");
    const [Taxable_income, setProfit] = useState("");
    const [Rate, setRate] = useState();
    const [Income_tax, setIncomeTax] = useState();
    const [Due_date, setDue] = useState();
    const [Date_created, setModified] = useState();
    const [Status, setStatus] = useState();
    const [Final_profit, setFinal] = useState(0);
    const [currentDate, setCurrentDate] = useState('');
    const [rateError, setRateError] = useState('');
    const navigate = useNavigate();

    const getCurrentYear = () => {
        const currentDate = new Date();
        return currentDate.getFullYear();
    };

    useEffect(() => {
        let currentYear = getCurrentYear();
        fetchLatestId();
        axios.get(`http://localhost:8080/tax/profit/${currentYear}`)
            .then((res) => {
                setTotalProfit(res.data.totalProfit);
            })
            .catch((err) => {
                console.error(err);
            });
        axios.get(`http://localhost:8080/tax/salary/`)
            .then((res) => {
                setTotalSalary(res.data.totalProfit);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    const fetchLatestId = async () => {
        try {
            const response = await axios.get("http://localhost:8080/tax/getId/latest");
            setID(response.data.nextId);
        } catch (error) {
            console.error("Error fetching latest Tax ID:", error);
            alert("Error fetching latest Tax ID. Please try again later.");
        }
    };

    const calculateIncomeTax = (rate) => {
        // Calculate income tax
        const incomeTax = (totalProfit * rate) / 100;
        setIncomeTax(incomeTax.toFixed(2)); // Set the income tax with two decimal places
    };

    const sendData = async (e) => {
        e.preventDefault();

        const rateRegex = /^[0-9]+(\.[0-9]{1,2})?$/; // Only integers or double values allowed (up to 2 decimal places)

            // Validate input for "Cost" field
            if (!rateRegex.test(Rate)) {
                // If the input is invalid, update the error message
                setRateError('Invalid input. Only numerical values allowed (up to 2 decimal places).');
                return;
            } else {
                setRateError(''); // Clear any existing error
            }

        const tot = (parseFloat(totalProfit).toFixed(2) - Income_tax);

        const newTax = {
            Tax_ID,
            Taxable_income: totalProfit,
            Rate,
            Income_tax: Income_tax,
            Due_date,
            Date_modified: currentDate,
            Status,
            Final_profit: tot
        };

        try {
            // Check if the profit log already exists
            const checkRes = await axios.post("http://localhost:8080/tax/add/check", newTax);

            // If the profit log exists, display an alert and return without submitting the form
            if (checkRes.data.exists) {
                alert(checkRes.data.message);
                return;
            }

            // If the profit log doesn't exist, add it
            const res = await axios.post("http://localhost:8080/tax/add", newTax);
            if (res.status === 200) {
                setTimeout(() => {
                    // Display success toast message
                    toast.success('Tax Document added successfully!');
                }, 2000);
                setID("");
                setProfit("");
                setRate(0);
                setIncomeTax(0);
                setDue(0);
                setModified(0);
                setStatus("");
                setFinal("");
                navigate(`/dashboard/finance/tax`);
            }
        } catch (error) {
            console.error("Error:", error);
            // Handle other errors, such as network errors or server errors
        }
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

    const handleChange = (value) => {
        setID(value);
    };

    return (
        <Layout>
        <div className="container" style={{ marginTop: '20px' }}>
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <form onSubmit={sendData}>
                        <div className="card">
                            <div className="card-body">
                                <div className="row align-items-center mb-5">
                                    <div className="col text-center">
                                        <h2 className="card-title text-center mb-0">Tax Details</h2>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="id" className="form-label">
                                                <i className="bi bi-card-list me-2"></i>Tax Doc ID
                                            </label>
                                            <input type="text" className="form-control" id="id" value={Tax_ID} onChange={(e) => handleChange(e.target.value)} required readOnly/>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="month" className="form-label">
                                                <i className="bi bi-calendar3 me-2"></i>Taxable Income
                                            </label>
                                            <input type="text" className="form-control" id="month" value={totalProfit.toFixed(2)} onChange={(e) => setProfit(e.target.value)} required readOnly />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="sales" className="form-label">
                                                <i className="bi bi-currency-dollar me-2"></i>Rate
                                            </label>
                                            <input type="text" className="form-control" id="sales" value={Rate} onChange={(e) => {
                                                setRate(e.target.value);
                                                calculateIncomeTax(e.target.value);
                                            }} required />
                                            {rateError && <div className="text-danger">{rateError}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="supplier" className="form-label">
                                                <i className="bi bi-people me-2"></i>Income Tax
                                            </label>
                                            <input type="text" className="form-control" id="supplier" value={Income_tax} onChange={(e) => setIncomeTax(e.target.value)} required readOnly/>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="salaries" className="form-label">
                                                <i className="bi bi-people-fill me-2"></i>Due Date
                                            </label>
                                            <input type="date" className="form-control" id="salaries" value={Due_date} onChange={(e) => setDue(e.target.value)} required />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="other" className="form-label">
                                                <i className="bi bi-journal me-2"></i>Date modified
                                            </label>
                                            <input type="date" className="form-control" id="other" value={currentDate} onChange={(e) => setModified(e.target.value)} required readOnly/>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="profit" className="form-label">
                                                <i className="bi bi-cash me-2"></i>Payment Status
                                            </label>
                                            <input type="text" className="form-control" id="profit" value={Status} onChange={(e) => setStatus(e.target.value)} required />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="desc" className="form-label">
                                                <i className="bi bi-chat-dots me-2"></i>Final Profit
                                            </label>
                                            <input type="text" className="form-control" id="desc" value={((parseFloat(totalProfit)).toFixed(2) - Income_tax).toFixed(2)} onChange={(e) => setFinal(e.target.value)} readOnly/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                            <button type="submit" className="btn btn-outline-primary me-5"><i className="ri-add-line"></i>  Add Tax Details</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <Toaster />
                </div>
            </div>
        </div>
        </Layout>
    );
}

export default AddTax;