import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Layout from './Layout';

function TaxDetails() {
    const { id } = useParams();
    const [tax, setTax] = useState(null);
    const [Income_tax, setIncomeTax] = useState(0);
    const [Rate, setRate] = useState();
    const [profit, setProfit] = useState(null);
    const [totalProfit, setTotalProfit] = useState(0);
    const [searchResult, setSearchResult] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/tax`)
            .then((res) => {
                setTax(res.data.tax);
                setRate(res.data.tax.Rate);
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
                                <td>Date Modified</td>
                                <td>${searchResult ? new Date(searchResult[0].Date_modified).toLocaleDateString() : new Date(tax.Date_modified).toLocaleDateString()}</td>
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

    const submit = (e) => {
        e.preventDefault();
        // Redirect to the page where total amount is fetched for the entered month
        window.location.href = `/dashboard/finance/tax/add`;
    };

    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        const currentMonth = getCurrentMonth();
        axios.get(`http://localhost:8080/profit/${currentMonth}`)
            .then((res) => {
                setTotalAmount(res.data.totalAmount);
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

    const [selectedYear, setSelectedYear] = useState('');

    // Generate options for years (current year and the last 5 years)
    const currentYear = new Date().getFullYear();
    const yearsOptions = Array.from({ length: 6 }, (_, index) => {
        const year = currentYear - index;
        return <option key={index} value={year}>{year}</option>;
    });

    const year = searchResult ? new Date(searchResult[0]?.Date_modified).getFullYear() : new Date(tax?.Date_modified).getFullYear();

    //convert date to readable format
    let endDateString = null;
    if (searchResult && searchResult[0] && searchResult[0].Date_modified) {
        endDateString = new Date(searchResult[0].Date_modified);
    } else if (tax && tax.Date_modified) {
        endDateString = new Date(tax.Date_modified);
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


    const getCurrentYear = () => {
        const currentDate = new Date();
        return currentDate.getFullYear();
    };

    //navigate to profit log
    /* const getCurrentMonthProfitId = async () => {
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
    };*/

   /* const handleClick = async () => {
        const profitId = await getCurrentMonthProfitId();
        if (profitId) {
            window.location.href = `/profit/get/${profitId}`;
        } else {
            console.log('No profit record found for the current and previous months of the current year.');
            // Handle the case where there's no profit record for the current and previous months of the current year
        }
    };

    //navigate to tax doc
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
    };*/

  /*  const handleClickTax = async () => {
        const taxId = await getCurrentTaxId();
        if (taxId) {
            window.location.href = `/tax/get/${taxId}`;
        } else {
            console.log('No profit record found for the current and previous months of the current year.');
            // Handle the case where there's no profit record for the current and previous months of the current year
        }
    };*/

    useEffect(() => {
        let currentYear = getCurrentYear();
        axios.get(`http://localhost:8080/tax/profit/${currentYear}`)
            .then((res) => {
                setTotalProfit(res.data.totalProfit);
            })
            .catch((err) => {
                console.error(err);
            });
        const incomeTax = (totalProfit * Rate) / 100;
        setIncomeTax(incomeTax.toFixed(2));
    });

    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setDateTime(new Date());
        }, 1000); // Update every second

        // Cleanup function
        return () => clearInterval(timer);
    }, []);

    // Format the date and time
    const formattedDate = dateTime.toLocaleDateString();
    const formattedTime = dateTime.toLocaleTimeString();

    return (
        <Layout>
            <div className="container">
                {/*Breadcrumb for tax doc*/}

                <div className="row">
                    <div className="col-md-8">
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="/finance">Finance Dashboard</a></li>
                                <li class="breadcrumb-item active" aria-current="page">Tax Document</li>
                            </ol>
                        </nav>

                    </div>
                    <div className="col-md-4 d-flex justify-content-end">
                        <p>{formattedDate} | {formattedTime}</p>
                    </div>
                </div>
                {/* Main Content */}
                <div className="row mb-2">
                    <div className="row align-items-center mb-4">
                        <div className="col-md-7">
                            <h2 className="mb-4" style={{ marginTop: '10px' }}><i className="fas fa-chart-line"></i> Tax Document {(searchResult || tax) && `- ${year}`}</h2>
                        </div>
                        <div className="col-md-5 d-flex justify-content-end align-items-center">
                            <div className="col-md-6 me-3">
                                <select id="year" className="form-control" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                                    <option value="">Select Year</option>
                                    {yearsOptions}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <button className="btn btn-outline-primary" onClick={handleSearch} onKeyDown={handleKeyDown}><i className="ri-search-line"></i>  Search Tax Document</button>
                            </div>
                        </div>
                    </div>

                    {/* Summary of tax details */}
                    {tax && (
                        <div className="row justify-content-center">
                            <div className="row">
                                <div className="col-lg-4 col-md-6 mb-3">
                                    <div className="card" style={{ background: 'white', minWidth: '250px' }}>
                                        <div className="card-body d-flex justify-content-between align-items-center">
                                            <div className="card-body">
                                                <h2 className="card-title">{new Date(tax.Due_date).toLocaleDateString()}</h2>
                                                <p className="card-text" style={{ marginTop: '35px' }}>Due Date</p>
                                            </div>
                                            <i className="bi bi-calendar h1" style={{ marginRight: '15px', fontSize: '2.5rem' }}></i>
                                        </div>
                                        <div className="card-footer bg-transparent border-top-0">
                                            <div className="progress" style={{ height: '10px', marginTop: '-25px' }}>
                                                <div className="progress-bar" role="progressbar" style={{ backgroundColor: 'orange', width: '50%' }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-4 col-md-6 mb-3">
                                    <div className="card" style={{ background: 'white', minWidth: '250px' }}>
                                        <div className="card-body d-flex justify-content-between align-items-center">
                                            <div className="card-body">
                                                <h2 className="card-title">Rs.{Income_tax}</h2>
                                                <p className="card-text" style={{ marginTop: '35px' }}>Tax Payable</p>
                                            </div>
                                            <i className="bi bi-file-earmark-text h1" style={{ marginRight: '15px', fontSize: '2.5rem' }}></i>
                                        </div>
                                        <div className="card-footer bg-transparent border-top-0">
                                            <div className="progress" style={{ height: '10px', marginTop: '-25px' }}>
                                                <div className="progress-bar" role="progressbar" style={{ backgroundColor: 'orange', width: '50%' }} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-4 col-md-6 mb-3">
                                    <div className="card" style={{ background: 'white', minWidth: '250px' }}>
                                        <div className="card-body d-flex justify-content-between align-items-center">
                                            <div className="card-body">
                                                <h2 className="card-title">Rs.{(totalProfit - Income_tax).toFixed(2)}</h2>
                                                <p className="card-text" style={{ marginTop: '35px' }}>Final Profit</p>
                                            </div>
                                            <i className="bi bi-cash-stack h1" style={{ marginRight: '15px', fontSize: '2.5rem' }}></i>
                                        </div>
                                        <div className="card-footer bg-transparent border-top-0">
                                            <div className="progress" style={{ height: '10px', marginTop: '-25px' }}>
                                                <div className="progress-bar" role="progressbar" style={{ backgroundColor: 'orange', width: '50%' }} aria-valuenow="90" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}

                </div>

                {/* Search bar for tax doc */}
                <div className="container-fluid" style={{ marginTop: '15px' }}>
                    <div className="container mt-3" style={{ marginTop: '10px' }}>
                        {/* Generate tax Report */}
                        <div className='row'>
                            <div className="col-lg-6 col-md-12 mb-3">
                                <div className="card" style={{ height: '160px' }}>
                                    <div className="card-body">
                                        <h5 className="card-title">Generate Annual Tax Report</h5>
                                        <p className="card-text">Click the button below to generate a report for the annual tax report.</p>
                                        <button className="btn btn-dark mb-3" onClick={handleReportGeneration} style={{ marginTop: '10px', width: '200px' }}><i className="bi bi-file-earmark-bar-graph"></i>  Generate Report</button>
                                    </div>
                                </div>
                            </div>

                            {/* Button to add new tax doc */}
                            <div className="col-lg-6 col-md-12 mb-3">
                                <div className="card" style={{ height: '160px' }}>
                                    <div className="card-body">
                                        <form onSubmit={submit}>
                                            <h5>Add New Tax Document</h5>
                                            <p className="card-text">You can create a tax document to keep track of the tax details.</p>
                                            <div className="row mb-3">
                                                <div className="col">
                                                    <div className="btn-group">
                                                        <button type="submit" className="btn btn-dark mb-3" style={{ marginTop: '10px', width: '200px' }}><i className="ri-add-line"></i>  Add Tax Document</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Display tax details for searched year */}
                    {(searchResult || tax) && (
                        <div className="row">
                            {/* Left Column for tax Details */}
                            <div className="col-md-12">
                                <div className="card" style={{ marginBottom: '40px' }}>
                                    <div className="card-body">
                                        <h4 className="mb-3">Valid Period: January 1, {year} - {endDateFormatted}</h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '30px' }}>
                                            <div className="custom-card col-md-4" style={{ padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff' }}>
                                                <div style={{ fontWeight: 'bold' }}><i className="bi bi-file-earmark-text"></i> Tax Doc ID:</div>
                                                <div style={{ fontStyle: 'italic' }}>{searchResult ? searchResult[0].Tax_ID : tax.Tax_ID}</div>
                                            </div>
                                            <div className="custom-card col-md-4" style={{ padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff' }}>
                                                <div style={{ fontWeight: 'bold' }}><i className="bi bi-cash"></i> Taxable Income:</div>
                                                <div style={{ fontStyle: 'italic' }}>Rs.{searchResult ? searchResult[0].Taxable_income.toFixed(2) : tax.Taxable_income.toFixed(2)}</div>
                                            </div>
                                            <div className="custom-card col-md-3" style={{ padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff' }}>
                                                <div style={{ fontWeight: 'bold' }}><i className="bi bi-cash-coin"></i> Tax Rate:</div>
                                                <div style={{ fontStyle: 'italic' }}>{searchResult ? searchResult[0].Rate : tax.Rate}%</div>
                                            </div>
                                            <div className="custom-card col-md-4" style={{ padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff' }}>
                                                <div style={{ fontWeight: 'bold' }}><i className="bi bi-currency-dollar"></i> Income Tax:</div>
                                                <div style={{ fontStyle: 'italic' }}>Rs.{searchResult ? searchResult[0].Income_tax.toFixed(2) : tax.Income_tax.toFixed(2)}</div>
                                            </div>
                                            <div className="custom-card col-md-4" style={{ padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff' }}>
                                                <div style={{ fontWeight: 'bold' }}><i className="bi bi-calendar"></i> Due Date:</div>
                                                <div style={{ fontStyle: 'italic' }}>{searchResult ? new Date(searchResult[0].Due_date).toLocaleDateString() : new Date(tax.Due_date).toLocaleDateString()}</div>
                                            </div>
                                            <div className="custom-card col-md-3" style={{ padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff' }}>
                                                <div style={{ fontWeight: 'bold' }}><i className="bi bi-clock"></i> Date modified:</div>
                                                <div style={{ fontStyle: 'italic' }}>{searchResult ? new Date(searchResult[0].Date_modified).toLocaleDateString() : new Date(tax.Date_modified).toLocaleDateString()}</div>
                                            </div>
                                            <div className="custom-card col-md-4" style={{ padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff' }}>
                                                <div style={{ fontWeight: 'bold' }}><i className="bi bi-check-circle"></i> Payment status:</div>
                                                <div style={{ fontStyle: 'italic' }}>{searchResult ? searchResult[0].Status : tax.Status}</div>
                                            </div>
                                            <div className="custom-card col-md-4" style={{ padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff' }}>
                                                <div style={{ fontWeight: 'bold' }}><i className="bi bi-info-circle"></i> Final profit:</div>
                                                <div style={{ fontStyle: 'italic' }}>Rs.{searchResult ? searchResult[0].Final_profit.toFixed(2) : tax.Final_profit.toFixed(2)}</div>
                                            </div>
                                        </div>
                                        <div className="button-container text-center" style={{ marginTop: '25px' }}>
                                            <Link to={`/dashboard/finance/tax/update/${tax.Tax_ID}`} className="btn btn-outline-primary me-2" style={{ width: '160px' }}><i className="ri-edit-line"></i>  Edit</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default TaxDetails;
