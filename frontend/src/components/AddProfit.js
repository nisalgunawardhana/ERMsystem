import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';

function AddProfit() {
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalOther, setTotalOther] = useState(0);
    const [totalSupp, setTotalSupp] = useState(0);
    const [Profit_ID, setID] = useState("");
    const [Month, setMonth] = useState("");
    const [Sales_income, setIncome] = useState(0);
    const [Supplier_expenses, setSupplier] = useState();
    const [Salaries, setSalary] = useState();
    const [Other_expenses, setOther] = useState(0);
    const [Monthly_profit, setProfit] = useState(0);
    const [Date_created, setDate] = useState("");
    const [Description, setDesc] = useState("");
    const navigate = useNavigate();
    const { month } = useParams();

    useEffect(() => {
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
    }, [month]);

    const sendData = (e) => {
        e.preventDefault();
        const monthlyProfit = totalAmount - (totalOther + totalSupp);

        const newProfit = {
            Profit_ID,
            Month: month,
            Sales_income: totalAmount,
            Supplier_expenses: totalSupp,
            Salaries,
            Other_expenses: totalOther,
            Monthly_profit: monthlyProfit,
            Date_created,
            Description
        };

        axios.post("http://localhost:8080/profit/add", newProfit)
            .then(() => {
                alert("Profit details Added");
                setID("");
                setMonth("");
                setIncome(0);
                setSupplier(0);
                setSalary(0);
                setOther(0);
                setDate("");
                setDesc("");
                navigate(`/profit/get/${Profit_ID}`);
            })
            .catch((err) => {
                alert(err);
            });
    };

    return (
        <form onSubmit={sendData}>
    <div className="card border-light shadow-sm" style={{marginLeft: '300px', marginTop: '10px', width: '1000px'}}>
        <div className="card-body">
        <h2 class="card-title text-center mb-5">Profit Details</h2>
            <div className="row">
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="id" className="form-label">
                            <i className="bi bi-card-list me-2"></i>Profit Log ID
                        </label>
                        <input type="text" className="form-control" id="id" value={Profit_ID} onChange={(e) => setID(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="month" className="form-label">
                            <i className="bi bi-calendar3 me-2"></i>Month
                        </label>
                        <input type="text" className="form-control" id="month" value={month} onChange={(e) => setMonth(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="sales" className="form-label">
                            <i className="bi bi-currency-dollar me-2"></i>Sales income
                        </label>
                        <input type="text" className="form-control" id="sales" value={totalAmount} onChange={(e) => setIncome(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="supplier" className="form-label">
                            <i className="bi bi-people me-2"></i>Supplier Expenses
                        </label>
                        <input type="text" className="form-control" id="supplier" value={totalSupp} onChange={(e) => setSupplier(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="salaries" className="form-label">
                            <i className="bi bi-people-fill me-2"></i>Employee salaries
                        </label>
                        <input type="text" className="form-control" id="salaries" value={Salaries} onChange={(e) => setSalary(e.target.value)} />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="other" className="form-label">
                            <i className="bi bi-journal me-2"></i>Other Expenses
                        </label>
                        <input type="text" className="form-control" id="other" value={totalOther} onChange={(e) => setOther(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="profit" className="form-label">
                            <i className="bi bi-cash me-2"></i>Monthly Profit
                        </label>
                        <input type="text" className="form-control" id="profit" value={totalAmount - (totalOther + totalSupp)} onChange={(e) => setProfit(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="date" className="form-label">
                            <i className="bi bi-calendar2 me-2"></i>Date created
                        </label>
                        <input type="date" className="form-control" id="date" value={Date_created} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="desc" className="form-label">
                            <i className="bi bi-chat-dots me-2"></i>Description
                        </label>
                        <textarea className="form-control" id="desc" value={Description} onChange={(e) => setDesc(e.target.value)} rows={5}/>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="btn-group" style={{marginLeft: '700px'}}>
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

export default AddProfit;
