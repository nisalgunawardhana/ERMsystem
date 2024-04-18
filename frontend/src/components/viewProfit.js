import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";

function ProfitDetails() {
    const { id } = useParams();
    const [profit, setProfit] = useState(null);
    const [searchResult, setSearchResult] = useState(null);
    const [totalSalary, setTotalSalary] = useState(0);
    const [average, setAverage] = useState(0);
    const [Rate, setRate] = useState("");

    //fetch profit log
    useEffect(() => {
        axios.get(`http://localhost:8080/profit/get/${id}`)
            .then((res) => {
                setProfit(res.data.profit);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [id]);

    //function to search for profit log
    const handleSearch = () => {
        if (!selectedMonth || !selectedYear) {
            console.log('Please select both month and year.');
            return;
        }

        axios.get(`http://localhost:8080/profit/search/${selectedMonth}/${selectedYear}`)
            .then((res) => {
                setSearchResult(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        axios.get(`http://localhost:8080/profit/get/profit/average`)//fetch average monthly amount of expenses
            .then((res) => {
                setAverage(res.data.averageMonthlyProfit);
            })
            .catch((err) => {
                console.error(err);
            });
    });

    useEffect(() => {
        axios.get(`http://localhost:8080/profit/fetch/taxRate`)
            .then((res) => {
                setRate(res.data.taxRate);
            })
            .catch((err) => {
                console.error(err);
            });
    });

    // Handle browser back button click
    useEffect(() => {
        const handleBackButton = () => {
            // Reset search result when navigating back
            setSearchResult(null);
        };
        window.addEventListener('popstate', handleBackButton);

        return () => {
            window.removeEventListener('popstate', handleBackButton);
        };
    }, [profit]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    //report generation of profitlog
    const handleReportGeneration = () => {
        const dataToGenerateReport = searchResult || profit; // Use search result if available, otherwise use profit
        if (dataToGenerateReport) {
            generateReport(dataToGenerateReport); // Call the generateReport function with dataToGenerateReport
        } else {
            console.log('No data available to generate report.');
        }
    };

    const generateReport = (dataToGenerateReport) => {
        const pdfContent = `
            <html>
                <head>
                    <title>Profit Report</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            padding: 20px;
                        }
                        h1 {
                            text-align: center;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 20px;
                        }
                        th, td {
                            border: 1px solid #ccc;
                            padding: 8px;
                            text-align: left;
                        }
                        th {
                            background-color: #f2f2f2;
                        }
                    </style>
                </head>
                <body>
                    <h1>Profit Report</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Profit Details</th>
                                <th>Values</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Month</td>
                                <td>${searchResult ? searchResult[0].Month : profit.Month}</td>
                            </tr>
                            <tr>
                                <td>Sales Income</td>
                                <td>Rs.${searchResult ? searchResult[0].Sales_income : totalAmount}</td>
                            </tr>
                            <tr>
                                <td>Supplier Expenses</td>
                                <td>Rs.${searchResult ? searchResult[0].Supplier_expenses : totalSupp}</td>
                            </tr>
                            <tr>
                                <td>Employee Salaries</td>
                                <td>Rs.${searchResult ? searchResult[0].Salaries : profit.Salaries}</td>
                            </tr>
                            <tr>
                                <td>Other Expenses</td>
                                <td>Rs.${searchResult ? searchResult[0].Other_expenses : totalOther}</td>
                            </tr>
                            <tr>
                                <td>Epf and Etf</td>
                                <td>Rs.${searchResult ? searchResult[0].EPF_ETF : profit.EPF_ETF}</td>
                            </tr>
                            <tr>
                                <td>Monthly Profit</td>
                                <td>Rs.${searchResult ? searchResult[0].Monthly_profit : profit.Monthly_profit}</td>
                            </tr>
                            <tr>
                                <td>Date Created</td>
                                <td>${searchResult ? new Date(searchResult[0].Date_modified).toLocaleDateString() : new Date(profit.Date_modified).toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <td>Description</td>
                                <td>${searchResult ? searchResult[0].Description : profit.Description}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="button-container">
                        <button onclick="window.print()" class="btn btn-primary">Print</button>
                        <button onclick="downloadPDF()" class="btn btn-primary">Download PDF</button>
                        <button onclick="window.close()" class="btn btn-secondary">Close</button>
                    </div>
                </body>
            </html>`
            ;
        const printWindow = window.open("", "_blank", "width=600,height=600");
        printWindow.document.write(pdfContent);
        printWindow.document.close();

        printWindow.downloadPDF = () => {
            const pdfBlob = new Blob([pdfContent], { type: "application/pdf" });
            const pdfUrl = URL.createObjectURL(pdfBlob);
            const a = document.createElement("a");
            a.href = pdfUrl;
            a.download = "profit_report.pdf";
            a.click();
            URL.revokeObjectURL(pdfUrl);
            printWindow.close();
        };
    };

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

    const [totalAmount, setTotalAmount] = useState(0);
    const [totalOther, setTotalOther] = useState(0);
    const [totalSupp, setTotalSupp] = useState(0);

    useEffect(() => {
        const currentMonth = getCurrentMonth();
        axios.get(`http://localhost:8080/profit/${currentMonth}`)//fetch monthly sales
            .then((res) => {
                setTotalAmount(res.data.totalAmount);
            })
            .catch((err) => {
                console.error(err);
            });
        axios.get(`http://localhost:8080/profit/other/${currentMonth}`)//fetch monthly other expenses
            .then((res) => {
                setTotalOther(res.data.totalOther);
            })
            .catch((err) => {
                console.error(err);
            });
        axios.get(`http://localhost:8080/profit/supplier/${currentMonth}`)//fetch monthly supplier expenses
            .then((res) => {
                setTotalSupp(res.data.totalSupp);
            })
            .catch((err) => {
                console.error(err);
            });
        axios.get(`http://localhost:8080/profit/salaries/${month}`)//fetch monthly salaries
            .then((res) => {
                setTotalSalary(res.data.totalSalary);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [month]);

    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    const monthsOptions = Array.from({ length: 12 }, (_, index) => {
        const month = new Date(null, index + 1, null).toLocaleDateString('en', { month: 'long' });
        return <option key={index} value={month}>{month}</option>;
    });

    // Generate options for years (current year and the last 5 years)
    const currentYear = new Date().getFullYear();
    const yearsOptions = Array.from({ length: 6 }, (_, index) => {
        const year = currentYear - index;
        return <option key={index} value={year}>{year}</option>;
    });

    const year = searchResult ? new Date(searchResult[0]?.Date_modified).getFullYear() : new Date(profit?.Date_modified).getFullYear();

    // Convert date to readable format
    let endDateString = null;
    if (searchResult && searchResult[0] && searchResult[0].Date_modified) {
        endDateString = new Date(searchResult[0].Date_modified);
    } else if (profit && profit.Date_modified) {
        endDateString = new Date(profit.Date_modified);
    }

    // Function to format the date as "1st Jan 2024"
    const formatEndDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    // Use the formatEndDate function to format the end date if it's not null
    let endDateFormatted = null;
    if (endDateString) {
        endDateFormatted = formatEndDate(endDateString);
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

    //Navigate to profit log
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
            console.log('No profit record found for the current month.');
            // Handle the case where there's no profit record for the current month
        }
    };

    //Navigate to tax document
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

    return (
            <div className="container">
                <ul class="nav nav-tabs mb-3" id="myTab0" role="tablist">
                    <li class="nav-item" role="presentation">
                        <Link
                            className="nav-link"
                            id="contact-tab0"
                            to="/finance"
                            role="tab"
                            aria-controls="contact"
                            aria-selected="false"
                        >
                            Dashboard
                        </Link>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button
                            data-mdb-tab-init
                            class="nav-link active"
                            id="profile-tab0"
                            type="button"
                            role="tab"
                            aria-controls="profile"
                            aria-selected="false"
                            onClick={handleClick}
                            style={{ borderBottom: '2px solid #007bff', borderTop: 'none' }}
                        >
                            <i className="bi bi-cash"></i> Profit Log
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

                {/* Breadcrumb for profit log */}
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/">Home</a></li>
                        <li class="breadcrumb-item"><a href="/finance">Finance Dashboard</a></li>
                        <li class="breadcrumb-item active" aria-current="page">Profit Log</li>
                    </ol>
                </nav>
                <h2 className="text-left mb-4" style={{ marginTop: '30px' }}>Monthly Profit Details</h2>

                <div className="row" style={{ marginTop: '35px' }}>

                    {/* Generate Monthly Profit Report*/}
                    <div className="col-lg-6 col-md-12 mb-3">
                        <div className="card" style={{ height: '160px' }}>
                            <div className="card-body">
                                <h5 className="card-title">Generate Monthly Profit Report</h5>
                                <p className="card-text">Click the button below to generate a report for the monthly profit.</p>
                                <button className="btn btn-primary text-center" onClick={handleReportGeneration} style={{ marginTop: '10px', width: '200px' }}> Generate Report</button>
                            </div>
                        </div>
                    </div>

                    {/* Button to add new Profit log */}
                    <div className="col-lg-6 col-md-12 mb-3">
                        <div className="card" style={{ height: '160px' }}>
                            <div className="card-body" style={{ padding: '20px' }}>
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
                                    <div className="row mb-3">
                                        <div className="col">
                                            <div className="button-container d-flex justify-content-start align-items-center">
                                                <button type="submit" className="btn btn-primary" style={{ width: '200px' }}>Add Profit</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search bar to search profit log */}
                <div className="row" style={{ marginTop: '15px' }}>
                    <div className="col-md-4">
                        <select id="month" className="form-control" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                            <option value="">Select Month</option>
                            {monthsOptions}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <select id="year" className="form-control" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                            <option value="">Select Year</option>
                            {yearsOptions}
                        </select>
                    </div>
                    <div className="col-md-4 align-self-end">
                        <button className="btn btn-primary" onClick={handleSearch} onKeyDown={handleKeyDown}>Search Profit Log</button>
                    </div>
                </div>

                <h2 className="mb-4" style={{ marginTop: '25px' }}><i className="fas fa-chart-line"></i> Profit Log {(searchResult || profit) && `- ${searchResult ? searchResult[0].Month : profit.Month}`}</h2>
                <p className="text-muted">Explore the detailed breakdown of your profits, including sales income, expenses, and monthly profit, to gain insights into your financial performance.</p>

                {/* Display summary of profit details current month */}
                {profit && (
                    <div className="container mt-3">
                        <div className="row justify-content-center">
                            <div className="col-lg-3 col-md-6 mb-3">
                                <div className="card" style={{ background: 'linear-gradient(to right, #493240, #f09)', color: '#fff' }}>
                                    <div className="card-body d-flex justify-content-between align-items-center">
                                        <div>
                                            <h3 className="card-title">{(totalAmount - (totalSupp + totalSalary + totalOther + profit.EPF_ETF)).toFixed(2)}</h3>
                                            <p className="card-text" style={{ marginTop: '25px' }}>Monthly Profit (Rs.)</p>
                                        </div>
                                        <i className="bi bi-currency-dollar h1"></i>
                                    </div>
                                    <div className="card-footer bg-transparent border-top-0">
                                        <div class="progress" style={{ height: '10px', width: '85%', marginBottom: '20px', marginLeft: '20px', marginTop: '-5px' }}>
                                            <div class="progress-bar" role="progressbar" style={{ backgroundColor: '#b2beb5', width: '60%' }} aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 mb-3">
                                <div className="card" style={{ background: 'linear-gradient(to right, #0a504a, #38ef7d)', color: '#fff' }}>
                                    <div className="card-body d-flex justify-content-between align-items-center">
                                        <div>
                                            <h3 className="card-title">{average.toFixed(2)}</h3>
                                            <p className="card-text" style={{ marginTop: '25px' }}>Average Monthly Profit (Rs.)</p>
                                        </div>
                                        <i className="bi bi-calculator h1"></i>
                                    </div>
                                    <div className="card-footer bg-transparent border-top-0">
                                        <div class="progress" style={{ height: '10px', width: '85%', marginBottom: '20px', marginLeft: '20px', marginTop: '-5px' }}>
                                            <div class="progress-bar" role="progressbar" style={{ backgroundColor: '#b2beb5', width: '50%' }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 mb-3">
                                <div className="card" style={{ background: 'linear-gradient(to right, #a86008, #ffba56)', color: '#fff' }}>
                                    <div className="card-body d-flex justify-content-between align-items-center">
                                        <div>
                                            <h3 className="card-title">{totalAmount.toFixed(2)}</h3>
                                            <p className="card-text" style={{ marginTop: '25px' }}>Monthly Sales (Rs.)</p>
                                        </div>
                                        <i className="bi bi-cart4 h1"></i>
                                    </div>
                                    <div className="card-footer bg-transparent border-top-0">
                                        <div class="progress" style={{ height: '10px', width: '85%', marginBottom: '20px', marginLeft: '20px', marginTop: '-5px' }}>
                                            <div class="progress-bar" role="progressbar" style={{ backgroundColor: '#b2beb5', width: '70%' }} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 mb-3">
                                <div className="card" style={{ background: 'linear-gradient(to right, #007bff, #6c757d)', color: '#fff' }}>
                                    <div className="card-body d-flex justify-content-between align-items-center">
                                        <div>
                                            <h3 className="card-title">{(totalSupp + totalSalary + totalOther + profit.EPF_ETF).toFixed(2)}</h3>
                                            <p className="card-text" style={{ marginTop: '25px' }}>Monthly Expenses (Rs.)</p>
                                        </div>
                                        <i className="bi bi-credit-card h1"></i>
                                    </div>
                                    <div className="card-footer bg-transparent border-top-0">
                                        <div class="progress" style={{ height: '10px', width: '85%', marginBottom: '20px', marginLeft: '20px', marginTop: '-5px' }}>
                                            <div class="progress-bar" role="progressbar" style={{ backgroundColor: '#b2beb5', width: '40%' }} aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
                {/* Display profit details for searched month or current month */}
                {(searchResult || profit) && (
                    <div className="row">
                        {/* Left Column for Profit Details */}
                        <div className="col-md-12">
                            <div className="card" style={{ marginBottom: '40px' }}>
                                <div className="card-body" style={{ padding: '20px' }}>
                                    <h4 className="mb-3">Valid Period: {searchResult ? searchResult[0].Month : profit.Month} 1, {year}  - {endDateFormatted}</h4>
                                    <div style={{ marginTop: '15px', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                                        <div className="custom-card col-md-4" style={{ padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff' }}>
                                            <div style={{ fontWeight: 'bold' }}><i className="bi bi-list-ul"></i> Profit Log ID:</div>
                                            <div style={{ fontStyle: 'italic' }}>{searchResult ? searchResult[0].Profit_ID : profit.Profit_ID}</div>
                                        </div>
                                        <div className="custom-card col-md-4" style={{ padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff' }}>
                                            <div style={{ fontWeight: 'bold' }}><i className="bi bi-calendar"></i> Month:</div>
                                            <div style={{ fontStyle: 'italic' }}>{searchResult ? searchResult[0].Month : profit.Month}</div>
                                        </div>
                                        <div className="custom-card col-md-3" style={{ padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff' }}>
                                            <div style={{ fontWeight: 'bold' }}><i className="bi bi-cash"></i> Sales Income:</div>
                                            <div style={{ fontStyle: 'italic' }}>Rs.{searchResult ? searchResult[0].Sales_income.toFixed(2) : totalAmount.toFixed(2)}</div>
                                        </div>
                                        <div className="custom-card col-md-4" style={{ padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff' }}>
                                            <div style={{ fontWeight: 'bold' }}><i className="bi bi-shop"></i> Supplier Expenses:</div>
                                            <div style={{ fontStyle: 'italic' }}>Rs.{searchResult ? searchResult[0].Supplier_expenses.toFixed(2) : totalSupp.toFixed(2)}</div>
                                        </div>
                                        <div className="custom-card col-md-4" style={{ padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff' }}>
                                            <div style={{ fontWeight: 'bold' }}><i className="bi bi-person"></i> Employee Salaries: </div>
                                            <div style={{ fontStyle: 'italic' }}>Rs.{searchResult ? searchResult[0].Salaries.toFixed(2) : profit.Salaries.toFixed(2)}</div>
                                        </div>
                                        <div className="custom-card col-md-3" style={{ padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff' }}>
                                            <div style={{ fontWeight: 'bold' }}><i className="bi bi-calendar"></i> Date Modified:</div>
                                            <div style={{ fontStyle: 'italic' }}>{searchResult ? new Date(searchResult[0].Date_modified).toLocaleDateString() : new Date(profit.Date_modified).toLocaleDateString()}</div>
                                        </div>
                                        <div className="custom-card col-md-4" style={{ padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff' }}>
                                            <div style={{ fontWeight: 'bold' }}><i className="bi bi-wallet"></i> Other Expenses:</div>
                                            <div style={{ fontStyle: 'italic' }}>Rs.{searchResult ? searchResult[0].Other_expenses.toFixed(2) : totalOther.toFixed(2)}</div>
                                        </div>
                                        <div className="custom-card col-md-4" style={{ padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff' }}>
                                            <div style={{ fontWeight: 'bold' }}><i className="bi bi-wallet"></i> Epf and Etf:</div>
                                            <div style={{ fontStyle: 'italic' }}>Rs.{searchResult ? searchResult[0].EPF_ETF.toFixed(2) : profit.EPF_ETF.toFixed(2)}</div>
                                        </div>
                                        <div className="custom-card col-md-3" style={{ padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff' }}>
                                            <div style={{ fontWeight: 'bold' }}><i className="bi bi-graph-up"></i> Monthly Profit:</div>
                                            <div style={{ fontStyle: 'italic' }}>Rs.{searchResult ? searchResult[0].Monthly_profit.toFixed(2) : profit.Monthly_profit.toFixed(2)}</div>
                                        </div>
                                        <div className="custom-card col-md-10" style={{ padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff' }}>
                                            <div style={{ fontWeight: 'bold' }}><i className="bi bi-chat-left"></i> Description:</div>
                                            <div style={{ fontStyle: 'italic' }}>{searchResult ? searchResult[0].Description : profit.Description}</div>
                                        </div>
                                    </div>
                                    <div className="button-container text-center" style={{ marginTop: '25px' }}>
                                        <Link to={`/profit/update/${profit._id}`} className="btn btn-primary me-2" style={{ width: '160px' }}>Edit</Link>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                )}


            </div>
    );
}

export default ProfitDetails;
