import React, {useState, useEffect} from 'react';
import axios from "axios";
import {Link} from "react-router-dom";


export default function Bills(){

    const [bill, setbill] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

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
    const handlePrint = (billId) => {
        // Implement printing logic here
        const billToPrint = bill.find(bills => bills._id === billId);
        if (!billToPrint) {
            alert("Bill not found!");
            return;
        }
    
        const printWindow = window.open("", "_blank", "width=600,height=600");
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Bill</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            padding: 20px;
                        }
                        .bill-container {
                            max-width: 800px;
                            margin: 0 auto;
                            border: 1px solid #ccc;
                            padding: 20px;
                            border-radius: 10px;
                        }
                        .bill-header {
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        .bill-header h1 {
                            margin: 0;
                            color: #333;
                        }
                        .bill-details {
                            margin-bottom: 20px;
                        }
                        .bill-details p {
                            margin: 5px 0;
                        }
                        .bill-items {
                            margin-bottom: 20px;
                        }
                        .bill-items table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        .bill-items th, .bill-items td {
                            border: 1px solid #ccc;
                            padding: 8px;
                            text-align: left;
                        }
                        .bill-items th {
                            background-color: #f2f2f2;
                        }
                        .bill-items td {
                            background-color: #fff;
                        }
                        .bill-total {
                            text-align: right;
                            font-weight: bold;
                        }
                        .back-button {
                            text-align: center;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="bill-container">
                        <div class="bill-header">
                            <h2>Diyana fashion Store</h2>
                            <h1>Bill Details</h1>
                            <P>No 01,DS senanayaka Mw,Anuradhapura <br> 071 09876743</P>
                        </div>
                        <div class="bill-details">
                            <p><strong>Customer ID:</strong> ${billToPrint.customer_id}</p>
                            <p><strong>Billing Date:</strong> ${billToPrint.billing_date}</p>
                            <p><strong>Total Amount:</strong> ${billToPrint.total_amount}</p>
                        </div>
                        <div class="bill-items">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Product ID</th>
                                        <th>Quantity</th>
                                        <th>Unit Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${billToPrint.items.map(item => `
                                        <tr>
                                            <td>${item.product_id}</td>
                                            <td>${item.quantity}</td>
                                            <td>${item.unit_price}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                        <div class="bill-total">
                            <p>Total: ${billToPrint.total_amount}</p>
                        </div>
                        <div class="back-button">
                            <button onclick="window.open('', '_self').close();">Back</button>
                        </div>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
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
                    <div class="back-button">
                    <button onclick="window.close()" class="btn btn-secondary">Back</button>
                </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };
    

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        const filteredBills = bill.filter(bills =>
            bills.customer_id.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filteredBills);
    };

    

    
    return(
        
        <div className="container">

            <h3>Bills</h3>

            <div className="mb-3">
                <input type="text" className="form-control" placeholder="Search by Customer ID" value={searchQuery} onChange={handleSearch} />
                <div className="dropdown">
                    {searchResults.length > 0 && (
                        <div className="dropdown-menu show">
                            {searchResults.map((bills, index) => (
                                <Link to={`/bill/${bills._id}`} key={index} className="dropdown-item">
                                    {bills.customer_id}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="row">
                <div className="col-md-4">
                <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Total Amount</h5>
                    <p className="card-text">{totalAmount.toFixed(2)}</p>
                    <Link to="/CreateBill" className="btn btn-primary">Create New Bill</Link>
                    
                </div>
            </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Create Bill</h5>
                            <p className="card-text">Make New Bill</p>
                            <Link to="/CreateBill" className="btn btn-primary">Create New Bill</Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Generate Reports</h5>
                            <p className="card-text">Generate and download sales reports.</p>
                            <button onClick={generateReport} className="btn btn-primary">Generate Report</button>
                        </div>
                    </div>
                </div>
            </div>

                <table className="table">
                <thead>
                    <tr>
                        <th>Customer ID</th>
                        <th>Billing Date</th>
                        <th>Items</th>
                        <th>Total Amount</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {bill.map(bills => (
                        <tr key={bills._id}>
                            <td>{bills.customer_id}</td>
                            <td>{bills.billing_date}</td>
                            <td>
                                <ul>
                                    {bills.items.map(item => (
                                        <li key={item.product_id}>
                                            <div>Product ID: {item.product_id}</div>
                                            <div>Quantity: {item.quantity}</div>
                                            <div>Unit Price: {item.unit_price}</div>
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>{bills.total_amount}</td>
                            <td>
                            <Link to={`/bill/update/${bills._id}`} className="btn btn-primary">Update</Link>
                            <button onClick={() => handleDelete(bills._id)} className="btn btn-danger">Delete</button>
                            <button onClick={() => handlePrint(bills._id)} className="btn btn-success">Print Bill</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}