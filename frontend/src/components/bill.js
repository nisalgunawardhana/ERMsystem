import React, {useState, useEffect} from 'react';
import axios from "axios";
import {Link} from "react-router-dom";
import BillPreviewModal from './Billpmodel';

export default function Bills(){

    const [bill, setbill] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBill, setSelectedBill] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [selectAll, setSelectAll] = useState(false); 
    const [currentPage, setCurrentPage] = useState(1);
    const billsPerPage = 10;

   


    useEffect(()=>{
        function getbill(){
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
    },[])

    const handleDelete = (id) => {
        axios.delete(`http://localhost:8080/bills/delete/${id}`)
            .then(() => {
                // Reload the page after deletion
                window.location.reload();
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
    
    
    return(
        
        <div className="container">

            <h3>Bills</h3>
            <div className="row">
                <div className="col-md-4">
                <div className="card border-success mb-3">
                <div className="card-body">
                    <h5 className="card-title">Total Amount</h5>
                    <p className="card-text">Rs.{totalAmount.toFixed(2)}</p>
                    <Link to="/bill/CreateBill" className="btn btn-success">Create New Bill</Link>
                    
                </div>
            </div>
                </div>
                <div className="col-md-4">
                <div className="card mb-3" style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, color: 'white', borderRadius: '20px' }}>
                        <div className="card-body">
                            <h5 className="card-title">Create Discount Rule</h5>
                            <p className="card-text">Make New Discount Rule</p>
                            <Link to="/bill/discounts" className="btn btn-dark">Manage Discount Rule</Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card mb-3" style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, color: 'white', borderRadius: '20px' }}>
                        <div className="card-body">
                            <h5 className="card-title">Generate Reports</h5>
                            <p className="card-text">Generate and download sales reports.</p>
                            <button onClick={generateReport} className="btn btn-dark">Generate Report</button>
                            <div className="progress-bar bg-light" role="progressbar" style={{ width: '75%' }} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                </div>
            </div>

            <br/>
            
            <h4>All Bills</h4>
            <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="flex-grow-1">
                <input type="text" className="form-control" placeholder="Search by Customer ID" value={searchQuery} onChange={handleSearch} />
            </div>
            <div>
             <button onClick={handleSelectAll} className="btn btn-primary"style={{ margin: '0 5px' }}>
                    {selectAll ? 'Unselect All' : 'Select All'}
                </button>
            <button className="btn btn-danger" onClick={handleDeleteSelected} style={{ margin: '0 5px' }}>Delete Selected</button>
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
                                <button onClick={() => handleDelete(bills._id)} className="btn btn-danger" style={{ margin: '0 5px' }}>Delete</button>
                                <button onClick={() => handlePreview(bills)} className="btn btn-dark" style={{ margin: '0 5px' }}>Preview</button>

                            </td>
                            <td style={{ textAlign: 'center' }}><input type="checkbox" checked={bills.selected || false} onChange={() => handleSelectBill(bills._id)} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
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
            
        </div>
        


        
    )
}