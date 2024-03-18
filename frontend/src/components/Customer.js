import React, { useState, useEffect } from "react";
import { Form, Button, Table, Modal } from "react-bootstrap";
import axios from "axios";

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
        gender: ""
    });

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

    const handleDelete = async (customerId) => {
        try {
            await axios.delete(`/api/customers/delete/${customerId}`);
            fetchCustomers();
        } catch (error) {
            console.error("Error deleting customer:", error);
        }
    };

    // Frontend code
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
            gender: ""
        });
    } catch (error) {
        console.error("Error adding customer:", error);
    }
};


    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomerData({
            ...customerData,
            [name]: value
        });
    };

    return (
        <div className="container">
            <h1>Customer Management</h1>
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
                        <th>Action</th>
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
                                      <Button variant="primary">Edit</Button>{" "}
                                      <Button
                                          variant="danger"
                                          onClick={() =>
                                              handleDelete(customer._id)
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
                                      <Button variant="primary">Edit</Button>{" "}
                                      <Button
                                          variant="danger"
                                          onClick={() =>
                                              handleDelete(customer._id)
                                          }
                                      >
                                          Delete
                                      </Button>
                                  </td>
                              </tr>
                          ))}
                </tbody>
            </Table>
            <Button variant="success" onClick={() => setShowModal(true)}>
                Add Customer
            </Button>
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
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </Form.Control>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Add
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default CustomerR;
