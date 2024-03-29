import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';

function AddTax({ EPF, ETF }) {
    const [totalProfit, setTotalProfit] = useState(0);
    const [totalSalary, setTotalSalary] = useState(0);
    const [Tax_ID, setID] = useState("");
    const [Taxable_income, setProfit] = useState("");
    const [Rate, setRate] = useState();
    const [Income_tax, setIncomeTax] = useState();
    const [Due_date, setDue] = useState();
    const [Date_created, setCreated] = useState();
    const [Status, setStatus] = useState();
    const [Total_tax, setTotal] = useState("");
    const navigate = useNavigate();
    const { epfetf } = useParams();

    const getCurrentYear = () => {
        const currentDate = new Date();
        return currentDate.getFullYear();
    };

    const [EPF_ETF, setEpf] = useState(epfetf);

    useEffect(() => {
        let currentYear = getCurrentYear();
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

    const calculateIncomeTax = (rate) => {
        // Calculate income tax
        const incomeTax = (totalProfit * rate) / 100;
        setIncomeTax(incomeTax.toFixed(2)); // Set the income tax with two decimal places
    };

    const sendData = (e) => {
        e.preventDefault();

        const totTax = (parseFloat(EPF_ETF) + parseFloat(totalProfit)).toFixed(2);

        const newTax = {
            Tax_ID,
            Taxable_income: totalProfit,
            Rate,
            Income_tax,
            Due_date,
            Date_created,
            Status,
            EPF_ETF: EPF_ETF,
            Total_tax: totTax
        };

        axios.post("http://localhost:8080/tax/add", newTax)
            .then(() => {
                alert("Tax details Added");
                setID("");
                setProfit("");
                setRate(0);
                setIncomeTax(0);
                setDue(0);
                setCreated(0);
                setStatus("");
                setEpf("");
                setTotal("");
                navigate(`/tax/get/${Tax_ID}`);
            })
            .catch((err) => {
                alert(err);
            });
    };

    return (
        <form onSubmit={sendData}>
            <div className="card border-light shadow-sm" style={{ marginLeft: '300px', marginTop: '10px', width: '1000px' }}>
                <div className="card-body">
                    <h2 class="card-title text-center mb-5">Tax Details</h2>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="id" className="form-label">
                                    <i className="bi bi-card-list me-2"></i>Tax Doc ID
                                </label>
                                <input type="text" className="form-control" id="id" value={Tax_ID} onChange={(e) => setID(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="month" className="form-label">
                                    <i className="bi bi-calendar3 me-2"></i>Taxable Income
                                </label>
                                <input type="text" className="form-control" id="month" value={totalProfit} onChange={(e) => setProfit(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="sales" className="form-label">
                                    <i className="bi bi-currency-dollar me-2"></i>Rate
                                </label>
                                <input type="text" className="form-control" id="sales" value={Rate} onChange={(e) => {
                                    setRate(e.target.value);
                                    calculateIncomeTax(e.target.value);
                                }} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="supplier" className="form-label">
                                    <i className="bi bi-people me-2"></i>Income Tax
                                </label>
                                <input type="text" className="form-control" id="supplier" value={Income_tax} onChange={(e) => setIncomeTax(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="salaries" className="form-label">
                                    <i className="bi bi-people-fill me-2"></i>Due Date
                                </label>
                                <input type="date" className="form-control" id="salaries" value={Due_date} onChange={(e) => setDue(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="other" className="form-label">
                                    <i className="bi bi-journal me-2"></i>Date Created
                                </label>
                                <input type="date" className="form-control" id="other" value={Date_created} onChange={(e) => setCreated(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="profit" className="form-label">
                                    <i className="bi bi-cash me-2"></i>Payment Status
                                </label>
                                <input type="text" className="form-control" id="profit" value={Status} onChange={(e) => setStatus(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="date" className="form-label">
                                    <i className="bi bi-calendar2 me-2"></i>EPF/ETF
                                </label>
                                <input type="text" className="form-control" id="date" value={parseFloat(EPF_ETF).toFixed(2)} onChange={(e) => setEpf(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="desc" className="form-label">
                                    <i className="bi bi-chat-dots me-2"></i>Total Tax
                                </label>
                                <input type="text" className="form-control" id="desc" value={(parseFloat(EPF_ETF) + parseFloat(totalProfit)).toFixed(2)} onChange={(e) => setTotal(e.target.value)} rows={5} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="btn-group" style={{ marginLeft: '700px' }}>
                                <button type="submit" className="btn btn-primary me-5 rounded">Submit</button>
                                <button className="btn btn-secondary rounded">Back</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>

    );
}

export default AddTax;