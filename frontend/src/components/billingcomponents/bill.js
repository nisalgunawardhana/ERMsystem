import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from "react-router-dom";
import BillPreviewModal from './Billpmodel';
import Layout from '../Layout';
import { Modal, Button } from 'react-bootstrap';
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
        const printWindow = window.open("", "_blank", "width=600,height=600");
        printWindow.document.write(`
            <html>
                <head>
                    <title>Bills Report</title>
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
                    <h1>Bills Report</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Customer ID</th>
                                <th>Billing Date</th>
                                <th>Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${bill.map(bill => `
                                <tr>
                                    <td>${bill.customer_id}</td>
                                    <td>${bill.billing_date}</td>
                                    <td>${bill.total_amount}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <h3>Total Amount :${totalAmount.toFixed(2)}</h3>
                    <div class="back-button">
                    <button onclick="window.close()" class="btn btn-secondary">Back</button>
                </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
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
    setShowDeleteAllConfirmation(true);
};

// Function to close delete all confirmation modal
const handleCloseDeleteAllConfirmation = () => {
    setShowDeleteAllConfirmation(false);
};

// Function to delete all selected bills
const handleDeleteAllSelected = () => {
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
                                            <h5 class="card-title" style={{ marginTop: '25px' ,marginBottom: '18px' }}>Total sales</h5>
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


            <table className="table">
                <thead class="table-dark">
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
    <Modal.Body>Are you sure you want to delete all selected bills?</Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseDeleteAllConfirmation}>Cancel</Button>
        <Button variant="danger" onClick={handleDeleteAllSelected}>Delete All</Button>
    </Modal.Footer>
</Modal>

        </div>
        
        </Layout>



    )
}