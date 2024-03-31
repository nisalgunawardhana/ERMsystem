import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link} from "react-router-dom";

function ProfitDetails() {
    const { id } = useParams();
    const [mon, setMon] = useState(null);
    const [profit, setProfit] = useState(null);
    const [searchMonth, setSearchMonth] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [displayedData, setDisplayedData] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/profit/get/${id}`)
            .then((res) => {
                setProfit(res.data.profit);
                setDisplayedData(res.data.profit); // Set the initial displayed data
                setMon(res.data.profit.Month);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [id]);

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

    // Handle browser back button click
    useEffect(() => {
        const handleBackButton = () => {
            // Reset search result when navigating back
            setSearchResult(null);
            setDisplayedData(profit); // Set the displayed data back to the original profit data
        };

        window.addEventListener('popstate', handleBackButton);

        return () => {
            window.removeEventListener('popstate', handleBackButton);
        };
    }, [profit]);

    const getCurrentMonth = () => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const currentDate = new Date();
        const monthIndex = currentDate.getMonth();
        return months[monthIndex];
    };

    const getCurrentMonthProfitId = async () => {
        try {
            const currentMonth = getCurrentMonth();
            const response = await axios.get(`http://localhost:8080/profit/search/${currentMonth}`);
            const profit = response.data;
            if (profit.length > 0) {
                // Assuming the first profit record for the current month is the relevant one
                return profit[0].Profit_ID;
            } else {
                // If there's no profit record for the current month, return null
                return null;
            }
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

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

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
                                <td>Monthly Profit</td>
                                <td>Rs.${searchResult ? searchResult[0].Monthly_profit : profit.Monthly_profit}</td>
                            </tr>
                            <tr>
                                <td>Date Created</td>
                                <td>${searchResult ? new Date(searchResult[0].Date_created).toLocaleDateString() : new Date(profit.Date_created).toLocaleDateString()}</td>
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
        axios.get(`http://localhost:8080/profit/${currentMonth}`)
            .then((res) => {
                setTotalAmount(res.data.totalAmount);
            })
            .catch((err) => {
                console.error(err);
            });
        axios.get(`http://localhost:8080/profit/other/${currentMonth}`)
            .then((res) => {
                setTotalOther(res.data.totalOther);
            })
            .catch((err) => {
                console.error(err);
            });
        axios.get(`http://localhost:8080/profit/supplier/${currentMonth}`)
            .then((res) => {
                setTotalSupp(res.data.totalSupp);
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

    const year = searchResult ? new Date(searchResult[0]?.Date_created).getFullYear() : new Date(profit?.Date_created).getFullYear();

    // Assuming you have a variable `endDateString` containing the value of the "Date created" field
    let endDateString = null;
    if (searchResult && searchResult[0] && searchResult[0].Date_created) {
        endDateString = new Date(searchResult[0].Date_created);
    } else if (profit && profit.Date_created) {
        endDateString = new Date(profit.Date_created);
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
    }

    return (
        <div style={{ marginTop: '-40px' }}>
            {/* Side Navigation Bar */}
            <nav className="col-md-2 d-none d-md-block bg-dark sidebar position-fixed" style={{ height: '100vh', overflowY: 'auto', marginTop: '-80px' }}>
                <div className="sidebar-sticky">
                    <ul className="nav flex-column" style={{ marginTop: '80px' }}>
                        <li className="nav-item">
                            <a className="nav-link active text-light" href="#"><i className="bi bi-house-fill"></i>&nbsp; Dashboard</a>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link text-light" onClick={handleClick}>
                                <i className="bi bi-cash"></i>&nbsp; Profit Log
                            </button>
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
                <div className="row">
                    <div className="col-md-4">
                        <label htmlFor="month">Month:</label>
                        <select id="month" className="form-control" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                            <option value="">Select Month</option>
                            {monthsOptions}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="year">Year:</label>
                        <select id="year" className="form-control" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                            <option value="">Select Year</option>
                            {yearsOptions}
                        </select>
                    </div>
                    <div className="col-md-4 align-self-end">
                        <button className="btn btn-primary" onClick={handleSearch} onKeyDown={handleKeyDown}>Search</button>
                    </div>
                </div>

                <div className="row" style={{ marginTop: '40px' }}>
                    {/* Generate Monthly Profit Report Card */}
                    <div className="col-md-6">
                        <div className="card" style={{ height: '160px' }}>
                            <div className="card-body">
                                <h5 className="card-title">Generate Monthly Profit Report</h5>
                                <p className="card-text">Click the button below to generate a report for the monthly profit.</p>
                                <button className="btn btn-primary" onClick={handleReportGeneration} style={{ marginTop: '10px' }}> Generate Report</button>
                            </div>
                        </div>
                    </div>

                    {/* Add Profit Card */}
                    <div className="col-md-6">
                        <div className="card" style={{ height: '160px' }}>
                            <div className="card-body">
                                <form onSubmit={submit}>
                                    <h6>Create Monthly profit log in order to analyze sales vs expenses</h6>
                                    <div className="row mb-3" style={{ marginTop: '15px' }}>
                                        <div className="col-md-4">
                                            <label htmlFor="Month" className="form-label">Enter Month</label>
                                        </div>
                                        <div className="col-md-8">
                                            <input type="text" className="form-control" id="Month" name="Month" value={month.Month} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col">
                                            <div className="btn-group">
                                                <button type="submit" className="btn btn-primary" style={{ width: '200px' }}>Add Profit</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <h2 className="mb-4" style={{ marginTop: '20px' }}><i className="fas fa-chart-line"></i> Profit Details {(searchResult || profit) && `- ${searchResult ? searchResult[0].Month : profit.Month}`}</h2>
                <p className="text-muted">Explore the detailed breakdown of your profits, including sales income, expenses, and monthly profit, to gain insights into your financial performance.</p>

                {/* Display profit details for searched month */}
                {(searchResult || profit) && (
                    <div className="row">
                        {/* Left Column for Profit Details */}
                        <div className="col-md-6">
                            <div className="card" style={{ marginTop: '25px', marginBottom: '30px' }}>
                                <div className="card-body">
                                    <h4 className="mb-3">Valid Period: {searchResult ? searchResult[0].Month : profit.Month} 1, {year}  - {endDateFormatted}</h4>
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
                                                <td>Rs.{searchResult ? searchResult[0].Sales_income : totalAmount}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row"><i className="bi bi-shop"></i>&nbsp;&nbsp; Supplier Expenses:</th>
                                                <td>Rs.{searchResult ? searchResult[0].Supplier_expenses : totalSupp}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row"><i className="bi bi-person"></i>&nbsp;&nbsp; Employee Salaries:</th>
                                                <td>Rs.{searchResult ? searchResult[0].Salaries : profit.Salaries}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row"><i className="bi bi-wallet"></i>&nbsp;&nbsp; Other Expenses:</th>
                                                <td>Rs.{searchResult ? searchResult[0].Other_expenses : totalOther}</td>
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
                                    <div class="button-container">
                                        <Link to={`/profit/update/${profit._id}`} className="btn btn-primary me-2" style={{ marginLeft: '180px', width: '160px' }}>Edit</Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column for Cards */}
                        <div className="col-md-6" style={{ marginTop: '20px', marginLeft: '0px' }}>
                            <div className="row mb-4">
                                <div className="col-md-6" style={{ height: '140px' }}>
                                    <div className="card h-90">
                                        <div className="card-body">
                                            <i className="bi bi-cash h1 text-primary"></i>
                                            <h5 className="card-title">Monthly Profit</h5>
                                            <p className="card-text">Rs.{searchResult ? searchResult[0].Monthly_profit : profit.Monthly_profit}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card h-90">
                                        <div className="card-body">
                                            <i className="bi bi-cash h1 text-success"></i>
                                            <h5 className="card-title">Average Monthly Profit</h5>
                                            <p className="card-text">Rs.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6" style={{ height: '120px' }}>
                                    <div className="card h-90">
                                        <div className="card-body">
                                            <i className="bi bi-cash h1 text-warning"></i>
                                            <h5 className="card-title">Monthly Sales</h5>
                                            <p className="card-text">Rs.{searchResult ? searchResult[0].Sales_income : totalAmount}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card h-90">
                                        <div className="card-body">
                                            <i className="bi bi-cash h1 text-danger"></i>
                                            <h5 className="card-title">Monthly Expenses</h5>
                                            <p className="card-text">Rs.{searchResult ? searchResult[0].Supplier_expenses + searchResult[0].Salaries + searchResult[0].Other_expenses : totalSupp + profit.Salaries + totalOther}</p>
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





