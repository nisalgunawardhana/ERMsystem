import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from "react-router-dom";
import { Modal, Button, Pagination } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';

export default function AllOther() {

    const [other, setOther] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalMonth, setTotalMonth] = useState(0);
    const [average, setAverage] = useState(0);
    const [filteredOther, setFilteredOther] = useState([]); // State to hold filtered data
    const [searchTerm, setSearchTerm] = useState('');
    const [filterMonth, setFilterMonth] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [filterType, setFilterType] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [costError, setCostError] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [reportButtonClicked, setReportButtonClicked] = useState(false);

    //function to get all expenses
    useEffect(() => {
        function getOther() {
            axios.get("http://localhost:8080/otherExpense/").then((res) => {
                setOther(res.data);
            }).catch((err) => {
                alert(err.message);
            })
        }
        getOther();
    }, [])

    useEffect(() => {
        axios.get(`http://localhost:8080/otherExpense/get/other/total`)//fetch current year total amount of expenses
            .then((res) => {
                setTotal(res.data.totalAmount);
            })
            .catch((err) => {
                console.error(err);
            });
        axios.get(`http://localhost:8080/otherExpense/get/other/month`)//fetch current monthly amount of other expenses
            .then((res) => {
                setTotalMonth(res.data.totalAmount);
            })
            .catch((err) => {
                console.error(err);
            });
        axios.get(`http://localhost:8080/otherExpense/get/other/average`)//fetch average monthly amount of expenses
            .then((res) => {
                setAverage(res.data.averageMonthlyExpense);
            })
            .catch((err) => {
                console.error(err);
            });
    });

    const getMonthName = (monthNumber) => {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return monthNames[parseInt(monthNumber) - 1]; // Subtracting 1 because month numbers are zero-based
    };

    //report generation of expenses
    const handleGenerate = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setReportButtonClicked(false);
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const handleReportGeneration = () => {
        if (!selectedMonth || !selectedYear) {
            setReportButtonClicked(true); // Set the state when the button is clicked without selecting both month and year
            return;
        }
        setShowModal(false);
        const expensesInSelectedMonthAndYear = other.filter(expense => {
            const expenseDate = new Date(expense.Date);
            const expenseMonth = expenseDate.getMonth() + 1; // Months are zero-based, so adding 1
            const expenseYear = expenseDate.getFullYear();
            return expenseMonth.toString() === selectedMonth && expenseYear.toString() === selectedYear;
        });
        generateReport(expensesInSelectedMonthAndYear);
        setSelectedMonth('');
        setSelectedYear('');
        setReportButtonClicked(false);
    };

    const generateReport = (expensesInSelectedMonth) => {
        const monthName = getMonthName(selectedMonth);
        const header = `
            <html>
                <head>
                    <title>Expense Report</title>
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
                    <h1>Expense Report</h1>
                    <h2>${monthName} ${selectedYear}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Expense ID</th>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Cost</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        const rows = expensesInSelectedMonth.map(expense => `
                            <tr>
                                <td>${expense.Expense_id}</td>
                                <td>${expense.Type}</td>
                                <td>${new Date(expense.Date).toLocaleDateString()}</td>
                                <td>${expense.Status}</td>
                                <td>${expense.Cost}</td>
                            </tr>
        `);

        const footer = `
                        </tbody>
                    </table>
                    <div class="button-container">
                        <button onclick="window.print()" class="btn btn-primary">Print</button>
                        <button onclick="downloadPDF()" class="btn btn-primary">Download PDF</button>
                        <button onclick="window.close()" class="btn btn-secondary">Close</button>
                    </div>
                </body>
            </html>
        `;

        const pdfContent = header + rows.join('') + footer;

        const printWindow = window.open("", "_blank", "width=600,height=600");
        printWindow.document.write(pdfContent);
        printWindow.document.close();

        printWindow.downloadPDF = () => {
            const pdfBlob = new Blob([pdfContent], { type: "application/pdf" });
            const pdfUrl = URL.createObjectURL(pdfBlob);
            const a = document.createElement("a");
            a.href = pdfUrl;
            a.download = "otherExpenses_report.pdf";
            a.click();
            URL.revokeObjectURL(pdfUrl);
            printWindow.close();
        };
    };

    const [expenseData, setExpenseData] = useState({
        Expense_id: '',
        Type: '',
        Date: '',
        Status: '',
        Cost: ''
    });

    const fetchLatestId = async () => {
        try {
            const response = await axios.get("http://localhost:8080/otherExpense/getId/latest");
            setExpenseData({ ...expenseData, Expense_id: response.data.nextId });
        } catch (error) {
            console.error("Error fetching latest Expense ID:", error);
            alert("Error fetching latest Expense ID. Please try again later.");
        }
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleShow = () => {
        setIsOpen(true);
        fetchLatestId();
    };

    useEffect(() => {
        const getCurrentDate = () => {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            setExpenseData({ ...expenseData, Date: formattedDate });
        };

        getCurrentDate();
    }, []); // Run only once after the component mount

    const handleChanges = (e) => {
        const { name, value } = e.target;
        setExpenseData({ ...expenseData, [name]: value });
    };

    //function to add new expense
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const costRegex = /^[0-9]+(\.[0-9]{1,2})?$/; // Only integers or double values allowed (up to 2 decimal places)

            // Validate input for "Cost" field
            if (!costRegex.test(expenseData.Cost)) {
                // If the input is invalid, update the error message
                setCostError('Invalid input. Only numerical values allowed (up to 2 decimal places).');
                return;
            } else {
                setCostError(''); // Clear any existing error
            }

            // If there are no errors, submit the form or perform any further action
            const res = await axios.post("http://localhost:8080/otherExpense/add/check", expenseData);
            if (res.status === 200) {
                await axios.post("http://localhost:8080/otherExpense/add", expenseData);
                setIsOpen(false);
                setTimeout(() => {
                    // Display success toast message
                    toast.success('Expense added successfully!');
                }, 2000);
                setExpenseData({
                    Expense_id: '',
                    Date: expenseData.Date,
                    Type: '',
                    Status: '',
                    Cost: ''
                });
                const response = await axios.get("http://localhost:8080/otherExpense/");
                setOther(response.data);
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const confirmAdd = window.confirm("Expense already exists. Do you still want to add it?");
                if (confirmAdd) {
                    await axios.post("http://localhost:8080/otherExpense/add", expenseData);
                    setTimeout(() => {
                        // Display success toast message
                        toast.success('Expense added successfully!');
                    }, 2000);
                    setIsOpen(false);
                    setExpenseData({
                        Expense_id: '',
                        Date: expenseData.Date,
                        Type: '',
                        Status: '',
                        Cost: ''
                    });
                    const response = await axios.get("http://localhost:8080/otherExpense/");
                    setOther(response.data);
                } else {
                    // User canceled adding the expense
                    console.log("Expense addition canceled by the user.");
                }
            } else {
                console.error("Error:", error);
                // Handle other errors, such as network errors or server errors
            }
        }
    };

    useEffect(() => {
        function getOther() {
            const url = searchTerm ? `http://localhost:8080/otherExpense/?search=${searchTerm}` : "http://localhost:8080/otherExpense/";
            axios.get(url)
                .then((res) => {
                    setOther(res.data);
                    setFilteredOther(res.data);
                })
                .catch((err) => {
                    alert(err.message);
                })
        }
        getOther();
    }, [searchTerm]);

    //function to filter expenses by type, month and year
    useEffect(() => {
        let filteredData = other.filter(entry => {
            const entryDate = new Date(entry.Date);
            const entryMonth = entryDate.getMonth() + 1;
            const entryYear = entryDate.getFullYear();
            return entry.Expense_id.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (filterMonth === '' || entryMonth === parseInt(filterMonth)) &&
                (filterYear === '' || entryYear === parseInt(filterYear)) &&
                (filterType === '' || entry.Type === filterType);
        });
        setFilteredOther(filteredData);
    }, [searchTerm, filterMonth, filterYear, filterType, other]);

    useEffect(() => {
        function getOther() {
            const url = searchTerm ? `http://localhost:8080/otherExpense/?search=${searchTerm}` : "http://localhost:8080/otherExpense/";
            axios.get(url)
                .then((res) => {
                    setOther(res.data);
                    setFilteredOther(res.data);
                })
                .catch((err) => {
                    alert(err.message);
                })
        }
        getOther();
    }, []);

    const [expenseToDelete, setExpenseToDelete] = useState(null);
    const [showDeletePrompt, setShowDeletePrompt] = useState(false);

    const handleDelete = async (id) => {
        setExpenseToDelete(id);
        setShowDeletePrompt(true);
    };

    //function to delete expense
    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/otherExpense/delete/${expenseToDelete}`);
            setShowDeletePrompt(false);
            setTimeout(() => {
                // Display success toast message
                toast.success('Expense deleted successfully!');
            }, 2000);
            // Update the state to reflect the deletion
            setOther(other.filter(expense => expense._id !== expenseToDelete));
        } catch (error) {
            console.error("Error deleting expense:", error);
            alert("Error deleting expense. Please try again later.");
        }
        setShowDeletePrompt(false);
    };

    const cancelDelete = () => {
        setShowDeletePrompt(false);
    };

    const [month, setMonth] = useState({ Month: '' });

    const submit = (e) => {
        e.preventDefault();
        // Redirect to the page where total amount is fetched for the entered month
        window.location.href = `/profit/${month.Month}`;
    };

    const columns = [
        { field: 'Expense_id', label: 'Expense ID', sortable: true },
        { field: 'Type', label: 'Type', sortable: false },
        { field: 'Date', label: 'Date', sortable: true },
        { field: 'Status', label: 'Status', sortable: false },
        { field: 'Cost', label: 'Cost', sortable: true },

    ];

    const [sortConfig, setSortConfig] = useState(null);

    useEffect(() => {
        // Function to filter data based on search term
        const filteredData = other.filter(entry =>
            Object.values(entry).some(value =>
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredOther(filteredData);
    }, [searchTerm, other]); // Trigger filtering whenever search term or original data changes

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const sortedData = () => {
        if (!sortConfig) return filteredOther;
        return [...filteredOther].sort((a, b) => {
            const aValue = a[sortConfig.field];
            const bValue = b[sortConfig.field];

            // Check if the values are not strings
            if (typeof aValue !== 'string' || typeof bValue !== 'string') {
                // Handle comparison for non-string values (e.g., Date)
                return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
            }

            // Use localeCompare for string values
            return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        });
    };

    useEffect(() => {
        // Function to filter data based on search term, month, year, and type
        let filteredData = other.filter(entry => {
            const entryDate = new Date(entry.Date);
            const entryMonth = entryDate.getMonth() + 1; // Adding 1 because getMonth returns 0-based index
            const entryYear = entryDate.getFullYear();
            return entry.Expense_id.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (filterMonth === '' || entryMonth === parseInt(filterMonth)) &&
                (filterYear === '' || entryYear === parseInt(filterYear)) &&
                (filterType === '' || entry.Type === filterType);
        });
        setFilteredOther(filteredData);
    }, [searchTerm, filterMonth, filterYear, filterType, other]);

    const handleFilterMonthChange = (e) => {
        setFilterMonth(e.target.value);
    };

    const handleFilterYearChange = (e) => {
        setFilterYear(e.target.value);
    };

    const handleFilterTypeChange = (e) => {
        setFilterType(e.target.value);
    };

    const months = [
        { value: '1', label: 'January' },
        { value: '2', label: 'February' },
        { value: '3', label: 'March' },
        { value: '4', label: 'April' },
        { value: '5', label: 'May' },
        { value: '6', label: 'June' },
        { value: '7', label: 'July' },
        { value: '8', label: 'August' },
        { value: '9', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' }
    ];

    const years = [
        { value: '2022', label: '2022' },
        { value: '2023', label: '2023' },
        { value: '2024', label: '2024' } // Assuming you have data for 2024
        // Add more years as needed
    ];

    const expenseTypes = [...new Set(other.map(entry => entry.Type))];

    const handleResetFilters = () => {
        setFilterMonth('');
        setFilterYear('');
        setFilterType('');
    };

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [expensesPerPage] = useState(6); // Change this number based on your preference

    // Get current expenses
    const indexOfLastExpense = currentPage * expensesPerPage;
    const indexOfFirstExpense = indexOfLastExpense - expensesPerPage;
    const currentExpenses = sortedData().slice(indexOfFirstExpense, indexOfLastExpense);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

    return (
        <div className="container" >
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
                        className="nav-link active"
                        id="contact-tab0"
                        to="/otherExpense"
                        role="tab"
                        aria-controls="contact"
                        aria-selected="false"
                        style={{ borderBottom: '2px solid #007bff', borderTop: 'none' }}
                    >
                        <i className="bi bi-wallet"></i> Other Expenses
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
            {/*Breadcrumb*/}
            <nav aria-label="breadcrumb" style={{ marginTop: '20px' }}>
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="/">Home</a></li>
                    <li class="breadcrumb-item"><a href="/finance">Finance Dashboard</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Other Expenses</li>
                </ol>

                <Toaster />
            </nav>

            <div className="row mb-2" style={{ marginTop: '40px' }}>
                <div className="d-flex justify-content-start mb-3 align-items-center">
                    <h3 className="me-5">All Other Expenses</h3>
                    <div className="d-flex flex-wrap align-items-center">
                        <button className="btn btn-success mb-2 mb-md-0 mr-4 mr-sm-2" style={{ marginRight: '25px' }} onClick={handleShow}>Add Expense</button>
                        {/* Add expense button */}
                        <Button className="ml-4 ml-sm-2" onClick={handleGenerate}>Generate Report</Button>
                    </div>

                    <div>
                        <Modal style={{ marginTop: '70px' }} show={showModal} onHide={handleCloseModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>Select Month and Year</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {reportButtonClicked && (!selectedMonth || !selectedYear) && (
                                    <div className="alert alert-danger" role="alert">
                                        Please select both month and year.
                                    </div>
                                )}
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="month" className="form-label">Select Month:</label>
                                        <select id="month" className="form-select" value={selectedMonth} onChange={handleMonthChange} required>
                                            <option value="">Select Month</option>
                                            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                                <option key={month} value={month}>{getMonthName(month)}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="year" className="form-label">Select Year:</label>
                                        <select id="year" className="form-select" value={selectedYear} onChange={handleYearChange} required>
                                            <option value="">Select Year</option>
                                            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                                <Button variant="primary" onClick={handleReportGeneration}>Generate Report</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
                <div className="container mt-3">
                    <div className="row justify-content-center">
                        <div className="col-lg-4 col-md-6 mb-3">
                            {/* Current year Total amount of expenses*/}
                            <div className="card mb-3" style={{ background: 'linear-gradient(to right, #493240, #f09)', color: '#fff' }}>
                                <div className="card-body d-flex justify-content-between align-items-center">
                                    <div className="card-body">
                                        <h2 className="card-title">Rs.{total}</h2>
                                        <p className="card-text" style={{ marginTop: '35px' }}>Current Year Expenses</p>
                                    </div>
                                    <i className="bi bi-cash h1" style={{ marginTop: '-20px', marginRight: '20px', fontSize: '3.5rem' }}></i>
                                </div>
                                <div className="card-footer bg-transparent border-top-0">
                                    <div className="progress" style={{ height: '10px', marginBottom: '20px', width: '80%', marginLeft: '10px', marginTop: '-25px' }}>
                                        <div className="progress-bar" role="progressbar" style={{ backgroundColor: '#b2beb5', width: '50%' }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*Current month expenses amount*/}
                        <div className="col-lg-4 col-md-6 mb-3">
                            <div className="card mb-3" style={{ background: 'linear-gradient(to right, #0a504a, #38ef7d)', color: '#fff' }}>
                                <div className="card-body d-flex justify-content-between align-items-center">
                                    <div className="card-body">
                                        <h2 className="card-title">Rs.{totalMonth}</h2>
                                        <p className="card-text" style={{ marginTop: '35px' }}>Current Month Expenses</p>
                                    </div>
                                    <i className="bi bi-calendar3 h1" style={{ marginTop: '-20px', marginRight: '20px', fontSize: '2.5rem' }}></i>
                                </div>
                                <div className="card-footer bg-transparent border-top-0">
                                    <div className="progress" style={{ height: '10px', marginBottom: '20px', width: '80%', marginLeft: '10px', marginTop: '-25px' }}>
                                        <div className="progress-bar" role="progressbar" style={{ backgroundColor: '#b2beb5', width: '75%' }} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*Average monthly expense amount*/}
                        <div className="col-lg-4 col-md-6 mb-3">
                            <div className="card mb-3" style={{ background: 'linear-gradient(to right, #a86008, #ffba56)', color: '#fff' }}>
                                <div className="card-body d-flex justify-content-between align-items-center">
                                    <div className="card-body">
                                        <h2 className="card-title">Rs.{average}</h2>
                                        <p className="card-text" style={{ marginTop: '35px' }}>Average Monthly Expenses</p>
                                    </div>
                                    <i className="bi bi-graph-up" style={{ marginTop: '-20px', marginRight: '20px', fontSize: '2.5rem' }}></i>
                                </div>
                                <div className="card-footer bg-transparent border-top-0">
                                    <div className="progress" style={{ height: '10px', marginBottom: '20px', width: '90%', marginLeft: '10px', marginTop: '-25px' }}>
                                        <div className="progress-bar" role="progressbar" style={{ backgroundColor: '#b2beb5', width: '30%' }} aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                {/*Search bar*/}
                <div className="col" style={{ marginTop: '20px' }}>
                    <input type="text" className="form-control" value={searchTerm} onChange={handleSearchChange} placeholder="Search..." />
                </div>

            </div>
            {/*Filters for expenses*/}
            <div className="d-flex justify-content-start mb-3 align-items-center">
                <div className="col" style={{ marginTop: '20px', marginRight: '10px' }}>
                    <select className="form-select" value={filterMonth} onChange={handleFilterMonthChange}>
                        <option value="">All Months</option>
                        {months.map(month => (
                            <option key={month.value} value={month.value}>{month.label}</option>
                        ))}
                    </select>
                </div>
                <div className="col" style={{ marginTop: '20px', marginRight: '10px' }}>
                    <select className="form-select" value={filterYear} onChange={handleFilterYearChange}>
                        <option value="">All Years</option>
                        {years.map(year => (
                            <option key={year.value} value={year.value}>{year.label}</option>
                        ))}
                    </select>
                </div>
                <div className="col" style={{ marginTop: '20px', marginRight: '10px' }}>
                    <select className="form-select" value={filterType} onChange={handleFilterTypeChange}>
                        <option value="">All Types</option>
                        {expenseTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <button className="btn btn-secondary" style={{ marginTop: '20px' }} onClick={handleResetFilters}>Reset</button>
            </div>

            {/*All expenses*/}
            <div style={{ marginTop: '20px' }}>
                <div className="container">
                    <div className="row">
                        {currentExpenses.map(expense => (
                            <div key={expense._id} className="col-md-4 mb-4">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title"><i class="bi bi-card-list"></i>  Expense ID: {expense.Expense_id}</h5>
                                        <p className="card-text"><i class="bi bi-chat-left-text"></i>  Type: {expense.Type}</p>
                                        <p className="card-text"><i class="bi bi-calendar3"></i>  Date: {expense.Date ? expense.Date.split('T')[0] : ''}</p>
                                        <p className="card-text"><i class="bi bi-check-circle"></i>  Status: {expense.Status}</p>
                                        <p className="card-text"><i class="bi bi-currency-dollar"></i>  Cost: Rs.{expense.Cost}</p>
                                        <div className="btn-group">
                                            <Link to={`/otherExpense/update/${expense._id}`} className="btn btn-success me-2">
                                                <i className="bi bi-pencil-fill"></i> Update {/*Update button*/}
                                            </Link>
                                            <button className="btn btn-danger" onClick={() => handleDelete(expense._id)}>
                                                <i className="bi bi-trash-fill"></i> Delete {/*Delete button*/}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="d-flex justify-content-center">
                        <Pagination>
                            <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                            {[...Array(Math.ceil(sortedData().length / expensesPerPage)).keys()].map(number => (
                                <Pagination.Item key={number + 1} onClick={() => paginate(number + 1)} active={number + 1 === currentPage}>
                                    {number + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(sortedData().length / expensesPerPage)} />
                        </Pagination>
                    </div>
                </div>

                {/*Modal to confirm expense deletion*/}
                {showDeletePrompt && (
                    <Modal show={showDeletePrompt} onHide={cancelDelete}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Deletion</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Are you sure you want to delete this expense?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={confirmDelete}>Yes</Button>
                            <Button variant="secondary" onClick={cancelDelete}>No</Button>
                        </Modal.Footer>
                    </Modal>
                )}
            </div>
            {/*Modal to add expense*/}
            <div className="modal-backdrop" style={{ display: isOpen ? 'block' : 'none', backdropFilter: isOpen ? 'blur(5px)' : 'none' }}></div>
            <Modal show={isOpen} onHide={handleClose} style={{ marginTop: '60px' }}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Expense</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        {/* Form fields */}
                        <div className="mb-3">
                            <label htmlFor="id" className="form-label"><i class="bi bi-card-list"></i>  Expense ID</label>
                            <input type="text" className="form-control" id="id" name="Expense_id" value={expenseData.Expense_id} onChange={handleChanges} readOnly required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="type" className="form-label"><i class="bi bi-chat-left-text"></i>  Type of Expense</label>
                            <select className="form-select" id="type" name="Type" value={expenseData.Type} onChange={handleChanges} required>
                                <option value="">Select Type</option>
                                <option value="Transportation">Transportation</option>
                                <option value="Construction">Construction</option>
                                <option value="Repair">Repair</option>
                                <option value="Utilities">Utilities</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="date" className="form-label"><i class="bi bi-calendar3"></i>  Date</label>
                            <input type="date" className="form-control" id="date" name="Date" value={expenseData.Date} onChange={handleChanges} required readOnly />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="status" className="form-label"><i class="bi bi-check-circle"></i>  Payment Status</label>
                            <input type="text" className="form-control" id="status" name="Status" value={expenseData.Status} onChange={handleChanges} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="cost" className="form-label"><i class="bi bi-currency-dollar"></i>  Amount (Rs.)</label>
                            <input type="text" className="form-control" id="cost" name="Cost" value={expenseData.Cost} onChange={handleChanges} required />
                            {costError && <div className="text-danger">{costError}</div>}
                        </div>

                        {/* Submit button */}
                        <button type="submit" className="btn btn-primary" style={{ marginLeft: '180px' }}>Submit</button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    )
}
/*linear-gradient(to right, rgba(0, 123, 255, 0.8), rgba(255, 0, 123, 0.8))*/