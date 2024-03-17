import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ProfitDetails() {
    const { id } = useParams();
    const [profitDetails, setProfitDetails] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8080/profit/get/${id}`)
            .then((res) => {
                setProfitDetails(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    return (
        <div className="container">
            <h2>Profit Details</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Profit Log ID</th>
                        <th>Month</th>
                        <th>Sales Income</th>
                        <th>Supplier Expenses</th>
                        <th>Employee Salaries</th>
                        <th>Other Expenses</th>
                        <th>Monthly Profit</th>
                        <th>Date Created</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {profitDetails.map((detail) => (
                        <tr key={detail._id}>
                            <td>{detail.Profit_ID}</td>
                            <td>{detail.Month}</td>
                            <td>${detail.Sales_income}</td>
                            <td>${detail.Supplier_expenses}</td>
                            <td>${detail.Salaries}</td>
                            <td>${detail.Other_expenses}</td>
                            <td>${detail.Monthly_profit}</td>
                            <td>{new Date(detail.Date_created).toLocaleDateString()}</td>
                            <td>{detail.Description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProfitDetails;
