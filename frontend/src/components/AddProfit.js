import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';

function AddProfit() {
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalOther, setTotalOther] = useState(0);
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
    }, [month]);

    const sendData = (e) => {
        e.preventDefault();
        const monthlyProfit = totalAmount - totalOther;
        
        const newProfit = {
            Profit_ID,
            Month: month,
            Sales_income: totalAmount,
            Supplier_expenses,
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
                navigate(`/${Profit_ID}`);
            })
            .catch((err) => {
                alert(err);
            });
    };

    return (
        <div className="container">
            <form onSubmit={sendData}>
                <div className="mb-3">
                    <label htmlFor="id" className="form-label">Profit Log ID</label>
                    <input type="text" className="form-control" id="id" value={Profit_ID} onChange={(e) => setID(e.target.value)} />
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <label htmlFor="month" className="form-label">Month</label>
                        <input type="text" className="form-control" id="month" value={month} onChange={(e) => setMonth(e.target.value)} />
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="sales" className="form-label">Sales income</label>
                    <input type="text" className="form-control" id="sales" value={totalAmount} onChange={(e) => setIncome(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="supplier" className="form-label">Supplier Expenses</label>
                    <input type="text" className="form-control" id="supplier" value={Supplier_expenses} onChange={(e) => setSupplier(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="salaries" className="form-label">Employee salaries</label>
                    <input type="text" className="form-control" id="salaries" value={Salaries} onChange={(e) => setSalary(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="other" className="form-label">Other Expenses</label>
                    <input type="text" className="form-control" id="other" value={totalOther} onChange={(e) => setOther(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="profit" className="form-label">Monthly Profit</label>
                    <input type="text" className="form-control" id="profit" value={totalAmount + totalOther} onChange={(e) => setProfit(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="date" className="form-label">Date created</label>
                    <input type="date" className="form-control" id="date" value={Date_created} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="desc" className="form-label">Description</label>
                    <input type="text" className="form-control" id="desc" value={Description} onChange={(e) => setDesc(e.target.value)} />
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <div className="btn-group">
                            <button type="submit" className="btn btn-primary me-5 rounded">Submit</button>
                            <button className="btn btn-secondary rounded">Back</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default AddProfit;
