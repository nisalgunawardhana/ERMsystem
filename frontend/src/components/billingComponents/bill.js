import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from "react-router-dom";
import BillPreviewModal from './Billpmodel';
import Layout from '../Layout';
import { Modal, Button, Form } from 'react-bootstrap';
import { Toaster, toast } from 'react-hot-toast';


export default function Bills() {

    const [bill, setbill] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBill, setSelectedBill] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const billsPerPage = 10;
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [showDeleteAllConfirmation, setShowDeleteAllConfirmation] = useState(false);
    const [secretCode, setSecretCode] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentDateTime, setCurrentDateTime] = useState('');
    const [dateRangeSelected, setDateRangeSelected] = useState(false);
    // Define a state to control the visibility of the report modal
    const [showReportModal, setShowReportModal] = useState(false);

    // Define a state to hold the generated report content
    const [reportContent, setReportContent] = useState('');



    useEffect(() => {
        function getbill() {
            axios.get("http://localhost:8080/bills/").then((res) => {
                setbill(res.data);
            }).catch((err) => {
                alert(err.message);
            })
        }

        function getTotalAmount() {
            axios.get("http://localhost:8080/profit/get/bills/total")
                .then((res) => {
                    setTotalAmount(res.data.totalAmount);
                })
                .catch((err) => {
                    alert(err.message);
                })
        }

        getbill();
        getTotalAmount();

        const intervalId = setInterval(() => {
            const now = new Date();
            setCurrentDateTime(now.toLocaleString());
        }, 1000);

        // Cleanup interval
        return () => clearInterval(intervalId);
    }, [])

    const handleOpenDeleteConfirmation = (id) => {
        setDeleteItemId(id);
        setShowDeleteConfirmation(true);
    };

    const handleCloseDeleteConfirmation = () => {
        setShowDeleteConfirmation(false);
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:8080/bills/delete/${id}`)
            .then(() => {
                setShowDeleteConfirmation(false);
                setbill(prevBill => prevBill.filter(b => b._id !== id));

                // Calculate the new total amount after deleting the bill
                const newTotalAmount = totalAmount - bill.find(b => b._id === id).total_amount;
                setTotalAmount(newTotalAmount);
                toast.success("Bill deleted successfully!");
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const generateReport = () => {
        if (!startDate || !endDate) {
            setShowModal(true);
            if (dateRangeSelected) {
                toast.error("Please select both start and end dates before generating the report.");
            }
            setDateRangeSelected(true)
            return;
        }

        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        setShowModal(false);

        const filteredBills = bill.filter(b => {
            const billingDate = new Date(b.billing_date);
            return billingDate >= startDateObj && billingDate <= endDateObj;
        });

        const reportHtml = `
       <html>
<head>
    <title>Bills Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
        }

        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 20px;
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

        .report-container {
            max-width: 800px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .total-amount {
            margin-top: 20px;
            font-weight: bold;
        }
    </style>
</head>
<body>
<div class="report-container">
    <h1>Bills Report (${startDateObj.toLocaleDateString()} to ${endDateObj.toLocaleDateString()})</h1>
    <table>
        <thead>
        <tr>
            <th>Customer ID</th>
            <th>Billing Date</th>
            <th>Total Amount</th>
        </tr>
        </thead>
        <tbody>
        ${filteredBills.map(bill => `
            <tr>
                <td>${bill.customer_id}</td>
                <td>${bill.billing_date}</td>
                <td>${bill.total_amount.toFixed(2)}</td>
            </tr>
        `).join('')}
        </tbody>
    </table>
    <div class="total-amount">Total Amount: ${filteredBills.reduce((total, b) => total + b.total_amount, 0).toFixed(2)}</div>
</div>
</body>
</html>
    `;

        setShowReportModal(false);
        setDateRangeSelected(false);
        setReportContent(reportHtml);
        setShowReportModal(true);
        // Update startDate and endDate states
        setStartDate(startDateObj);
        setEndDate(endDateObj);
    };


    // Function to close the report modal
    const closeReportModal = () => {
        // Reset the startDate, endDate, and reportContent states
        setStartDate(null);
        setEndDate(null);
        setReportContent('');
        setShowReportModal(false);
    };

    const printReport = () => {
        const iframe = document.querySelector('iframe');
        if (iframe) {
            const iframeWindow = iframe.contentWindow;
            iframeWindow.focus();
            iframeWindow.print();
        }
        closeReportModal();
    };


    const handlePreview = (selectedBill) => {
        setSelectedBill(selectedBill);
        setShowPreviewModal(true);
    };




    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
    };

    const filteredBills = bill.filter(bills =>
        bills.customer_id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!startDate || new Date(bills.billing_date) >= new Date(startDate)) &&
        (!endDate || new Date(bills.billing_date) <= new Date(endDate))
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        const updatedBill = bill.map(b => ({ ...b, selected: !selectAll }));
        setbill(updatedBill);
    };

    const handleSelectBill = (billId) => {
        const updatedBill = bill.map(b => {
            if (b._id === billId) {
                return { ...b, selected: !b.selected };
            }
            return b;
        });
        setbill(updatedBill);
    };


    const indexOfLastBill = currentPage * billsPerPage;
    const indexOfFirstBill = indexOfLastBill - billsPerPage;
    const currentBills = filteredBills.slice(indexOfFirstBill, indexOfLastBill);

    const totalPages = Math.ceil(filteredBills.length / billsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // Function to handle opening delete all confirmation modal
    const handleOpenDeleteAllConfirmation = () => {
        const selectedBills = bill.filter(b => b.selected);
        if (selectedBills.length > 0) {
            setShowDeleteAllConfirmation(true);
        } else {
            // If no bills are selected, show toast message
            toast.error("No bills selected for deletion.");
        }
    };

    // Function to close delete all confirmation modal
    const handleCloseDeleteAllConfirmation = () => {
        setShowDeleteAllConfirmation(false);
    };

    const resetSecretCode = () => {
        setSecretCode('');
    };
    // Function to delete all selected bills

    const handleDeleteAllSelected = () => {


        // Define the actual secret code
        const actualSecretCode = '1111';

        // Verify the secret code
        if (secretCode === actualSecretCode) {
            toast.promise(
                new Promise((resolve, reject) => {
                    const selectedBills = bill.filter(b => b.selected).map(b => b._id);
                    if (selectedBills.length > 0) {
                        Promise.all(selectedBills.map(id => axios.delete(`http://localhost:8080/bills/delete/${id}`)))
                            .then(() => {
                                resolve("Bills deleted successfully!");
                                setbill(prevBills => prevBills.filter(b => !b.selected));
                                // Calculate the new total amount after deleting the selected bills
                                const newTotalAmount = totalAmount - bill.filter(b => b.selected).reduce((total, b) => total + b.total_amount, 0);
                                setTotalAmount(newTotalAmount);
                                resetSecretCode();
                            })
                            .catch((err) => {
                                reject(err.message);
                            });
                    } else {
                        reject("No bills selected for deletion.");
                    }
                }),
                {
                    loading: 'Deleting...',
                    success: (msg) => {
                        handleCloseDeleteAllConfirmation();
                        return msg;
                    },
                    error: (err) => {
                        handleCloseDeleteAllConfirmation(); // Close confirmation modal
                        return err; // Show error message
                    }
                }
            );
        } else {
            toast.error("Invalid secret code. Please enter the correct secret code to delete all selected bills.");
        }
    };






    return (
        <Layout>

            <div className="container">

                <div className="row">
                    {/* Breadcrumb navigation */}
                    <nav className="col-md-6" aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li class="breadcrumb-item"><a href="/dashboard/cashier">Cashier Dashboard</a></li>
                            <li class="breadcrumb-item active" aria-current="page">Billing</li>
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
                <div className="d-flex flex-wrap align-items-center">
                    <h2 className="flex-grow-1">Manage Billing </h2>

                </div>

                <div class="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 mb-3">
                            <div className="card shadow" style={{ backgroundColor: 'white' }}>
                                <div className="card-statistic-3 p-4">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="col-8">
                                            <h2 className="d-flex align-items-center mb-5">
                                                Rs.{totalAmount.toFixed(2)}
                                            </h2>
                                            <h5 className="card-title" style={{ marginTop: '25px', marginBottom: '18px' }}>Total sales</h5>
                                        </div>
                                        <i className="bi bi-cash-coin h1"></i>
                                    </div>
                                    <div className="progress mt-1" data-height="8" style={{ height: '8px' }}>
                                        <div className="progress-bar bg-orange" role="progressbar" data-width="25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{ width: '75%', backgroundColor: 'orange' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 mb-3">
                            <div className="card shadow" style={{ backgroundColor: 'white' }}>
                                <div className="card-statistic-3 p-4">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="col-8">
                                            <h3 className="d-flex align-items-center mb-5">
                                                Bill Reports
                                            </h3>
                                            <h5 className="card-title" style={{ marginTop: '25px' }}>
                                                <button onClick={generateReport} className="btn btn-dark" style={{ backgroundColor: 'black', color: 'white', borderColor: 'black' }}>Generate Report</button>
                                            </h5>
                                        </div>
                                        <i className="bi bi-bar-chart h1"></i>
                                    </div>
                                    <div className="progress mt-1" data-height="8" style={{ height: '8px' }}>
                                        <div className="progress-bar bg-orange" role="progressbar" data-width="25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{ width: '75%', backgroundColor: 'orange' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>

                <br />

                <div className="d-flex flex-wrap align-items-center">
                    <h2 style={{ marginRight: '25px' }}> All Bills</h2>
                    {/* Add expense button */}
                    <Link to="/dashboard/cashier/billing/CreateBill" className="btn btn-outline-success"><i class="bi bi-plus-circle-fill me-2"></i>Create New Bill</Link>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    
                        <div className="mr-3 me-4">
                            <span>Customer ID:</span>
                            <input type="text" className="form-control" placeholder="Search by Customer ID" value={searchQuery} onChange={handleSearch} style={{ height: '38px', width: '500px' }} />
                        </div>
                        <div className="mr-3 me-2">
                            <span>Start Date:</span>
                            <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}  style={{ height: '38px', width: '250px' }}/>
                        </div>
                        <div>
                            <span>End Date:</span>
                            <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ height: '38px', width: '250px' }} />
                        </div>
                    
                    {/*<div className="d-flex align-items-center">
                        <button onClick={handleSelectAll} className="btn btn-outline-secondary mr-2 me-2">
                            {selectAll ? 'Unselect All' : 'Select All'}
                        </button>
                        <button className="btn btn-outline-danger" onClick={handleOpenDeleteAllConfirmation}>Reset All Selected</button>
                    </div>*/}
                </div>






                <div className="card">
                    <div className="card-body">

                        <table className="table">
                            <thead>
                                <tr >

                                    <th >#</th>
                                    <th >Customer ID</th>
                                    <th>Billing Date</th>
                                    <th style={{ textAlign: 'center' }}>Items</th>
                                    <th>Total Amount</th>
                                    <th style={{ textAlign: 'center' }}>Action</th>
                                    {/*<th style={{ textAlign: 'center' }}>Select</th>*/}


                                </tr>
                            </thead>
                            <tbody>
                                {currentBills.map((bills, index) => (
                                    <tr key={bills._id}>

                                        <td>{index + 1}</td>
                                        <td>{bills.customer_id}</td>
                                        <td>{formatDate(bills.billing_date)}</td>
                                        <td>
                                            <ol>
                                                {bills.items.map(item => (
                                                    <li key={item.product_id}>
                                                        <div>Product ID: {item.product_id}</div>
                                                        <div>Quantity: {item.quantity}</div>
                                                        <div>Unit Price: {item.unit_price}</div>
                                                    </li>
                                                ))}
                                            </ol>
                                        </td>
                                        <td>{bills.total_amount.toFixed(2)}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <button onClick={() => handlePreview(bills)} className="btn btn-outline-dark" style={{ margin: '0 5px' }}>Preview</button>
                                            <Link to={`/dashboard/cashier/billing/update/${bills._id}`} className="btn btn-outline-primary" style={{ margin: '0 5px' }}>Update</Link>
                                            {/*<button onClick={() => handleOpenDeleteConfirmation(bills._id)} className="btn btn-outline-danger" style={{ margin: '0 5px' }}>Delete</button>*/}
                                        </td>
                                        {/*<td style={{ textAlign: 'center' }}><input type="checkbox" checked={bills.selected || false} onChange={() => handleSelectBill(bills._id)} /></td>*/}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="container text-center">
                    <div class="row">
                        <div class="col">
                            <nav aria-label="breadcrumb">
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item"><a href="/dashboard/cashier">Cashier Dashboard</a></li>
                                    <li class="breadcrumb-item active" aria-current="page">Billing</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col">

                        </div>
                        <div class="col">
                            <ul className="pagination justify-content-end">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
                                </li>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => paginate(i + 1)}>{i + 1}</button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <hr></hr>
                <br></br>
                <br></br>
                {showPreviewModal && (
                    <BillPreviewModal
                        show={showPreviewModal}
                        handleClose={() => setShowPreviewModal(false)}
                        bill={selectedBill}
                    />
                )}



                {/* Delete confirmation modal */}
                <Modal show={showDeleteConfirmation} onHide={handleCloseDeleteConfirmation}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this bill?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseDeleteConfirmation}>Cancel</Button>
                        <Button variant="danger" onClick={() => handleDelete(deleteItemId)}>Delete</Button>
                    </Modal.Footer>
                </Modal>

                {/* Delete confirmation   modal for delete all */}
                <Modal show={showDeleteAllConfirmation} onHide={handleCloseDeleteAllConfirmation}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete All</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Please enter the secret code to confirm deletion:</p>
                        <input
                            type="text"
                            value={secretCode}
                            onChange={(e) => setSecretCode(e.target.value)}
                            className="form-control"
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseDeleteAllConfirmation}>Cancel</Button>
                        <Button variant="danger" onClick={handleDeleteAllSelected}>Delete All</Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal for repo gen start and end dates */}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Generate Report</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="startDate">
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            </Form.Group>
                            <Form.Group controlId="endDate">
                                <Form.Label>End Date</Form.Label>
                                <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {
                            setShowModal(false);
                            setDateRangeSelected(false); // Set dateRangeSelected to false
                        }}>Cancel</Button>
                        <Button variant="primary" onClick={generateReport}>Generate</Button>
                    </Modal.Footer>
                </Modal>


                <Modal show={showReportModal} onHide={closeReportModal} size="lg" >
                    <Modal.Header closeButton>
                        <Modal.Title>Bills Report</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* Render the generated report content */}
                        <iframe srcDoc={reportContent} title="Bills Report" style={{ width: '100%', minHeight: '400px' }} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeReportModal}>Close</Button>
                        <Button variant="primary" onClick={printReport}>Print</Button>
                    </Modal.Footer>
                </Modal>


            </div>

        </Layout>



    )
}