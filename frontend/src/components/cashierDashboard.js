import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Layout from './Layout';

const CashierDashboard = () => {
    // State variables to hold data
    const [salesData, setSalesData] = useState([]);
    const [totalSales, setTotalSales] = useState(0);
    const [error, setError] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalCus, setTotalCus] = useState(0);
    const [currentDateTime, setCurrentDateTime] = useState('');



    useEffect(() => {

        // Fetch total amount
        axios.get("http://localhost:8080/profit/get/bills/total")
            .then((res) => {
                setTotalAmount(res.data.totalAmount);
            })
            .catch((err) => {
                setError(err.message);
            });
    }, []);

    useEffect(() => {

        // Fetch total amount
        axios.get("http://localhost:8080/customer/count")
            .then((res) => {
                setTotalCus(res.data.totalCustomers);
            })
            .catch((err) => {
                setError(err.message);
            });

             const intervalId = setInterval(() => {
            const now = new Date();
            setCurrentDateTime(now.toLocaleString());
        }, 1000);

        // Cleanup interval
        return () => clearInterval(intervalId);
    }, []);
    



    return (
        <Layout>
            <div className="container">
                {/* Breadcrumb navigation */}
                
                <div className="row">
        {/* Breadcrumb navigation */}
        <nav className="col-md-6" aria-label="breadcrumb">
            <ol className="breadcrumb">
                <li className="breadcrumb-item active" aria-current="page">Cashier Dashboard</li>
            </ol>
        </nav>
        {/* Current Date and Time */}
        <div className="col-md-6 text-md-end mb-3">
                        <div className="date-time">
                            <span className="date">{currentDateTime.split(',')[0]}</span>
                            <span className="time"> | {currentDateTime.split(',')[1]}</span>
                        </div>
                    </div>
    </div>
                {/* Page title */}
                <h2 className="text-left mb-4">Cashier Dashboard</h2>
                {/* Total sales card */}
                <div class="row">
                    <div class="col-lg-6 col-md-6 mb-3">
                        <div class="card l-bg-cherry">
                            <div class="card-statistic-3 p-4">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="col-8">
                                        <h2 class="d-flex align-items-center mb-5">
                                            Rs.{totalAmount.toFixed(2)}
                                        </h2>
                                        <h5 class="card-title" style={{ marginTop: '25px', marginBottom: '18px' }}>Total sales</h5>
                                    </div>
                                    <i className="bi bi-cash-coin h1"></i>
                                </div>
                                <div class="progress mt-1 " data-height="8" style={{ height: '8px' }}>
                                    <div class="progress-bar l-bg-cyan" role="progressbar" data-width="25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{ width: '25%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 mb-3">
                        <div class="card l-bg-green-dark">
                            <div class="card-statistic-3 p-4">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="col-8">
                                        <h1 class="d-flex align-items-center mb-5">
                                            {totalCus}
                                        </h1>
                                        <h5 class="card-title" style={{ marginTop: '25px' }}>Total Customers</h5>
                                    </div>
                                   <i class="bi bi-person fs-1 mb-3"></i>

                                </div>
                                <div class="progress mt-1 " data-height="8" style={{ height: '8px' }}>
                                    <div class="progress-bar l-bg-orange" role="progressbar" data-width="25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{ width: '25%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <h2 className="text-left mb-4">Instant Links</h2>

                <div class="container">
                    <div class="row row-cols-1 row-cols-md-4 g-4">
                        <div class="col">
                        <a href="/dashboard/cashier/bill/CreateBill" className="card-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div class="card h-100 text-center">
                                <div class="card-body">
                                    <i class="bi bi-file-earmark-plus fs-1 mb-3"></i>
                                    <h5 class="card-title fs-5 mb-3">Create Bill</h5>
                                    <p class="card-text fs-6">Create Bill here</p>
                                </div>
                            </div>
                            </a>
                        </div>
                        <div class="col">
                        <a href="/dashboard/cashier/customer" className="card-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div class="card h-100 text-center">
                                <div class="card-body">
                                    <i class="bi bi-person-plus fs-1 mb-3"></i>
                                    <h5 class="card-title fs-5 mb-3">Manage Customer</h5>
                                    <p class="card-text fs-6">Manage Customer here!</p>
                                </div>
                            </div>
                            </a>
                        </div>
                        <div class="col">
                        <a href="/dashboard/cashier/discounts" className="card-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div class="card h-100 text-center">
                                <div class="card-body">
                                    <i class="bi bi-cash-coin fs-1 mb-3"></i>
                                    <h5 class="card-title fs-5 mb-3">Manage Discount Rule</h5>
                                    <p class="card-text fs-6">Manage discount rule here!</p>
                                </div>
                            </div>
                            </a>
                        </div>
                        <div class="col">
                        <a href="/dashboard/cashier/billing" className="card-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div class="card h-100 text-center">
                                <div class="card-body">
                                    <i class="bi bi-moon fs-1 mb-3"></i>
                                    <h5 class="card-title fs-5 mb-3">Manage Bills</h5>
                                    <p class="card-text fs-6">Manage Bills Here!</p>
                                </div>
                            </div>
                            </a>
                        </div>
                    </div>
                </div>




            </div>
        </Layout>
    );
};

export default CashierDashboard;
