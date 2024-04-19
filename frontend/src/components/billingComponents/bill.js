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
                toast.success("Bill deleted successfully!");
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const generateReport = () => {
        if (!startDate || !endDate) {
            setShowModal(true);
            toast.error("Please select both start and end dates before generating the report.");
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
                <td>${bill.total_amount}</td>
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
        bills.customer_id.toLowerCase().includes(searchQuery.toLowerCase())
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

    const handleDeleteSelected = () => {
        const selectedBills = bill.filter(b => b.selected).map(b => b._id);
        selectedBills.forEach(id => {
            axios.delete(`http://localhost:8080/bills/delete/${id}`)
                .then(() => {
                    setbill(prevBills => prevBills.filter(b => b._id !== id));
                })
                .catch((err) => {
                    alert(err.message);
                });
        });
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
        const actualSecretCode = 'DELETE_ALL_BILLS';

        // Verify the secret code
        if (secretCode === actualSecretCode) {
            // Show toaster message before initiating delete
            toast.promise(
                // Promise to delete all selected bills
                new Promise((resolve, reject) => {
                    // Perform delete operation
                    const selectedBills = bill.filter(b => b.selected).map(b => b._id);
                    // Check if any bills are selected
                    if (selectedBills.length > 0) {
                        // Delete all selected bills
                        Promise.all(selectedBills.map(id => axios.delete(`http://localhost:8080/bills/delete/${id}`)))
                            .then(() => {
                                resolve("Bills deleted successfully!");
                                setbill(prevBills => prevBills.filter(b => !b.selected));
                                resetSecretCode();
                            })
                            .catch((err) => {
                                reject(err.message);
                            });
                    } else {
                        // If no bills are selected, reject with a message
                        reject("No bills selected for deletion.");
                    }
                }),
                // Toast options
                {
                    loading: 'Deleting...',
                    success: (msg) => {
                        handleCloseDeleteAllConfirmation(); // Close confirmation modal
                        return msg; // Show success message
                    },
                    error: (err) => {
                        handleCloseDeleteAllConfirmation(); // Close confirmation modal
                        return err; // Show error message
                    }
                }
            );
        } else {
            alert("Invalid secret code. Please enter the correct secret code to delete all selected bills.");
        }
    };




    return (
        <Layout>

            <div className="container">

                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/">Home</a></li>
                        <li class="breadcrumb-item active" aria-current="page">Bills</li>
                    </ol>
                </nav>
                <div className="d-flex flex-wrap align-items-center">
                    <h2 className="flex-grow-1">Bills</h2>

                </div>

                <div class="container">
                    <div class="row">
                        <div class="col-lg-4 col-md-6 mb-3">
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
                        <div class="col-lg-4 col-md-6 mb-3">
                            <div class="card l-bg-green-dark">
                                <div class="card-statistic-3 p-4">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div class="col-8">
                                            <h3 class="d-flex align-items-center mb-5">
                                                Discount Rules
                                            </h3>
                                            <h5 class="card-title" style={{ marginTop: '25px' }}><Link to="/bill/discounts" className="btn btn-dark">Manage Discount Rule</Link></h5>
                                        </div>
                                        <i className="bi bi-percent h1"></i>
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
                                            <h3 class="d-flex align-items-center mb-5">
                                                Bill Reports
                                            </h3>
                                            <h5 class="card-title" style={{ marginTop: '25px' }}><button onClick={generateReport} className="btn btn-dark">Generate Report</button></h5>
                                        </div>
                                        <i className="bi bi-bar-chart h1"></i>

                                    </div>
                                    <div class="progress mt-1 " data-height="8" style={{ height: '8px' }}>
                                        <div class="progress-bar l-bg-cyan" role="progressbar" data-width="25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{ width: '25%' }}></div>
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
                    <Link to="/bill/CreateBill" className="btn btn-success"><i class="bi bi-plus-circle-fill me-2"></i>Create New Bill</Link>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="flex-grow-1">
                        <input type="text" className="form-control" placeholder="Search by Customer ID" value={searchQuery} onChange={handleSearch} />
                    </div>
                    <div>
                        <button onClick={handleSelectAll} className="btn btn-secondary" style={{ margin: '0 5px' }}>
                            {selectAll ? 'Unselect All' : 'Select All'}
                        </button>
                        <button className="btn btn-dark" onClick={handleOpenDeleteAllConfirmation} style={{ margin: '0 5px' }}>Delete All Selected</button>
                    </div>
                </div>


                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Recent Sales</h5>
                        <table className="table">
                    <thead>
                        <tr >

                            <th >#</th>
                            <th >Customer ID</th>
                            <th>Billing Date</th>
                            <th style={{ textAlign: 'center' }}>Items</th>
                            <th>Total Amount</th>
                            <th style={{ textAlign: 'center' }}>Action</th>
                            <th style={{ textAlign: 'center' }}>Select</th>


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
                                    <Link to={`/bill/update/${bills._id}`} className="btn btn-primary" style={{ margin: '0 5px' }}>Update</Link>
                                    <button onClick={() => handleOpenDeleteConfirmation(bills._id)} className="btn btn-danger" style={{ margin: '0 5px' }}>Delete</button>
                                    <button onClick={() => handlePreview(bills)} className="btn btn-dark" style={{ margin: '0 5px' }}>Preview</button>

                                </td>
                                <td style={{ textAlign: 'center' }}><input type="checkbox" checked={bills.selected || false} onChange={() => handleSelectBill(bills._id)} /></td>
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
                                    <li class="breadcrumb-item"><a href="/">Home</a></li>
                                    <li class="breadcrumb-item active" aria-current="page">Bills</li>
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

                {/* Modal for inputting start and end dates */}
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
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={generateReport}>Generate</Button>
                    </Modal.Footer>
                </Modal>


                <Modal show={showReportModal} onHide={closeReportModal} size="lg">
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