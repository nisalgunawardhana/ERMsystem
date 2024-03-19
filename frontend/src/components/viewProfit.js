import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ProfitDetails() {
    const { id } = useParams();
    const { month } = useParams();
    const [profit, setProfit] = useState(null);
    const [searchMonth, setSearchMonth] = useState('');
    const [searchResult, setSearchResult] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/profit/get/${id}`)
            .then((res) => {
                setProfit(res.data.profit);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [id]);

    useEffect(() => {
        axios.get(`http://localhost:8080/profit/search/${month}`)
            .then((res) => {
                setProfit(res.data.profit);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [month]);

    const handleSearch = () => {
        axios.get(`http://localhost:8080/profit/search/${searchMonth}`)
            .then((res) => {
                setSearchResult(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <div style={{ marginTop: '-40px'}}>
            {/* Side Navigation Bar */}
            <nav className="col-md-2 d-none d-md-block bg-dark sidebar position-fixed" style={{ height: '100vh', overflowY: 'auto', marginTop: '-80px' }}>
                <div className="sidebar-sticky">
                    <ul className="nav flex-column" style={{ marginTop: '80px' }}>
                        <li className="nav-item">
                            <a className="nav-link active text-light" href="#"><i className="bi bi-house-fill"></i>&nbsp; Dashboard</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-light" href="#"><i className="bi bi-cash"></i>&nbsp; Profit Log</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-light" href="/otherExpense"><i className="bi bi-wallet"></i>&nbsp; Other Expenses</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-light" href="#"><i className="bi bi-file-earmark"></i>&nbsp; Tax Document</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-light" href="#"><i className="bi bi-box-arrow-right"></i>&nbsp; Logout</a>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container-fluid" style={{ marginLeft: '280px', marginTop: '40px', width: '1220px' }}>
            <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Month"
                        aria-label="Search by Month"
                        aria-describedby="search-button"
                        value={searchMonth}
                        onChange={(e) => setSearchMonth(e.target.value)}
                    />
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        id="search-button"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>

                <h2 className="mb-4"><i className="fas fa-chart-line"></i> Profit Details {(searchResult || profit) && `- ${searchResult ? searchResult[0].Month : profit.Month}`}</h2>
                <p className="text-muted">Explore the detailed breakdown of your profits, including sales income, expenses,<br></br> and monthly profit, to gain insights into your financial performance.</p>

                {/* Display profit details for searched month */}
                {(searchResult || profit) && (
                    <div className="row">
                        {/* Left Column for Profit Details */}
                        <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <th scope="row"><i className="bi bi-list-ul"></i>&nbsp;&nbsp; Profit Log ID:</th>
                                            <td>{searchResult ? searchResult[0].Profit_ID : profit.Profit_ID}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row"><i className="bi bi-calendar"></i>&nbsp;&nbsp; Month:</th>
                                            <td>{searchResult ? searchResult[0].Month : profit.Month}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row"><i className="bi bi-cash"></i>&nbsp;&nbsp; Sales Income:</th>
                                            <td>Rs.{searchResult ? searchResult[0].Sales_income : profit.Sales_income}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row"><i className="bi bi-shop"></i>&nbsp;&nbsp; Supplier Expenses:</th>
                                            <td>Rs.{searchResult ? searchResult[0].Supplier_expenses : profit.Supplier_expenses}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row"><i className="bi bi-person"></i>&nbsp;&nbsp; Employee Salaries:</th>
                                            <td>Rs.{searchResult ? searchResult[0].Salaries : profit.Salaries}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row"><i className="bi bi-wallet"></i>&nbsp;&nbsp; Other Expenses:</th>
                                            <td>Rs.{searchResult ? searchResult[0].Other_expenses : profit.Other_expenses}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row"><i className="bi bi-graph-up"></i>&nbsp;&nbsp; Monthly Profit:</th>
                                            <td>Rs.{searchResult ? searchResult[0].Monthly_profit : profit.Monthly_profit}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row"><i className="bi bi-calendar"></i>&nbsp;&nbsp; Date Created:</th>
                                            <td>{searchResult ? new Date(searchResult[0].Date_created).toLocaleDateString() : new Date(profit.Date_created).toLocaleDateString()}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row"><i className="bi bi-chat-left"></i>&nbsp;&nbsp; Description:</th>
                                            <td>{searchResult ? searchResult[0].Description : profit.Description}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right Column for Cards */}
                    <div className="col-md-6" style={{ marginTop: '-55px', marginLeft: '0px' }}>
                        <div className="row mb-4">
                            <div className="col-md-6" style={{ height: '140px' }}>
                                <div className="card h-100">
                                    <div className="card-body">
                                        <i className="bi bi-cash h1 text-primary"></i>
                                        <h5 className="card-title">Monthly Profit</h5>
                                        <p className="card-text">Rs.{searchResult ? searchResult[0].Monthly_profit : profit.Monthly_profit}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <i className="bi bi-cash h1 text-success"></i>
                                        <h5 className="card-title">Average Monthly Profit</h5>
                                        <p className="card-text"></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6" style={{ height: '140px' }}>
                                <div className="card h-100">
                                    <div className="card-body">
                                        <i className="bi bi-cash h1 text-warning"></i>
                                        <h5 className="card-title">Monthly Sales</h5>
                                        <p className="card-text">Rs.{searchResult ? searchResult[0].Sales_income : profit.Sales_income}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <i className="bi bi-cash h1 text-danger"></i>
                                        <h5 className="card-title">Monthly Expenses</h5>
                                        <p className="card-text">Rs.{searchResult ? searchResult[0].Supplier_expenses + searchResult[0].Salaries + searchResult[0].Other_expenses : profit.Supplier_expenses + profit.Salaries + profit.Other_expenses}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 mt-4">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Generate Monthly Profit Report</h5>
                                        <p className="card-text">Click the button below to generate a report for the monthly profit.</p>
                                        <button className="btn btn-primary"> Generate Report</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                    
                )}

            </div>
        </div>
    );
}

export default ProfitDetails;





