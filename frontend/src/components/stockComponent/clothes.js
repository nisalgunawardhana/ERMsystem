/* global Chart */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card, Button } from 'react-bootstrap';
import Layout from '../Layout';

export default function Clothes() {
    const [clothes, setClothes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedClothes, setSelectedClothes] = useState(null);
    const [itemCode, setItemCode] = useState('');
    const [itemName, setItemName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [alertQuantity, setAlertQuantity] = useState('');
    const [error, setError] = useState('');
    const [quantityChartData, setQuantityChartData] = useState(null);

   /* useEffect(() => {
        // Function to generate quantity chart data
        const generateQuantityChartData = () => {
            const labels = clothes.map(clothes => clothes.item_name);
            const data = clothes.map(clothes => clothes.quantity);

            return {
                labels: labels,
                data: data
            };
        };

        // Generate initial chart data
        setQuantityChartData(generateQuantityChartData());

        // Cleanup function
        return () => {
            setQuantityChartData(null);
        };
    }, [clothes]);*/

    useEffect(() => {
        let quantityChart = null;
    
        // Function to create or update the quantity line chart
        const createOrUpdateQuantityChart = () => {
            const canvas = document.getElementById('canvas-1');
    
            // Check if canvas or clothes array is null or empty, and if so, return early
            if (!canvas || !Array.isArray(clothes) || clothes.length === 0) {
                console.error('Canvas is null or clothes array is empty');
                return;
            }
            
    
            // Extract labels and data from the clothes array
            const labels = clothes.map(clothes => clothes.item_name);
            const data = clothes.map(clothes => clothes.quantity);
    
            // Create the new chart instance
            quantityChart = new Chart(document.getElementById('canvas-1'), {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Quantity',
                        data: data,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        };
    
        // Call the function to create or update the quantity chart
        const timeoutId = setTimeout(() => {
            createOrUpdateQuantityChart();
        }, 100);
    
        // Cleanup function
        return () => {
            clearTimeout(timeoutId);
            if (quantityChart) {
                quantityChart.destroy();
            }
        };

    }, [clothes]);
    
    

    useEffect(() => {
        axios.get('http://localhost:8080/clothes/')
            .then((res) => {
                setClothes(res.data);
            })
            .catch((err) => {
                alert(err.message);
            });
    }, []);

    // Function to handle delete clothes
    const handleDeleteClothes = (itemCode) => {
        axios.delete(`http://localhost:8080/clothes/delete/${itemCode}`)
            .then(() => {
                setClothes(clothes.filter(clothes => clothes.item_code !== itemCode));
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    // Function to handle search
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
    };

    // Function to open add modal
    const handleOpenAddModal = () => {
        setShowAddModal(true);
    };

    // Function to open update modal and set selected clothes
    const handleOpenUpdateModal = (clothes) => {
        setSelectedClothes(clothes);
        setItemCode(clothes.item_code);
        setItemName(clothes.item_name);
        setCategory(clothes.category);
        setPrice(clothes.price);
        setQuantity(clothes.quantity);
        setAlertQuantity(clothes.alert_quantity);
        setShowUpdateModal(true);
    };

    // Function to handle form submission for both create and update
    const handleFormSubmit = async (event) => {
        event.preventDefault();

        try {
            setError('');

            if (!itemCode || !itemName || !category || !price || !quantity || !alertQuantity) {
                setError('All fields are required.');
                return;
            }

            if (selectedClothes) {
                await axios.put(`http://localhost:8080/clothes/update/${selectedClothes.item_code}`, {
                    item_code: itemCode,
                    item_name: itemName,
                    category: category,
                    price: price,
                    quantity: quantity,
                    alert_quantity: alertQuantity
                });

                setShowUpdateModal(false);
            } else {
                await axios.post('http://localhost:8080/clothes/add', {
                    item_code: itemCode,
                    item_name: itemName,
                    category: category,
                    price: price,
                    quantity: quantity,
                    alert_quantity: alertQuantity
                });

                setShowAddModal(false);
            }

            const res = await axios.get('http://localhost:8080/clothes/');
            setClothes(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred.');
        }
    };

    // Filter clothes based on search query
    const filteredClothes = clothes.filter(clothes =>
        clothes.item_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const generateReport = () => {
        const totalQuantity = clothes.reduce((total, clothes) => total + clothes.quantity, 0);
    
        const printWindow = window.open("", "_blank", "width=600,height=600");
        printWindow.document.write(`
            <html>
                <head>
                    <title>Clothes Stock Report</title>
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
                    <h1>Clothes Stock Report</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Item Code</th>
                                <th>Item Name</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${clothes.map(clothes => `
                                <tr>
                                    <td>${clothes.item_code}</td>
                                    <td>${clothes.item_name}</td>
                                    <td>${clothes.quantity}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <h3>Total Quantity: ${totalQuantity}</h3>
                    <div class="button-container">
                        <button onclick="window.print()" class="btn btn-primary">Print</button>
                        <button onclick="downloadCustomerReport()" class="btn btn-primary">Download PDF</button>
                        <button onclick="window.close()" class="btn btn-secondary">Close</button>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        
        printWindow.downloadCustomerReport = () => {
            const pdfContent = printWindow.document.documentElement.outerHTML;
            const pdfBlob = new Blob([pdfContent], { type: "application/pdf" });
            const pdfUrl = URL.createObjectURL(pdfBlob);
            const a = document.createElement("a");
            a.href = pdfUrl;
            a.download = "clothes_stock_report.pdf";
            a.click();
            URL.revokeObjectURL(pdfUrl);
            printWindow.close();
        };
    };

    const [selectedItemForDelete, setSelectedItemForDelete] = useState(null);

    // Function to open delete confirmation modal
    const handleOpenDeleteConfirmationModal = (clothes) => {
        setSelectedItemForDelete(clothes);
    };

    // Function to handle canceling deletion
    const handleCancelDelete = () => {
        setSelectedItemForDelete(null);
    };

    // Function to handle confirming deletion
    const handleConfirmDelete = () => {
        if (selectedItemForDelete) {
            handleDeleteClothes(selectedItemForDelete.item_code);
            setSelectedItemForDelete(null); // Close the modal after deletion
        }
    };
    
    /*
    useEffect(() => {
        let lineChart = null;

        // Function to create or update the line chart
        const createOrUpdateLineChart = () => {
            // If a previous Chart instance exists, destroy it
            if (lineChart) {
                lineChart.destroy();
            }

            // Extracting data for the chart
            const salesLabels = profit.map(profit => profit.Month);
            const salesData = profit.map(profit => parseFloat(profit.Sales_income));
            const expenseData = profit.map(profit => parseFloat(profit.Other_expenses + profit.Supplier_expenses + profit.Salaries));

            // Create the line chart
            lineChart = new Chart(document.getElementById('canvas-1'), {
                type: 'line',
                data: {
                    labels: salesLabels,
                    datasets: [
                        {
                            label: 'Sales',
                            data: salesData,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderWidth: 1
                        },
                        {
                            label: 'Expenses',
                            data: expenseData,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        };
        createOrUpdateLineChart();

        // Cleanup function to destroy the charts when the component unmounts
        return () => {
            if (lineChart) {
                lineChart.destroy();
            }
        };
    }, [otherExpenses, monthlyProfit]);*/
    

    return (
        <Layout>

            <div className="container">
            <div className="row">
                    {/* Breadcrumb navigation */}
                    <nav className="col-md-6" aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li class="breadcrumb-item"><a href="/dashboard/stock">Stock Dashboard</a></li>
                            <li class="breadcrumb-item active" aria-current="page">Clothes</li>
                        </ol>
                    </nav>
                    {/* Current Date and Time */}
                    <div className="col-md-6 text-md-end mb-3">
                        
                    </div>
                </div>
                <h1>Manage Clothes</h1>
                <Row className="mb-3">
                    <Col>
                        <Card className="h-100">
                            <Card.Body>
                                <Card.Title>Generate Report</Card.Title>
                                <Card.Text>
                                    Generate a report about all customer details and loyalty points.
                                </Card.Text>
                                <Button className="btn btn-dark" onClick={generateReport}>Generate Report</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                
                </Row>

                {/* Search input */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="flex-grow-1">
                        <input type="text" className="form-control" placeholder="Search by Item Name" value={searchQuery} onChange={handleSearch} />
                    </div>
                    <div>
                        <button onClick={handleOpenAddModal} className="btn btn-outline-success">Add New Clothes</button>
                    </div>
                </div>

                {/* Modal for adding new clothes */}
                {/* Modal for adding new clothes */}
    <div className="modal" style={{ display: showAddModal ? 'block' : 'none' }}>
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Add New Clothes</h5>
                    <button type="button" className="close" style={{ position: 'absolute', right: '10px', top: '10px' }} onClick={() => setShowAddModal(false)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleFormSubmit}>
                        {error && <div className="alert alert-danger" role="alert">{error}</div>}
                        <div className="form-group">
                            <label>Item Code</label>
                            <input type="text" className="form-control" value={itemCode} onChange={(e) => setItemCode(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Item Name</label>
                            <input type="text" className="form-control" value={itemName} onChange={(e) => setItemName(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Category : F-Female M-Male</label>
                            <input type="text" className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Price</label>
                            <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Quantity</label>
                            <input type="number" className="form-control" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Alert Quantity</label>
                            <input type="number" className="form-control" value={alertQuantity} onChange={(e) => setAlertQuantity(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary">Add Clothes</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Close</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    {/* Modal for updating clothes */}
    <div className="modal" style={{ display: showUpdateModal ? 'block' : 'none' }}>
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Update Clothes</h5>
                    <button type="button" className="close" style={{ position: 'absolute', right: '10px', top: '10px' }} onClick={() => setShowUpdateModal(false)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleFormSubmit}>
                        {error && <div className="alert alert-danger" role="alert">{error}</div>}
                        <div className="form-group">
                            <label>Item Code</label>
                            <input type="text" className="form-control" value={itemCode} onChange={(e) => setItemCode(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Item Name</label>
                            <input type="text" className="form-control" value={itemName} onChange={(e) => setItemName(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <input type="text" className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Price</label>
                            <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Quantity</label>
                            <input type="number" className="form-control" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Alert Quantity</label>
                            <input type="number" className="form-control" value={alertQuantity} onChange={(e) => setAlertQuantity(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary">Update Clothes</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>Close</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    // Modal for delete confirmation
<div className="modal" style={{ display: selectedItemForDelete ? 'block' : 'none' }}>
    <div className="modal-dialog">
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="close" style={{ position: 'absolute', right: '10px', top: '10px' }} onClick={handleCancelDelete}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body">
                <p>Are you sure you want to delete {selectedItemForDelete?.item_name}?</p>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>Delete</button>
                <button type="button" className="btn btn-secondary" onClick={handleCancelDelete}>Cancel</button>
            </div>
        </div>
    </div>
</div>

                {/* Clothes table */}
                <table className="table">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Item Code</th>
                            <th>Item Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Alert Quantity</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClothes.map((clothes, index) => (
                            <tr key={clothes.item_code}>
                                <td>{index + 1}</td>
                                <td>{clothes.item_code}</td>
                                <td>{clothes.item_name}</td>
                                <td>{clothes.category}</td>
                                <td>{clothes.price}</td>
                                <td>{clothes.quantity}</td>
                                <td>{clothes.alert_quantity}</td>
                                <td>
                                    <button className="btn btn-outline-primary me-2" onClick={() => handleOpenUpdateModal(clothes)}>Update</button>
                                    <button className="btn btn-outline-danger me-2" onClick={() => handleOpenDeleteConfirmationModal(clothes)}>Delete</button>
                                </td>
                                {/* Check if quantity is less than or equal to the alert quantity */}
                                {clothes.quantity <= clothes.alert_quantity && (
                                    <td>
                                        <div className="alert alert-warning" role="alert">
                                            Alert: Reorder this item!
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Row className="mb-3">
                    <Col>
                        <Card className="h-100">
                            <Card.Body>
                                <Card.Title>Clothes Quantity Chart</Card.Title>
                                <Card.Text>
                                    Track the quantity of clothes over time.
                                </Card.Text>
                                <canvas id="canvas-1"></canvas>
                            </Card.Body>
                        </Card>
                    </Col>
                    </Row>
            </div>
            
        </Layout>

        

    );
}
