import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function TaxDetails() {
    const { id } = useParams();
    const [mon, setMon] = useState(null);
    const [tax, setTax] = useState(null);
    const [Tax_income, setTaxableIncome] = useState(null);
    const [profit, setProfit] = useState(null);
    const [totalSalary, setTotalSalary] = useState(0);
    const [searchMonth, setSearchMonth] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [displayedData, setDisplayedData] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/tax/get/${id}`)
            .then((res) => {
                setTax(res.data.tax);
                setDisplayedData(res.data.tax); // Set the initial displayed data
                setMon(res.data.profit.Month);
            })
            .catch((err) => {
                console.error(err);
            });
        axios.get(`http://localhost:8080/profit/get/${id}`)
            .then((res) => {
                setProfit(res.data.profit);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [id]);

    const handleSearch = () => {
        if (!selectedYear) {
            console.log('Please select year.');
            return;
        }

        axios.get(`http://localhost:8080/tax/search/${selectedYear}`)
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

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleReportGeneration = () => {
        const dataToGenerateReport = searchResult || tax; // Use search result if available, otherwise use profit
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
                    <title>Tax Report</title>
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
                    <h1>Tax Report</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Tax Details</th>
                                <th>Values</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Tax Doc ID</td>
                                <td>${searchResult ? searchResult[0].Tax_ID : tax.Tax_ID}</td>
                            </tr>
                            <tr>
                                <td>Taxable Income</td>
                                <td>Rs.${searchResult ? searchResult[0].Taxable_income : tax.Taxable_income}</td>
                            </tr>
                            <tr>
                                <td>Tax Rate</td>
                                <td>${searchResult ? searchResult[0].Rate : tax.Rate}%</td>
                            </tr>
                            <tr>
                                <td>Income Tax</td>
                                <td>Rs.${searchResult ? searchResult[0].Income_tax : tax.Income_tax}</td>
                            </tr>
                            <tr>
                                <td>Due Date</td>
                                <td>${searchResult ? new Date(searchResult[0].Due_date).toLocaleDateString() : new Date(tax.Due_date).toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <td>Date Created</td>
                                <td>${searchResult ? new Date(searchResult[0].Date_created).toLocaleDateString() : new Date(tax.Date_created).toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <td>Payment Status</td>
                                <td>${searchResult ? searchResult[0].Status : tax.Status}</td>
                            </tr>
                            <tr>
                                <td>Final profit</td>
                                <td>Rs.${searchResult ? searchResult[0].Final_profit : tax.Final_profit}</td>
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
            a.download = "tax_report.pdf";
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
        const epfetf = EPF + ETF;
        // Redirect to the page where total amount is fetched for the entered month
        window.location.href = `/tax/${epfetf}`;
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
        axios.get(`http://localhost:8080/profit/salary/${currentMonth}`)
            .then((res) => {
                setTotalSalary(res.data.totalSupp);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [month]);

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

    const TotalProfit = profit ? profit.reduce((acc, curr) => acc + parseFloat(curr.Monthly_profit), 0) : 0;

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

    const year = searchResult ? new Date(searchResult[0]?.Date_created).getFullYear() : new Date(tax?.Date_created).getFullYear();

    const [EPF, setEPF] = useState(0);
    const [ETF, setETF] = useState(0);
    const [salary, setSalary] = useState('');
    const [isCalculating, setIsCalculating] = useState(false);
    let TotEtf = 0;

    const calculateEPFETF = async () => {
        setIsCalculating(true);
        try {
            // Assuming salary is entered in the form
            if (!totalAmount) {
                throw new Error('Please enter the salary.');
            }

            // Calculate EPF (10% of salary) and ETF (3% of salary)
            const EPF = (parseInt(totalAmount) * 20) / 100;
            const ETF = (parseInt(totalAmount) * 3) / 100;
            TotEtf = parseFloat(TotEtf).toFixed(2) + parseFloat(ETF).toFixed(2);

            setEPF(EPF);
            setETF(ETF);
        } catch (error) {
            console.error('Error calculating EPF and ETF:', error);
        } finally {
            setIsCalculating(false);
        }
    };

    // Assuming you have a variable `endDateString` containing the value of the "Date created" field
    let endDateString = null;
    if (searchResult && searchResult[0] && searchResult[0].Date_created) {
        endDateString = new Date(searchResult[0].Date_created);
    } else if (tax && tax.Date_created) {
        endDateString = new Date(tax.Date_created);
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

    const getCurrentMonthProfitId = async () => {
        try {
            let currentMonth = getCurrentMonth();
            let currentYear = getCurrentYear();
            let response = await axios.get(`http://localhost:8080/profit/search/${currentMonth}`);
            let profit = response.data;

            if (profit.length > 0) {
                // Filter profit records based on date_created column
                const currentYearProfit = profit.find(item => {
                    const dateCreated = new Date(item.Date_created);
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
                    const dateCreated = new Date(item.Date_created);
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
                    const dateCreated = new Date(item.Date_created);
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
                    const dateCreated = new Date(item.Date_created);
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
        <div style={{ marginTop: '20px' }}>
            <div className="container-fluid" style={{ marginTop: '40px', width: '1260px' }}>
                <ul class="nav nav-tabs mb-3" id="myTab0" role="tablist">
                    <li class="nav-item" role="presentation">
                        <Link
                            className="nav-link"
                            id="contact-tab0"
                            to="/otherExpense"
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
                            <i className="bi bi-wallet"></i> Other Expenses
                        </Link>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button
                            data-mdb-tab-init
                            class="nav-link active"
                            id="contact-tab0"
                            data-mdb-target="#contact0"
                            type="button"
                            role="tab"
                            aria-controls="contact"
                            aria-selected="false"
                            onClick={handleClickTax}
                            style={{ borderBottom: '2px solid #007bff', borderTop: 'none' }}
                        >
                            Tax Document
                        </button>
                    </li>
                </ul>
                {/*Breadcrumb*/}
                <nav aria-label="breadcrumb" style={{ marginLeft: '10px' }}>
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/">Home</a></li>
                        <li class="breadcrumb-item"><a href="/finance">Finance Dashboard</a></li>
                        <li class="breadcrumb-item active" aria-current="page">Tax Document</li>
                    </ol>
                </nav>
                {/* Main Content */}
                <div className="container-fluid" style={{ marginTop: '40px' }}>
                    <div className="row">
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
                                        <h5>Add New Tax Document</h5>
                                        <p className="card-text">You can create a tax document to keep track of the tax details.</p>
                                        <div className="row mb-3">
                                            <div className="col">
                                                <div className="btn-group">
                                                    <button type="submit" className="btn btn-primary" style={{ marginTop: '20px' }}>Add Tax Document</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h2 className="mb-4" style={{ marginTop: '60px' }}><i className="fas fa-chart-line"></i> Tax Document {(searchResult || tax) && `- ${year}`}</h2>
                    <p className="text-muted">Explore the detailed breakdown of your profits, including sales income, expenses,<br></br> and monthly profit, to gain insights into your financial performance.</p>

                    {/* Display profit details for searched month */}
                    {(searchResult || tax) && (
                        <div className="row">
                            {/* Left Column for Profit Details */}
                            <div className="col-md-6">
                                <div className="card" style={{ marginTop: '25px', marginBottom: '25px' }}>
                                    <div className="card-body">
                                        <h4 className="mb-3">Valid Period: January 1, {year} - {endDateFormatted}</h4>
                                        <table className="table">
                                            <tbody>
                                                <tr>
                                                    <th scope="row"><i className="bi bi-file-earmark-text"></i>&nbsp;&nbsp; Tax Doc ID:</th>
                                                    <td>{searchResult ? searchResult[0].Tax_ID : tax.Tax_ID}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row"><i className="bi bi-cash"></i>&nbsp;&nbsp; Taxable Income:</th>
                                                    <td>Rs.{searchResult ? searchResult[0].Taxable_income : tax.Taxable_income}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row"><i className="bi bi-percent"></i>&nbsp;&nbsp; Tax Rate:</th>
                                                    <td>{searchResult ? searchResult[0].Rate : tax.Rate}%</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row"><i className="bi bi-currency-dollar"></i>&nbsp;&nbsp; Income Tax:</th>
                                                    <td>Rs.{searchResult ? searchResult[0].Income_tax : tax.Income_tax}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row"><i className="bi bi-calendar"></i>&nbsp;&nbsp; Due Date:</th>
                                                    <td>{searchResult ? new Date(searchResult[0].Due_date).toLocaleDateString() : new Date(tax.Due_date).toLocaleDateString()}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row"><i className="bi bi-clock"></i>&nbsp;&nbsp; Date created:</th>
                                                    <td>{searchResult ? new Date(searchResult[0].Date_created).toLocaleDateString() : new Date(tax.Date_created).toLocaleDateString()}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row"><i className="bi bi-check-circle"></i>&nbsp;&nbsp; Payment status:</th>
                                                    <td>{searchResult ? searchResult[0].Status : tax.Status}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row"><i className="bi bi-info-circle"></i>&nbsp;&nbsp; Final profit:</th>
                                                    <td>Rs.{searchResult ? searchResult[0].Final_profit : tax.Final_profit}</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <div class="button-container">
                                            <button onclick="window.print()" class="btn btn-primary" style={{ marginLeft: '180px', width: '160px' }}>Edit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column for Cards */}
                            <div className="col-md-6" style={{ marginTop: '-155px', marginLeft: '0px' }}>
                                <div className="row mb-4">
                                    <div className="col-md-6 mb-3">
                                        <div className="card h-100">
                                            <div className="card-body d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h4 className="card-title mb-0">{searchResult ? new Date(searchResult[0].Due_date).toLocaleDateString() : new Date(tax.Due_date).toLocaleDateString()}</h4>
                                                    <p className="card-text">Due Date</p>
                                                </div>
                                                <i className="bi bi-calendar h1 text-primary"></i>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <div className="card h-100">
                                            <div className="card-body d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h4 className="card-title mb-0">Rs.{searchResult ? searchResult[0].Total_tax : tax.Total_tax}</h4>
                                                    <p className="card-text">Total Tax Payable</p>
                                                </div>
                                                <i className="bi bi-info-circle h1 text-success"></i>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="col-md-12 mb-3">
                                        <div className="card" style={{ marginTop: '70px' }}>
                                            <div className="card-body">
                                                <h5 className="card-title">EPF & ETF Calculator</h5>
                                                <div className="mb-3">
                                                    <label htmlFor="salary" className="form-label">Salary for current month</label>
                                                    <input type="number" className="form-control" id="salary" value={totalAmount} onChange={(e) => setSalary(e.target.value)} />
                                                </div>
                                                <button className="btn btn-primary" onClick={calculateEPFETF} disabled={isCalculating}>
                                                    {isCalculating ? 'Calculating...' : 'Calculate'}
                                                </button>
                                                <div className="mt-3">
                                                    {EPF !== 0 && (
                                                        <div>
                                                            <h5 className="mb-3"><strong>EPF:</strong> Rs. {EPF}</h5>
                                                            <h5 className="mb-0"><strong>ETF:</strong> Rs. {ETF}</h5>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TaxDetails;
