/* global Chart */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from 'react-bootstrap';

const FinanceDash = () => {

    const [otherExpenses, setOtherExpenses] = useState([]);
    const [profit, setProfit] = useState([]);
    const [monthlyProfit, setMonthlyProfit] = useState(0);
    const [monthlySales, setMonthlySales] = useState(0);
    const [monthlyExpenses, setMonthlyExpenses] = useState(0);
    const [averageMonthlyProfit, setAverageMonthlyProfit] = useState(0);
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

    useEffect(() => {
        // Calculate current monthly profit, sales, expenses, and average monthly profit here
        // For demonstration, I'm setting dummy values
        setMonthlyProfit(5000);
        setMonthlySales(10000);
        setMonthlyExpenses(3000);
        setAverageMonthlyProfit(4500);
    }, []);

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

    return (
        <div className="container-fluid" style={{ backgroundColor: '#f2f2f2', marginTop: '-40px' }}>
            <div className="row">
                <nav className="col-md-2 d-none d-md-block bg-dark sidebar position-fixed" style={{ height: '1400px', overflowY: 'auto' }}>
                    <div className="sidebar-sticky">
                        <ul className="nav flex-column" style={{ marginTop: '40px' }}>
                            <li className="nav-item">
                                <a className="nav-link active text-light" href="#"><i className="bi bi-house-fill"></i> &nbsp; Dashboard</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-light" href="#"><i className="bi bi-cash"></i> &nbsp; Profit Log</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-light" href="/otherExpense"><i className="bi bi-wallet"></i> &nbsp; Other Expenses</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-light" href="#"><i className="bi bi-file-earmark"></i> &nbsp; Tax Document</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-light" href="#"><i className="bi bi-box-arrow-right"></i> &nbsp; Logout</a>
                            </li>
                        </ul>
                    </div>
                </nav>

                <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4" style={{ marginLeft: '250px' }}>
                    <h2 className="text-left mb-4" style={{ marginTop: '20px' }}>Dashboard</h2>
                    <div className="container mt-5">
                        <div className="row justify-content-center">
                            <div className="col-md-3">
                                <div className="card mb-3" style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, color: 'white', borderRadius: '20px' }}>
                                    <div className="card-body text-center">
                                        <h5 className="card-title">Total Profit</h5>
                                        <p className="card-text">Rs.{TotalProfit.toFixed(2)}</p>
                                    </div>
                                    <div className="card-footer bg-transparent border-top-0">
                                        <div className="progress" style={{ height: '8px' }}>
                                            <div className="progress-bar bg-light" role="progressbar" style={{ width: '50%' }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card mb-3" style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, color: 'white', borderRadius: '20px' }}>
                                    <div className="card-body text-center">
                                        <h5 className="card-title">Total Profit(last year)</h5>
                                        <p className="card-text">Rs.{TotalLastYear.toFixed(2)}</p>
                                    </div>
                                    <div className="card-footer bg-transparent border-top-0">
                                        <div className="progress" style={{ height: '8px' }}>
                                            <div className="progress-bar bg-light" role="progressbar" style={{ width: '75%' }} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card mb-3" style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, color: 'white', borderRadius: '20px' }}>
                                    <div className="card-body text-center">
                                        <h5 className="card-title">Total Sales</h5>
                                        <p className="card-text">Rs.{TotalSales.toFixed(2)}</p>
                                    </div>
                                    <div className="card-footer bg-transparent border-top-0">
                                        <div className="progress" style={{ height: '8px' }}>
                                            <div className="progress-bar bg-light" role="progressbar" style={{ width: '30%' }} aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card mb-3" style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, color: 'white', borderRadius: '20px' }}>
                                    <div className="card-body text-center">
                                        <h5 className="card-title">Total Expenses</h5>
                                        <p className="card-text">Rs.{TotalExpenses.toFixed(2)}</p>
                                    </div>
                                    <div className="card-footer bg-transparent border-top-0">
                                        <div className="progress" style={{ height: '8px' }}>
                                            <div className="progress-bar bg-light" role="progressbar" style={{ width: '60%' }} aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="container-fluid mt-5">
                                <div className="row">
                                    <div className="col-md-7">
                                        <div className="card" style={{ borderRadius: '20px' }}>
                                            <div className="card-body">
                                                <h5 className="card-title">Sales vs Expenses</h5>
                                                <canvas id="canvas-1"></canvas>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-5">
                                        <div className="row">
                                            <div className="card" style={{ borderRadius: '20px' }}>
                                                <div className="card-body">
                                                    <form onSubmit={submit}>
                                                        <div className="mb-3">
                                                            <h6>Create Monthly profit log in order to analyze sales vs expenses</h6>
                                                            <div className="row mb-3" style={{ marginTop: '15px' }}>
                                                                <div className="col-md-4">
                                                                    <label htmlFor="Month" className="form-label">Enter Month</label>
                                                                </div>
                                                                <div className="col-md-8">
                                                                    <input type="text" className="form-control" id="Month" name="Month" value={month.Month} onChange={handleChange} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row mb-3">
                                                            <div className="col">
                                                                <div className="btn-group">
                                                                    <button type="submit" className="btn btn-primary">Add Profit</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row" style={{ marginTop: '20px' }}>
                                            <div className="card mb-3" style={{ borderRadius: '20px' }}>
                                                <div className="card-body">
                                                    <h5 className="card-title">Monthly Profit Report</h5>
                                                    <p className="card-text">Generate a report on the monthly profit.</p>
                                                    <button className="btn btn-primary">Generate Report</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row-md-4" style={{ marginTop: '40px' }}>
                                    <div className="card" style={{ borderRadius: '20px' }}>
                                        <div className="card-body">
                                            <h5 className="card-title">Monthly Profit</h5>
                                            <canvas id="canvas-2"></canvas>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>


    );
}

export default FinanceDash;

/* global Chart */
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