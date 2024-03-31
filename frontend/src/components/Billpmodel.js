import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

export default function BillPreviewModal({ bill }) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handlePrint = (billId) => {
        // Implement printing logic here
        const billToPrint = bill;
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

    return (
        <>
            <Button variant="btn btn-dark" onClick={handleShow} style={{ marginLeft: '5px' }}>
                Preview
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Bill Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body>
    <p><strong>Customer ID:</strong> {bill.customer_id}</p>
    <p><strong>Billing Date:</strong> {new Date(bill.billing_date).toLocaleDateString()}</p>
    <p><strong>Total Amount:</strong> {bill.total_amount}</p>
    <p><strong>Items:</strong></p>
    <ul>
        {bill.items.map((item, index) => (
            <li key={index}>
                Product ID: {item.product_id}, Quantity: {item.quantity}, Unit Price: {item.unit_price}
            </li>
        ))}
    </ul>
</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="dark" onClick={handlePrint}>
                        Print
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
