import React, { useState } from "react"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from "axios";
import './OtherFormdesign.css';
import { useParams, useNavigate } from 'react-router-dom';

function AddOther() {

    const [Expense_id, setID] = useState("");
    const [Type, setType] = useState("");
    const [Date, setDate] = useState("");
    const [Status, setStatus] = useState("");
    const [Cost, setCost] = useState("");
    const navigate = useNavigate();

    function sendData(e) {
        e.preventDefault();
        const newOther = {
            Expense_id,
            Type,
            Date,
            Status,
            Cost
        }
        axios.post("http://localhost:8080/otherExpense/add", newOther).then(() => {
            alert("Other expense Added")
            setID("")
            setType("");
            setDate("");
            setStatus("");
            setCost("");
            navigate('/otherExpense');
        }).catch((err) => {
            alert(err)
        })
    }

    const handleBack = () => {
        navigate('/otherExpense'); // Reset specificExpense to null to display all expenses
    };

    return (
        <div class="container" style={{marginTop: '20px'}}>
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card border-light shadow-sm">
                <div class="card-body">
                    <h2 class="card-title text-center mb-4">Other Expenses</h2>
                    <form onSubmit={sendData}>
                        <div class="row gy-3 gy-md-4">
                            <div class="col-12">
                                <div class="input-group">
                                    <span class="input-group-text"><i class="bi bi-card-list"></i></span>
                                    <input type="text" class="form-control" name="id" id="id" placeholder="Expense ID" onChange={(e) => setID(e.target.value)} required />
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="input-group">
                                    <span class="input-group-text"><i class="bi bi-chat-left-text"></i></span>
                                    <input type="text" class="form-control" name="type" id="type" placeholder="Type of expense" onChange={(e) => setType(e.target.value)} required />
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="input-group">
                                    <span class="input-group-text"><i class="bi bi-calendar3"></i></span>
                                    <input type="date" class="form-control" name="date" id="date" onChange={(e) => setDate(e.target.value)} required />
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="input-group">
                                    <span class="input-group-text"><i class="bi bi-check-circle"></i></span>
                                    <input type="text" class="form-control" name="status" id="status" placeholder="Payment status" onChange={(e) => setStatus(e.target.value)} required />
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="input-group">
                                    <span class="input-group-text"><i class="bi bi-currency-dollar"></i></span>
                                    <input type="text" class="form-control" name="cost" id="cost" placeholder="Amount of expense" onChange={(e) => setCost(e.target.value)} required />
                                </div>
                            </div>
                            <div class="col-12" style={{marginLeft: '640px'}}>
                                <button class="btn btn-primary btn-lg btn-block" type="submit">Add Expense</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>


    );
}

export default AddOther;