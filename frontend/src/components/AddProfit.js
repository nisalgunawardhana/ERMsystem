import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import Layout from './Layout';

function AddProfit() {
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalOther, setTotalOther] = useState(0);
    const [totalSupp, setTotalSupp] = useState(0);
    const [totalSalary, setTotalSalary] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [totalEPF, setTotalEPF] = useState(0);
    const [totalETF, setTotalETF] = useState(0);
    const [Profit_ID, setID] = useState("");
    const [Month, setMonth] = useState("");
    const [Sales_income, setIncome] = useState(0);
    const [Supplier_expenses, setSupplier] = useState();
    const [Salaries, setSalary] = useState();
    const [Other_expenses, setOther] = useState(0);
    const [EPF_ETF, setEpfEtf] = useState(0);
    const [Monthly_profit, setProfit] = useState(0);
    const [Date_modified, setDate] = useState("");
    const [Description, setDesc] = useState("");
    const [Rate, setRate] = useState("");
    const navigate = useNavigate();
    const { month } = useParams();

    useEffect(() => {
        fetchLatestId();
        axios.get(`http://localhost:8080/profit/${month}`)
            .then((res) => {
                setTotalAmount(res.data.totalAmount);
            })
            .catch((err) => {
                console.error(err);
            });
        axios.get(`http://localhost:8080/profit/other/${month}`)
            .then((res) => {
                setTotalOther(res.data.totalOther);
            })
            .catch((err) => {
                console.error(err);
            });
        axios.get(`http://localhost:8080/profit/supplier/${month}`)
            .then((res) => {
                setTotalSupp(res.data.totalSupp);
            })
            .catch((err) => {
                console.error(err);
            });
        axios.get(`http://localhost:8080/profit/salaries/${month}`)
            .then((res) => {
                setTotalSalary(res.data.totalSalary);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [month]);

    useEffect(() => {
        axios.get(`http://localhost:8080/profit/fetch/taxRate`)
            .then((res) => {
                setRate(res.data.taxRate);
            })
            .catch((err) => {
                console.error(err);
            });
    });

    const fetchLatestId = async () => {
        try {
            const response = await axios.get("http://localhost:8080/profit/getId/latest");
            setID(response.data.nextId);
        } catch (error) {
            console.error("Error fetching latest Profit ID:", error);
            alert("Error fetching latest Profit ID. Please try again later.");
        }
    };

    const sendData = async (e) => {
        e.preventDefault();
        const monthlyProfit = totalAmount - (totalOther + totalSupp + totalSalary);
        const total = totalEPF + totalETF;

        const newProfit = {
            Profit_ID,
            Month: month,
            Sales_income: totalAmount,
            Supplier_expenses: totalSupp,
            Salaries: totalSalary,
            EPF_ETF: total,
            Other_expenses: totalOther,
            Monthly_profit: monthlyProfit,
            Date_modified,
            Description
        };

        try {
            // Check if the profit log already exists
            const checkRes = await axios.post("http://localhost:8080/profit/add/check", newProfit);

            // If the profit log exists, display an alert and return without submitting the form
            if (checkRes.data.exists) {
                alert(checkRes.data.message);
                return;
            }

            // If the profit log doesn't exist, add it
            const res = await axios.post("http://localhost:8080/profit/add", newProfit);
            if (res.status === 200) {
                setTimeout(() => {
                    // Display success toast message
                    toast.success('Profit log added successfully!');
                }, 2000);
                setID("");
                setMonth("");
                setIncome(0);
                setSupplier(0);
                setSalary(0);
                setEpfEtf(0);
                setOther(0);
                setDate("");
                setDesc("");
                navigate(`/dashboard/finance/profit`);
            }
        } catch (error) {
            console.error("Error:", error);
            // Handle other errors, such as network errors or server errors
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
        axios.post(`http://localhost:8080/profit/epfetf/${month}`)
            .then((res) => {
                setTotalEPF(res.data.totalEPF);
                setTotalETF(res.data.totalETF);
                setTimeout(() => {
                    // Display success toast message
                    toast.success('EPF/ETF added successfully!');
                }, 2000);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsOpen(false);
            const response = await axios.get(`http://localhost:8080/profit/salaries/${month}`);
            setTotalSalary(response.data.totalSalary);
        } catch (error) {
            console.error("Error adding expense:", error);
            alert("Error adding expense. Please try again later.");
        }
    };

    useEffect(() => {
        const getCurrentDate = () => {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            setDate(formattedDate);
        };

        getCurrentDate();
    }, []); // Run only once after the component mount

    return (
        <Layout>
        <div className="container" style={{ marginTop: '10px' }}>
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <form onSubmit={sendData}>
                        <div className="card">
                            <div className="card-body">
                                <h2 class="card-title text-center mb-5">Profit Details</h2>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="id" className="form-label">
                                                <i className="bi bi-card-list me-2"></i>Profit Log ID
                                            </label>
                                            <input type="text" className="form-control" id="id" value={Profit_ID} onChange={(e) => setID(e.target.value)} readOnly/>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="month" className="form-label">
                                                <i className="bi bi-calendar3 me-2"></i>Month
                                            </label>
                                            <input type="text" className="form-control" id="month" value={month} onChange={(e) => setMonth(e.target.value)} readOnly/>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="sales" className="form-label">
                                                <i className="bi bi-currency-dollar me-2"></i>Sales income
                                            </label>
                                            <input type="text" className="form-control" id="sales" value={totalAmount.toFixed(2)} onChange={(e) => setIncome(e.target.value)} readOnly/>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="supplier" className="form-label">
                                                <i className="bi bi-people me-2"></i>Supplier Expenses
                                            </label>
                                            <input type="text" className="form-control" id="supplier" value={totalSupp.toFixed(2)} onChange={(e) => setSupplier(e.target.value)} readOnly/>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="salaries" className="form-label">
                                                <i className="bi bi-people-fill me-2"></i>Employee salaries
                                            </label>
                                            <input type="text" className="form-control" id="salaries" value={totalSalary.toFixed(2)} onChange={(e) => setSalary(e.target.value)} readOnly/>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="other" className="form-label">
                                                <i className="bi bi-journal me-2"></i>Other Expenses
                                            </label>
                                            <input type="text" className="form-control" id="other" value={totalOther.toFixed(2)} onChange={(e) => setOther(e.target.value)} readOnly/>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="epfetf" className="form-label">
                                                <i className="bi bi-calculator me-2"></i>Epf and Etf
                                            </label>
                                            <div className="row">
                                                <div className="col-md-9">
                                                    <input type="text" className="form-control" id="other" value={(totalEPF + totalETF).toFixed(2)} onChange={(e) => setOther(e.target.value)} readOnly/>
                                                </div>
                                                <div className="col-md-3">
                                                    <button type="button" className="btn btn-primary" onClick={handleShow}><i className="ri-add-line"></i>Add</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="profit" className="form-label">
                                                <i className="bi bi-cash me-2"></i>Monthly Profit [Income tax rate: {Rate}%]
                                            </label>
                                            <input type="text" className="form-control" id="profit" value={((totalAmount - (totalOther + totalSupp + totalSalary)) - ((totalAmount - (totalOther + totalSupp + totalSalary)) * Rate / 100.0)).toFixed(2)} onChange={(e) => setProfit(e.target.value)} readOnly/>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="date" className="form-label">
                                                <i className="bi bi-calendar2 me-2"></i>Date modified
                                            </label>
                                            <input type="date" className="form-control" id="date" value={Date_modified} onChange={(e) => setDate(e.target.value)} readOnly/>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="desc" className="form-label">
                                                <i className="bi bi-chat-dots me-2"></i>Description
                                            </label>
                                            <textarea className="form-control" id="desc" value={Description} onChange={(e) => setDesc(e.target.value)} rows={5} required/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                            <button type="submit" className="btn btn-primary me-5 rounded">Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <Toaster />
                    <div className="modal-backdrop" style={{ display: isOpen ? 'block' : 'none', backdropFilter: isOpen ? 'blur(5px)' : 'none' }}></div>
                    <Modal show={isOpen} onHide={handleClose} style={{ marginTop: '60px' }}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add EPF and ETF</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={handleSubmit}>
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
                                            <input type="text" className="form-control" id="salary" name="Date" value={totalSalary.toFixed(2)} readOnly/>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="epf" className="form-label">
                                        <i className="bi bi-calculator me-2"></i>EPF Value
                                    </label>
                                    <input type="text" className="form-control" id="epf" value={totalEPF.toFixed(2)} readOnly/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="etf" className="form-label">
                                        <i className="bi bi-calculator me-2"></i>ETF Value
                                    </label>
                                    <input type="text" className="form-control" id="etf" value={totalETF.toFixed(2)} readOnly/>
                                </div>
                                {/* Submit button */}
                                <button type="submit" className="btn btn-primary" style={{ marginLeft: '160px' }}>
                                    <i className="bi bi-arrow-right-circle me-2"></i> Submit
                                </button>

                            </form>
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        </div>
        </Layout>
    );
}

export default AddProfit;
