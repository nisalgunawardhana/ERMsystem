import React, { useState, useEffect } from "react";
import { Form, Button, Table, Modal, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

const CustomerR = () => {
    const [customers, setCustomers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [customerData, setCustomerData] = useState({
        customer_id: "",
        customer_name: "",
        email: "",
        point: "",
        gender: "Male" // Default to Male
    });
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const [showDeleteCustomerPrompt, setShowDeleteCustomerPrompt] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get("http://localhost:8080/customer/");
            setCustomers(response.data);
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };

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
            const { customer_id, customer_name, email, point, gender } = customerData;
            if (!customer_id || !customer_name || !email || !point || !gender) {
                console.error("All fields are required");
                return;
            }
            await axios.post("http://localhost:8080/customer/add", { customer_id, customer_name, email, point, gender });
            setShowModal(false);
            fetchCustomers();
            setCustomerData({
                customer_id: "",
                customer_name: "",
                email: "",
                point: "",
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
                // Proceed with deleting loyalty points
                console.log("Deleting all loyalty points...");
            }
            await axios.delete("http://localhost:8080/customer/delete-all-points");
            fetchCustomers(); // Refresh the customer list
            alert("All customer loyalty points deleted successfully.");
        } catch (error) {
            console.error("Error deleting all customer loyalty points:", error);
            alert("Error deleting all customer loyalty points. Please try again later.");
        }
    };


    return (
        <div className="container">
            <h1>Customer Management</h1>
            <Row className="mb-3">
                <Col>
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title>Generate Report</Card.Title>
                            <Card.Text>
                                Generate a report about all customer details and loyalty points.
                            </Card.Text>
                            <Button variant="primary" onClick={handleGenerateReport}>Generate Report</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title>Add Customer</Card.Title>
                            <Card.Text>
                                Add a new customer to the database.
                            </Card.Text>
                            <Button variant="success" onClick={() => setShowModal(true)}>Add Customer</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="h-100 d-flex justify-content-center align-items-center">
                        <Card.Body>
                            <Card.Title>Delete All Points</Card.Title>
                            <Card.Text>
                                Delete all customer loyalty points.
                            </Card.Text>
                            <Button variant="danger" onClick={handleDeleteAllPoints}>Delete All Points</Button>
                        </Card.Body>
                    </Card>

                </Col>
            </Row>
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by Customer ID"
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Customer ID</th>
                        <th>Customer Name</th>
                        <th>Email</th>
                        <th>Point</th>
                        <th>Gender</th>
                        <th colSpan="2">Action</th> {/* Spanning two columns for Edit and Delete buttons */}
                    </tr>
                </thead>
                <tbody>
                    {searchQuery === ""
                        ? customers.map((customer) => (
                            <tr key={customer._id}>
                                <td>{customer.customer_id}</td>
                                <td>{customer.customer_name}</td>
                                <td>{customer.email}</td>
                                <td>{customer.point}</td>
                                <td>{customer.gender}</td>
                                <td>
                                    <Link to={`/customer/update/${customer.customer_id}`} className="btn btn-primary">Update</Link>
                                </td>
                                <td>
                                    <Button
                                        variant="danger"
                                        onClick={() =>
                                            handleDelete(customer.customer_id)
                                        }
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))
                        : filteredCustomers.map((customer) => (
                            <tr key={customer._id}>
                                <td>{customer.customer_id}</td>
                                <td>{customer.customer_name}</td>
                                <td>{customer.email}</td>
                                <td>{customer.point}</td>
                                <td>{customer.gender}</td>
                                <td>
                                    <Button variant="primary">Edit</Button>
                                </td>
                                <td>
                                    <Button variant="danger" onClick={() => handleDelete(customer.customer_id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </Table>
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
                        <Button variant="primary" type="submit">
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
    );
};

export default CustomerR;
