/* global Chart */
import './finance.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FinanceDash = () => {

    const [otherExpenses, setOtherExpenses] = useState([]);
    const [profit, setProfit] = useState([]);
    const monthlyProfit = useState(0);
    const [profitLastYear, setProfitLastYear] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/otherExpense/');
                setOtherExpenses(response.data);
            } catch (error) {
                console.error('Error fetching other expenses data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/profit/year');
                setProfit(response.data);
            } catch (error) {
                console.error('Error fetching profit data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/profit/lastyear');
                setProfitLastYear(response.data);
            } catch (error) {
                console.error('Error fetching profit data:', error);
            }
        };

        fetchData();
    }, []);

    const calculateTotalProfitLastYear = () => {
        let totalProfit = 0;
        profitLastYear.forEach((item) => {
            totalProfit += parseFloat(item.Monthly_profit);
        });
        return totalProfit;
    };

    const TotalLastYear = calculateTotalProfitLastYear();

    const TotalProfit = profit.reduce((acc, curr) => acc + parseFloat(curr.Monthly_profit), 0);
    const TotalSales = profit.reduce((acc, curr) => acc + parseFloat(curr.Sales_income), 0);
    const TotalExpenses = profit.reduce((acc, curr) => acc + parseFloat(curr.Other_expenses + curr.Supplier_expenses + curr.Salaries), 0);

    useEffect(() => {
        let barChart = null;
        let lineChart = null;

        // Function to create or update the line chart
        const createOrUpdateLineChart = () => {
            // If a previous Chart instance exists, destroy it
            if (lineChart) {
                lineChart.destroy();
            }

            // Extracting data for the chart
            const salesLabels = profit.map(profit => profit.Month);
            const salesData = profit.map(profit => parseFloat(profit.Sales_income));
            const expenseData = profit.map(profit => parseFloat(profit.Other_expenses + profit.Supplier_expenses + profit.Salaries));

            // Create the line chart
            lineChart = new Chart(document.getElementById('canvas-1'), {
                type: 'line',
                data: {
                    labels: salesLabels,
                    datasets: [
                        {
                            label: 'Sales',
                            data: salesData,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderWidth: 1
                        },
                        {
                            label: 'Expenses',
                            data: expenseData,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        };
        const createOrUpdateBarChart = () => {
            // If a previous Chart instance exists, destroy it
            if (barChart) {
                barChart.destroy();
            }

            // Extracting data for the chart
            const labels = profit.map(profit => profit.Month);
            const data = profit.map(profit => parseFloat(profit.Monthly_profit));

            // Create the bar chart
            barChart = new Chart(document.getElementById('canvas-2'), {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Monthly Profit',
                            data: data,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        };

        createOrUpdateLineChart();
        createOrUpdateBarChart();

        // Cleanup function to destroy the charts when the component unmounts
        return () => {
            if (lineChart) {
                lineChart.destroy();
            }
            if (barChart) {
                barChart.destroy();
            }
        };
    }, [otherExpenses, monthlyProfit]);

    const [month, setMonth] = useState({ Month: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMonth(prevState => ({ ...prevState, [name]: value }));
    };

    const submit = (e) => {
        e.preventDefault();
        // Redirect to the page where total amount is fetched for the entered month
        window.location.href = `/profit/${month.Month}`;
    };

    const getCurrentMonth = () => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const currentDate = new Date();
        const monthIndex = currentDate.getMonth();
        return months[monthIndex];
    };

    const getPreviousMonth = () => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const currentDate = new Date();
        const monthIndex = (currentDate.getMonth() - 1 + 12) % 12; // Handling December as previous month
        return months[monthIndex];
    };

    const getCurrentYear = () => {
        const currentDate = new Date();
        return currentDate.getFullYear();
    };

    const getPreviousYear = () => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const previousYear = currentYear - 1;
        return previousYear;
    };

    const getCurrentMonthProfitId = async () => {
        try {
            let currentMonth = getCurrentMonth();
            let currentYear = getCurrentYear();
            let response = await axios.get(`http://localhost:8080/profit/search/${currentMonth}`);
            let profit = response.data;

            if (profit.length > 0) {
                // Filter profit records based on date_created column
                const currentYearProfit = profit.find(item => {
                    const dateCreated = new Date(item.Date_modified);
                    return dateCreated.getFullYear() === currentYear;
                });

                if (currentYearProfit) {
                    // Assuming the first profit record for the current month and year is the relevant one
                    return currentYearProfit.Profit_ID;
                }
            }

            // If there's no profit record for the current month of the current year,
            // try fetching the previous month's profit of the current year
            let previousMonth = getPreviousMonth();
            response = await axios.get(`http://localhost:8080/profit/search/${previousMonth}`);
            profit = response.data;

            if (profit.length > 0) {
                // Filter profit records based on date_created column
                const currentYearProfit = profit.find(item => {
                    const dateCreated = new Date(item.Date_modified);
                    return dateCreated.getFullYear() === currentYear;
                });

                if (currentYearProfit) {
                    // Assuming the first profit record for the previous month of the current year is the relevant one
                    return currentYearProfit.Profit_ID;
                }
            }

            // If there's no profit record for the previous month as well, or if it's not related to the current year, return null
            window.location.href = `/profit/get/PL#`;
            return null;
        } catch (error) {
            console.error('Error fetching profit details:', error);
            return null;
        }
    };

    const handleClick = async () => {
        const profitId = await getCurrentMonthProfitId();
        if (profitId) {
            window.location.href = `/profit/get/${profitId}`;
        } else {
            console.log('No profit record found for the current and previous months of the current year.');
            // Handle the case where there's no profit record for the current and previous months of the current year
        }
    };

    const getCurrentTaxId = async () => {
        try {
            let currentYear = getCurrentYear();
            let response = await axios.get(`http://localhost:8080/tax/search/${currentYear}`);
            let tax = response.data;

            if (tax.length > 0) {
                // Filter tax records based on date_created column
                const currentYearTax = tax.find(item => {
                    const dateCreated = new Date(item.Date_modified);
                    return dateCreated.getFullYear() === currentYear;
                });

                if (currentYearTax) {
                    // Assuming the first tax record for the current year is the relevant one
                    return currentYearTax.Tax_ID;
                }
            }

            // If there's no tax record for the current year, try fetching the tax details for the previous year
            let previousYear = getPreviousYear();
            response = await axios.get(`http://localhost:8080/tax/search/${previousYear}`);
            tax = response.data;

            if (tax.length > 0) {
                // Filter tax records based on date_created column
                const previousYearTax = tax.find(item => {
                    const dateCreated = new Date(item.Date_modified);
                    return dateCreated.getFullYear() === previousYear;
                });

                if (previousYearTax) {
                    // Assuming the first tax record for the previous year is the relevant one
                    return previousYearTax.Tax_ID;
                }
            }

            // If there's no tax record for the previous year as well, or if it's not related to the current year, return null
            window.location.href = `/tax/get/T#`;
            return null;
        } catch (error) {
            console.error('Error fetching tax details:', error);
            return null;
        }
    };

    const handleClickTax = async () => {
        const taxId = await getCurrentTaxId();
        if (taxId) {
            window.location.href = `/tax/get/${taxId}`;
        } else {
            console.log('No profit record found for the current and previous months of the current year.');
            // Handle the case where there's no profit record for the current and previous months of the current year
        }
    };

    const fixedCardColor = `linear-gradient(to right, rgba(0, 123, 255, 0.8), rgba(255, 0, 123, 0.8))`;

    return (
        <div className="container align-items-center">
            <ul class="nav nav-tabs mb-3" id="myTab0" role="tablist">
                <li class="nav-item" role="presentation">
                    <button
                        data-mdb-tab-init
                        class="nav-link active"
                        id="home-tab0"
                        type="button"
                        role="tab"
                        aria-controls="home"
                        aria-selected="true"
                        style={{ borderBottom: '2px solid #007bff', borderTop: 'none' }}
                    >
                        <i className="bi bi-pie-chart me-2"></i> Dashboard
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button
                        data-mdb-tab-init
                        class="nav-link"
                        id="profile-tab0"
                        type="button"
                        role="tab"
                        aria-controls="profile"
                        aria-selected="false"
                        onClick={handleClick}
                    >
                        Profit Log
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <Link
                        className="nav-link"
                        id="contact-tab0"
                        to="/otherExpense"
                        role="tab"
                        aria-controls="contact"
                        aria-selected="false"
                    >
                        Other Expenses
                    </Link>
                </li>
                <li class="nav-item" role="presentation">
                    <button
                        data-mdb-tab-init
                        class="nav-link"
                        id="contact-tab0"
                        data-mdb-target="#contact0"
                        type="button"
                        role="tab"
                        aria-controls="contact"
                        aria-selected="false"
                        onClick={handleClickTax}
                    >
                        Tax Document
                    </button>
                </li>
            </ul>
            <main role="main" className="px-4">
                <nav aria-label="breadcrumb mb-3" style={{ marginTop: '20px' }}>
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/">Home</a></li>
                        <li class="breadcrumb-item active" aria-current="page">Finance Dashboard</li>
                    </ol>
                </nav>
                <h2 className="text-left mb-5" >Finance Dashboard</h2>
                <div class="container">
                    <div class="row">
                        <div class="col-lg-4 col-md-6 mb-3">
                            <div class="card l-bg-cherry">
                                <div class="card-statistic-3 p-4">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div class="col-8">
                                            <h2 class="d-flex align-items-center mb-5">
                                                Rs.{TotalProfit.toFixed(2)}
                                            </h2>
                                            <h5 class="card-title" style={{ marginTop: '25px' }}>Total Profit</h5>
                                        </div>
                                        <i className="bi bi-cash-coin h1"></i>
                                    </div>
                                    <div class="progress mt-1 " data-height="8" style={{ height: '8px' }}>
                                        <div class="progress-bar l-bg-cyan" role="progressbar" data-width="25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{ width: '25%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-6 mb-3">
                            <div class="card l-bg-green-dark">
                                <div class="card-statistic-3 p-4">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div class="col-8">
                                            <h2 class="d-flex align-items-center mb-5">
                                                Rs.{TotalSales.toFixed(2)}
                                            </h2>
                                            <h5 class="card-title" style={{ marginTop: '25px' }}>Total Sales</h5>
                                        </div>
                                        <i className="bi bi-cash h1"></i>
                                    </div>
                                    <div class="progress mt-1 " data-height="8" style={{ height: '8px' }}>
                                        <div class="progress-bar l-bg-orange" role="progressbar" data-width="25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{ width: '25%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-6 mb-3">
                            <div class="card l-bg-orange-dark">
                                <div class="card-statistic-3 p-4">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div class="col-8">
                                            <h2 class="d-flex align-items-center mb-5">
                                                Rs.{TotalExpenses.toFixed(2)}
                                            </h2>
                                            <h5 class="card-title" style={{ marginTop: '25px' }}>Total Expenses</h5>
                                        </div>
                                        <i className="bi bi-currency-dollar h1"></i>
                                    </div>
                                    <div class="progress mt-1 " data-height="8" style={{ height: '8px' }}>
                                        <div class="progress-bar l-bg-cyan" role="progressbar" data-width="25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{ width: '25%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <div className="row">
                        <div className="col-lg-8 col-md-12 mb-3">
                            <div className="card" style={{ borderRadius: '20px' }}>
                                <div className="card-body">
                                    <h5 className="card-title">Sales vs Expenses</h5>
                                    <canvas id="canvas-1"></canvas>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-12 mb-3">
                            <div className="row">
                                <div className="card" style={{ borderRadius: '20px' }}>
                                    <div className="card-body">
                                        <form onSubmit={submit}>
                                            <div className="mb-3">
                                                <h6>Create Monthly profit log in order to analyze sales vs expenses</h6>
                                                <div className="row mb-3" style={{ marginTop: '15px' }}>
                                                    <div className="col-md-4">
                                                        <label htmlFor="Month" className="form-label">Select Month</label>
                                                    </div>
                                                    <div className="col-md-8">
                                                        <select className="form-select" id="Month" name="Month" value={month.Month} onChange={handleChange}>
                                                            <option value="">Select Month</option>
                                                            <option value="January">January</option>
                                                            <option value="February">February</option>
                                                            <option value="March">March</option>
                                                            <option value="April">April</option>
                                                            <option value="May">May</option>
                                                            <option value="June">June</option>
                                                            <option value="July">July</option>
                                                            <option value="August">August</option>
                                                            <option value="September">September</option>
                                                            <option value="October">October</option>
                                                            <option value="November">November</option>
                                                            <option value="December">December</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col">
                                                    <div className="btn-group">
                                                        <button type="submit" className="btn btn-primary" style={{ width: '200px', marginTop: '10px' }}>Add Profit</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>

                                    </div>
                                </div>
                            </div>
                            <div className="row" style={{ marginTop: '0px' }}>
                                <div className="card mb-3" style={{ borderRadius: '20px' }}>
                                    <div className="card-body">
                                        <h5 className="card-title">Other Expenses</h5>
                                        <p className="card-text">Add your repairing, transportational and constructional expenses.</p>
                                        <Link to={`/otherExpense`} className="btn btn-primary me-2" style={{ width: '200px' }}>Add</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row-md-4" style={{ marginTop: '40px', marginBottom: '40px' }}>
                        <div className="card" style={{ borderRadius: '20px' }}>
                            <div className="card-body">
                                <h5 className="card-title">Annual Profit breakdown</h5>
                                <canvas id="canvas-2"></canvas>
                            </div>
                        </div>
                    </div>
                </div>


            </main>
        </div>

    );
}

export default FinanceDash;

/* 

<div className="mt-5">
                    <div className="row justify-content-center">
                        <div className="col-md-3">
                            <div className="card mb-3" style={{ background: fixedCardColor, color: 'white', borderRadius: '20px' }}>
                                <div className="card-body text-center">
                                    <h3 className="card-title">Rs.{TotalProfit.toFixed(2)}</h3>
                                    <p className="card-text">Total Profit</p>
                                </div>
                                <div className="card-footer bg-transparent border-top-0">
                                    <div className="progress" style={{ height: '8px' }}>
                                        <div className="progress-bar bg-light" role="progressbar" style={{ width: '50%' }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card mb-3" style={{ background: fixedCardColor, color: 'white', borderRadius: '20px' }}>
                                <div className="card-body text-center">
                                    <h3 className="card-title">Rs.{TotalLastYear.toFixed(2)}</h3>
                                    <p className="card-text">Total Profit(last year)</p>
                                </div>
                                <div className="card-footer bg-transparent border-top-0">
                                    <div className="progress" style={{ height: '8px' }}>
                                        <div className="progress-bar bg-light" role="progressbar" style={{ width: '75%' }} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card mb-3" style={{ background: fixedCardColor, color: 'white', borderRadius: '20px' }}>
                                <div className="card-body text-center">
                                    <h3 className="card-title">Rs.{TotalSales.toFixed(2)}</h3>
                                    <p className="card-text">Total Sales</p>
                                </div>
                                <div className="card-footer bg-transparent border-top-0">
                                    <div className="progress" style={{ height: '8px' }}>
                                        <div className="progress-bar bg-light" role="progressbar" style={{ width: '30%' }} aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card mb-3" style={{ background: fixedCardColor, color: 'white', borderRadius: '20px' }}>
                                <div className="card-body text-center">
                                    <h3 className="card-title">Rs.{TotalExpenses.toFixed(2)}</h3>
                                    <p className="card-text">Total Expenses</p>
                                </div>
                                <div className="card-footer bg-transparent border-top-0">
                                    <div className="progress" style={{ height: '8px' }}>
                                        <div className="progress-bar bg-light" role="progressbar" style={{ width: '60%' }} aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

<nav className="col-md-2 d-none d-md-block bg-dark sidebar position-fixed" style={{ height: '1400px', overflowY: 'auto' }}>
                    <div className="sidebar-sticky">
                        <ul className="nav flex-column" style={{ marginTop: '40px' }}>
                            <li className="nav-item">
                                <a className="nav-link active text-light" href="#"><i className="bi bi-house-fill"></i> &nbsp; Dashboard</a>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link text-light" onClick={handleClick}>
                                    <i className="bi bi-cash"></i>&nbsp; Profit Log
                                </button>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-light" href="/otherExpense"><i className="bi bi-wallet"></i> &nbsp; Other Expenses</a>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link text-light" onClick={handleClickTax}>
                                    <i className="bi bi-file-earmark"></i>&nbsp; Tax Document
                                </button>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-light" href="#"><i className="bi bi-box-arrow-right"></i> &nbsp; Logout</a>
                            </li>
                        </ul>
                    </div>
                </nav>

                global Chart */
/*
import React, { useEffect } from 'react';

const ChartDisplay = () => {

    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('`http://localhost:8080/otherExpense/`'); // Replace '/api/chartdata' with your API endpoint
                setChartData(response.data);
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        let lineChart = null;
        let barChart = null;
    
        // Function to create or update the charts
        const createOrUpdateCharts = () => {
            // If previous Chart instances exist, destroy them
            if (lineChart) lineChart.destroy();
            if (barChart) barChart.destroy();

            const random = () => Math.round(Math.random() * 100);

            // Create or update Line Chart
            lineChart = new Chart(document.getElementById('canvas-1'), {
                type: 'line',
                data: {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [
                        {
                            label: 'My First dataset',
                            backgroundColor: 'rgba(220, 220, 220, 0.2)',
                            borderColor: 'rgba(220, 220, 220, 1)',
                            pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                            pointBorderColor: '#fff',
                            data: [random(), random(), random(), random(), random(), random(), random()]
                        },
                        {
                            label: 'My Second dataset',
                            backgroundColor: 'rgba(151, 187, 205, 0.2)',
                            borderColor: 'rgba(151, 187, 205, 1)',
                            pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                            pointBorderColor: '#fff',
                            data: [random(), random(), random(), random(), random(), random(), random()]
                        }
                    ]
                },
                options: {
                    responsive: true
                }
            });

            // Create or update Bar Chart
            barChart = new Chart(document.getElementById('canvas-2'), {
                type: 'bar',
                data: {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [
                        {
                            backgroundColor: 'rgba(220, 220, 220, 0.5)',
                            borderColor: 'rgba(220, 220, 220, 0.8)',
                            highlightFill: 'rgba(220, 220, 220, 0.75)',
                            highlightStroke: 'rgba(220, 220, 220, 1)',
                            data: [random(), random(), random(), random(), random(), random(), random()]
                        },
                        {
                            backgroundColor: 'rgba(151, 187, 205, 0.5)',
                            borderColor: 'rgba(151, 187, 205, 0.8)',
                            highlightFill: 'rgba(151, 187, 205, 0.75)',
                            highlightStroke: 'rgba(151, 187, 205, 1)',
                            data: [random(), random(), random(), random(), random(), random(), random()]
                        }
                    ]
                },
                options: {
                    responsive: true
                }
            });

        };

        createOrUpdateCharts();

        // Cleanup function to destroy the charts when the component unmounts
        return () => {
            if (lineChart) lineChart.destroy();
            if (barChart) barChart.destroy();
        };
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Finance Dashboard</h1>
            <div className="row">
                <div className="col-md-6">
                    <canvas id="canvas-1"></canvas>
                </div>
                <div className="col-md-6">
                    <canvas id="canvas-2"></canvas>
                </div>
            </div>
            
        </div>
    );
}

export default ChartDisplay;
*/