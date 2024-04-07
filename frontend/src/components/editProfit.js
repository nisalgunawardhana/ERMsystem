import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

function EditProfit() {
    const { id } = useParams(); // Get the expense ID from the URL params
    const [isOpen, setIsOpen] = useState(false);
    const [totalEPF, setTotalEPF] = useState(0);
    const [totalETF, setTotalETF] = useState(0);
    const [total, setTotal] = useState(0);
    const [profit, setTotalProfit] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalOther, setTotalOther] = useState(0);
    const [totalSupp, setTotalSupp] = useState(0);
    const [totalSalary, setTotalSalary] = useState(0);
    const [Profit_ID, setID] = useState("");
    const [Month, setMonth] = useState("");
    const [Date_created, setDate] = useState("");
    const [Description, setDesc] = useState("");
    const navigate = useNavigate();

    const [Profit, setProfit] = useState({
        Profit_ID: '',
        Month: '',
        Sales_income: '',
        Supplier_expenses: '',
        Salaries: '',
        Other_expenses: '',
        EPF_ETF: '',
        Monthly_profit: '',
        Date_created: '',
        Description: ''
    });

    const currentMonthName = Profit.Month;

    useEffect(() => {
        const Total = Profit.EPF_ETF;
        setTotal(Total);
    }, [Profit.EPF_ETF]);
    
    useEffect(() => {
        const profits = totalAmount - (totalSupp + totalSalary + totalOther + total);
        setTotalProfit(profits);
    }, [totalAmount, totalSupp, totalSalary, totalOther, total]);    

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

    useEffect(() => {
        axios.get(`http://localhost:8080/profit/${currentMonthName}`)
            .then((res) => {
                setTotalAmount(res.data.totalAmount);
            })
            .catch((err) => {
                console.error(err);
            });
        axios.get(`http://localhost:8080/profit/other/${currentMonthName}`)
            .then((res) => {
                setTotalOther(res.data.totalOther);
            })
            .catch((err) => {
                console.error(err);
            });
        axios.get(`http://localhost:8080/profit/supplier/${currentMonthName}`)
            .then((res) => {
                setTotalSupp(res.data.totalSupp);
            })
            .catch((err) => {
                console.error(err);
            });
        axios.get(`http://localhost:8080/profit/salaries/${currentMonthName}`)
            .then((res) => {
                setTotalSalary(res.data.totalSalary);
            })
            .catch((err) => {
                console.error(err);
            });
    });

    const handleChanges = (e) => {
        const { name, value } = e.target;
        const newValue = name === 'Date' ? formatDate(value) : value;

        // If the name matches specific fields, format the value accordingly
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

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleShow = () => {
        setIsOpen(true);
    };

    // Function to handle EPF calculation
    const handleCalculateEPFETF = () => {
        axios.post(`http://localhost:8080/profit/epfetf/${currentMonthName}`)
            .then((res) => {
                setTotalEPF(res.data.totalEPF);
                setTotalETF(res.data.totalETF);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    // Function to handle form submission
    const Submit = async (e) => {
        e.preventDefault();
        try {
            setIsOpen(false);
            const response = await axios.get(`http://localhost:8080/profit/salaries/${currentMonthName}`);
            setTotalSalary(response.data.totalSalary);
            const newTotal = totalEPF + totalETF; // Calculate new total
        const newProfit = totalAmount - (totalSupp + totalSalary + totalOther + newTotal); // Calculate new profit

        // Update state only if values have changed
        if (newTotal !== total || newProfit !== profit) {
            setTotal(newTotal); // Update total state
            setTotalProfit(newProfit); // Update profit state
        }
        } catch (error) {
            console.error("Error adding expense:", error);
            alert("Error adding expense. Please try again later.");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newProfit = {
            Profit_ID: Profit.Profit_ID,
            Month: Profit.Month,
            Sales_income: totalAmount,
            Supplier_expenses: totalSupp,
            Salaries: totalSalary,
            EPF_ETF: total,
            Other_expenses: totalOther,
            Monthly_profit: profit,
            Date_created: Profit.Date_created,
            Description: Profit.Description
        };

        // Send updated data to the backend
        axios.put(`http://localhost:8080/profit/update/${Profit._id}`, newProfit)
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
                                    <input type="text" className="form-control" id="id" name="Profit_ID" value={Profit.Profit_ID} onChange={handleChanges} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="month" className="form-label">
                                        <i className="bi bi-calendar3 me-2"></i>Month
                                    </label>
                                    <input type="text" className="form-control" id="month" name="Month" value={Profit.Month} onChange={handleChanges} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="sales" className="form-label">
                                        <i className="bi bi-currency-dollar me-2"></i>Sales income
                                    </label>
                                    <input type="text" className="form-control" id="sales" name="Sales_income" value={totalAmount} onChange={handleChanges} readOnly />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="supplier" className="form-label">
                                        <i className="bi bi-people me-2"></i>Supplier Expenses
                                    </label>
                                    <input type="text" className="form-control" id="supplier" name="Supplier_expenses" value={totalSupp} onChange={handleChanges} readOnly />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="salaries" className="form-label">
                                        <i className="bi bi-people-fill me-2"></i>Employee salaries
                                    </label>
                                    <input type="text" className="form-control" id="salaries" name="Salaries" value={totalSalary} onChange={handleChanges} readOnly />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label htmlFor="other" className="form-label">
                                        <i className="bi bi-journal me-2"></i>Other Expenses
                                    </label>
                                    <input type="text" className="form-control" id="other" name="Other_expenses" value={totalOther} onChange={handleChanges} readOnly />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="epfetf" className="form-label">
                                        <i className="bi bi-calculator me-2"></i>Epf and Etf
                                    </label>
                                    <div className="row">
                                        <div className="col-md-9">
                                            <input type="text" className="form-control" id="epfetf" name="EPF_ETF" value={total} onChange={handleChanges} readOnly />
                                        </div>
                                        <div className="col-md-3">
                                            <button type="button" className="btn btn-primary" onClick={handleShow}>Add</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="profit" className="form-label">
                                        <i className="bi bi-cash me-2"></i>Monthly Profit
                                    </label>
                                    <input type="text" className="form-control" id="profit" name="Monthly_profit" value={profit.toFixed(2)} onChange={handleChanges} readOnly />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="date" className="form-label">
                                        <i className="bi bi-calendar2 me-2"></i>Date created
                                    </label>
                                    <input type="date" className="form-control" id="date" name="Date_created" value={Profit.Date_created ? new Date(Profit.Date_created).toISOString().split('T')[0] : ''} onChange={handleChanges} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="desc" className="form-label">
                                        <i className="bi bi-chat-dots me-2"></i>Description
                                    </label>
                                    <textarea className="form-control" id="desc" name="Description" value={Profit.Description} onChange={handleChanges} rows={5} />
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
            <div className="modal-backdrop" style={{ display: isOpen ? 'block' : 'none', backdropFilter: isOpen ? 'blur(5px)' : 'none' }}></div>
            <Modal show={isOpen} onHide={handleClose} style={{ marginTop: '60px' }}>
                <Modal.Header closeButton>
                    <Modal.Title>Add EPF and ETF</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={Submit}>
                        {/* Form fields */}
                        <div className="row">
                            <div>
                                <div className="mb-3 d-flex align-items-center">
                                    <label htmlFor="salary" className="form-label col-md-4">
                                        <i className="bi bi-cash me-2"></i>Total Salaries
                                    </label>
                                    <button type="button" onClick={handleCalculateEPFETF} className="btn btn-primary" style={{ marginLeft: '160px' }}>
                                        <i className="bi bi-check2-square me-2"></i> Add EPF_ETF
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div>
                                <div className="mb-3">
                                    <input type="text" className="form-control" id="salary" name="Date" value={totalSalary} />
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="epf" className="form-label">
                                <i className="bi bi-calculator me-2"></i>EPF Value
                            </label>
                            <input type="text" className="form-control" id="epf" value={totalEPF} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="etf" className="form-label">
                                <i className="bi bi-calculator me-2"></i>ETF Value
                            </label>
                            <input type="text" className="form-control" id="etf" value={totalETF} />
                        </div>
                        {/* Submit button */}
                        <button type="submit" className="btn btn-primary" style={{ marginLeft: '180px' }}>
                            <i className="bi bi-arrow-right-circle me-2"></i> Submit
                        </button>

                    </form>
                </Modal.Body>
            </Modal>
        </div>


    );
}
export default EditProfit;