import React, { useState, useEffect } from "react";
import { Form, Button, Table, Modal, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { Pagination } from "react-bootstrap"; // Import Pagination component
import Layout from './Layout';

const CustomerR = () => {
    const [customers, setCustomers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [totalCus, setTotalCus] = useState(0);
    const [currentDateTime, setCurrentDateTime] = useState('');
    const [error, setError] = useState('');
    const [customerData, setCustomerData] = useState({
        customer_id: "",
        customer_name: "",
        email: "",
        point: "",
        gender: "Male" // Default to Male
    });
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const [showDeleteCustomerPrompt, setShowDeleteCustomerPrompt] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // Define currentPage state
    const customersPerPage = 6; // Define customersPerPage state

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        setFilteredCustomers(customers);
    }, [customers]);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get("http://localhost:8080/customer/");
            setCustomers(response.data);
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = customers.filter((customer) =>
            customer.customer_id.toLowerCase().includes(query)
        );
        setFilteredCustomers(filtered);
    };

    const handleDelete = async (id) => {
        setCustomerToDelete(id);
        setShowDeleteCustomerPrompt(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/customer/delete/${customerToDelete}`);
            setCustomers(customers.filter(customer => customer.customer_id !== customerToDelete));
            alert("Customer deleted successfully.");
        } catch (error) {
            console.error("Error deleting customer:", error);
            alert("Error deleting customer. Please try again later.");
        }
        setShowDeleteCustomerPrompt(false);
    };

    const cancelDelete = () => {
        setShowDeleteCustomerPrompt(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { customer_id, customer_name, email, gender } = customerData;
            if (!customer_id || !customer_name || !email  || !gender) {
                console.error("All fields are required");
                return;
            }
            await axios.post("http://localhost:8080/customer/add", { customer_id, customer_name, email, point:0, gender });
            setShowModal(false);
            fetchCustomers();
            setCustomerData({
                customer_id: "",
                customer_name: "",
                email: "",
                point: 0,
                gender: "Male" // Reset gender to Male after adding
            });
        } catch (error) {
            console.error("Error adding customer:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "gender") {
            // Capitalize the first letter of the gender value
            const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
            setCustomerData({
                ...customerData,
                [name]: capitalizedValue
            });
        } else {
            setCustomerData({
                ...customerData,
                [name]: value
            });
        }
    };

    const handleGenerateReport = () => {
        const printWindow = window.open("", "_blank", "width=600,height=600");
        printWindow.document.write(`
            <html>
                <head>
                    <title>Customer Report</title>
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
                    <h1>Customer Report</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Customer ID</th>
                                <th>Customer Name</th>
                                <th>Email</th>
                                <th>Points</th>
                                <th>Gender</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${customers.map(customer => `
                                <tr>
                                    <td>${customer.customer_id}</td>
                                    <td>${customer.customer_name}</td>
                                    <td>${customer.email}</td>
                                    <td>${customer.point}</td>
                                    <td>${customer.gender}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
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
            a.download = "customer_report.pdf";
            a.click();
            URL.revokeObjectURL(pdfUrl);
            printWindow.close();
        };
    };


    const handleDeleteAllPoints = async () => {
        try {
            const isConfirmed = window.confirm("Are you sure you want to delete all loyalty points?");
            if (isConfirmed) {
                console.log("Deleting all loyalty points...");
                await axios.delete("http://localhost:8080/customer/delete-all-points");
                fetchCustomers(); // Refresh the customer list
                alert("All customer loyalty points deleted successfully.");
            }
        } catch (error) {
            console.error("Error deleting all customer loyalty points:", error);
            alert("Error deleting all customer loyalty points. Please try again later.");
        }
    };
    

    useEffect(() => {

        // Fetch total amount
        axios.get("http://localhost:8080/customer/count")
            .then((res) => {
                setTotalCus(res.data.totalCustomers);
            })
            .catch((err) => {
                setError(err.message);
            });

             const intervalId = setInterval(() => {
            const now = new Date();
            setCurrentDateTime(now.toLocaleString());
        }, 1000);

        // Cleanup interval
        return () => clearInterval(intervalId);
    }, []);


    return (
        <Layout>
        <div className="container">
            
                <div className="row">
        {/* Breadcrumb navigation */}
        <nav className="col-md-6" aria-label="breadcrumb">
            <ol className="breadcrumb">
            <li class="breadcrumb-item"><a href="/dashboard/cashier">Cashier Dashboard</a></li>
                        <li class="breadcrumb-item active" aria-current="page">Customer Management </li>
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
            <h1>Customer Management</h1>
            <Row className="mb-4">
    <Col>
        <div className="card shadow" style={{ backgroundColor: 'white' }}>
            <div className="card-statistic-3 p-4">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="col-8">
                        <h3 className="d-flex align-items-center mb-5" style={{ color: 'black' }}>
                            Customer Report
                        </h3>
                        
                    </div>
                    <i className="bi bi-bar-chart h1"></i>
                </div>
                <Button className="btn btn-dark" onClick={handleGenerateReport}>Generate Report</Button>
                <div className="progress mt-3" data-height="8" style={{ height: '8px' }}>
                    <div className="progress-bar bg-orange" role="progressbar" data-width="25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{ width: '75%', backgroundColor: 'orange' }}></div>
                </div>
            </div>
        </div>
    </Col>
    <Col>
        <div className="card shadow" style={{ backgroundColor: 'white' }}>
            <div className="card-statistic-3 p-4">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="col-8">
                        <h3 className="d-flex align-items-center mb-5" style={{ color: 'black' }}>
                            Total Customers
                        </h3>
                        
                    </div>
                    <h1>{totalCus}</h1>
                    
                </div>
                <Button className="btn btn-dark" onClick={() => setShowModal(true)}>Add Customer</Button>
                <div className="progress mt-3" data-height="8" style={{ height: '8px' }}>
                    <div className="progress-bar bg-orange" role="progressbar" data-width="25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{ width: '75%', backgroundColor: 'orange' }}></div>
                
                </div>
                
            </div>
            
        </div>
    </Col>
    <Col>
        <div className="card shadow" style={{ backgroundColor: 'white' }}>
            <div className="card-statistic-3 p-4">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="col-8">
                        <h3 className="d-flex align-items-center mb-5" style={{ color: 'black' }}>
                            Delete All Points
                        </h3>
                       
                    </div>
                    <i className="bi bi-trash h1"></i>
                </div>
                <Button className="btn btn-dark" onClick={handleDeleteAllPoints}>Delete All Points</Button>
                <div className="progress mt-3" data-height="8" style={{ height: '8px' }}>
                    <div className="progress-bar bg-orange" role="progressbar" data-width="25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{ width: '75%', backgroundColor: 'orange' }}></div>
                </div>
            </div>
        </div>
    </Col>
    
    
</Row>


            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by Customer ID"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        const query = e.target.value.toLowerCase();
                        const filtered = customers.filter((customer) =>
                            customer.customer_id.toLowerCase().includes(query)
                        );
                        setFilteredCustomers(filtered);
                    }}
                />
            </div>
            <div className="container">
                <div className="row">
                    {currentCustomers.map(customer => (
                        <div key={customer._id} className="col-md-4 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Customer ID: {customer.customer_id}</h5>
                                    <p className="card-text">Name: {customer.customer_name}</p>
                                    <p className="card-text">Email: {customer.email}</p>
                                    <p className="card-text">Point: {customer.point}</p>
                                    <p className="card-text">Gender: {customer.gender}</p>
                                    <div className="btn-group">
                                        <Link to={`/dashboard/cashier/Customer/update/${customer.customer_id}`} className="btn btn-outline-primary  me-2">
                                            <i className="bi bi-pencil-fill"></i> Update
                                        </Link>
                                        <button className="btn btn-outline-danger" onClick={() => handleDelete(customer.customer_id)}>
                                            <i className="bi bi-trash-fill"></i> Delete
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
                        {[...Array(Math.ceil(filteredCustomers.length / customersPerPage)).keys()].map(number => (
                            <Pagination.Item key={number + 1} onClick={() => paginate(number + 1)} active={number + 1 === currentPage}>
                                {number + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(filteredCustomers.length / customersPerPage)} />
                    </Pagination>
                </div>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Customer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="customer_id">
                            <Form.Label>Customer ID</Form.Label>
                            <Form.Control
                                type="text"
                                name="customer_id"
                                onChange={handleChange}
                                value={customerData.customer_id}
                            />
                        </Form.Group>
                        <Form.Group controlId="customer_name">
                            <Form.Label>Customer Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="customer_name"
                                onChange={handleChange}
                                value={customerData.customer_name}
                            />
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                onChange={handleChange}
                                value={customerData.email}
                            />
                        </Form.Group>
                        <Form.Group controlId="point">
                            <Form.Label>Point</Form.Label>
                            <Form.Control
                                type="number"
                                name="point"
                                onChange={handleChange}
                                value={customerData.point}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group controlId="gender">
                            <Form.Label>Gender</Form.Label>
                            <Form.Control
                                as="select"
                                name="gender"
                                onChange={handleChange}
                                value={customerData.gender}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </Form.Control>
                        </Form.Group>
                        <Button variant="primary" type="submit" >
                            Add
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal show={showDeleteCustomerPrompt} onHide={cancelDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this customer?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={confirmDelete}>Yes</Button>
                    <Button variant="secondary" onClick={cancelDelete}>No</Button>
                </Modal.Footer>
            </Modal>
        </div>

        </Layout>
    );
};

export default CustomerR;
