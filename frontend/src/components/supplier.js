import React, { useEffect, useState } from "react";
import {Button, Card, Row, Col,Form, ListGroup, ButtonGroup} from 'react-bootstrap';
import { Link } from "react-router-dom";
import axios from "axios";


function Supplier () {

    const [suppliers, setSuppliers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        function getSuppliers(){
            axios.get("http://localhost:8080/supplier/").then((res) => {
                setSuppliers(res.data);
                setSearchResults(res.data);
            }).catch((err) => {
                alert(err.message);
            })
        }
        getSuppliers();
    }, [])

    //SEARCH BAR
    const handleSearchSupplier = (e) => {
        const query = e.target.value; 
        setSearchQuery(query);
        // Filter suppliers based on search query
        const filteredSuppliers = suppliers.filter(supplier => 
            supplier.supplier_name.toLowerCase().includes(query) || // Match lowercase query
            supplier.supplier_name.toUpperCase().includes(query) // Match uppercase query
        );
        setSearchResults(filteredSuppliers);
    };


    //DELETE SUPPLIER
    const handleDeleteSupplier = (id) => {
        axios.delete(`http://localhost:8080/supplier/delete/${id}`)
            .then(() => {
                setSuppliers(suppliers.filter(supplier => supplier._id !== id));
                setSearchResults(searchResults.filter(supplier => supplier._id !== id));
                alert("Supplier deleted successfully");
            })
            .catch((err) => {
                alert("Error deleting supplier");
            });
    };

    //UPDATE SUPPLIER


    

    const renderSuppliers = searchQuery === "" ? suppliers : searchResults

    return(
            <div className="container">
                <h2>Manage Suppliers and Purchase Orders</h2>

                <div className="mt-4">
                    <Row>
                        <Col>
                        <Card >
                            <Card.Header>Supplier Management</Card.Header>
                            <Card.Body>
                                <Card.Title>Suppliers</Card.Title>
                                <Card.Text>
                                Manage supplier network and safeguard sensitive details
                                </Card.Text>
                                <Link to="/supplier/add"><Button variant="secondary">Add Supplier</Button></Link>
                            </Card.Body>
                        </Card>
                        </Col>
                        <Col>
                        <Card >
                            <Card.Header>Purchase Order Management</Card.Header>
                            <Card.Body>
                                <Link to={"/purchaseOrder"} class="link-dark link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" ><Card.Title>Purchase Orders</Card.Title></Link>
                                <Card.Text>
                                Simplify purchase order management process for streamlined efficiency
                                </Card.Text>
                                <Link to="/purchaseOrder/add"><Button variant="primary">Create Purchase Order</Button></Link>
                            </Card.Body>
                        </Card>
                        </Col>
                        <Col>
                        <Card style={{ width: '20rem' }}>
                            <Card.Body>
                                <Card.Title>RFQ</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Requests For Quotaions</Card.Subtitle>
                                <Card.Text>
                                Ready to connect with new suppliers? Send a request to access their price lists and more
                                </Card.Text>
                                <Link to="/rfq"><Button variant="success">View RFQs</Button></Link>
                            </Card.Body>
                        </Card>
                        </Col>
                    </Row>
                </div>

                <div className="mt-4">
                    <Form>
                        <Form.Group controlId="formSearch">
                            <Form.Control
                                type="text"
                                placeholder="Enter Supplier name"
                                value={searchQuery}
                                onChange={handleSearchSupplier}
                            />
                        </Form.Group>
                    </Form>
                </div>  

                <div className="mt-4">
                <Row xs={1} sm={2} md={3} lg={4}>
                    {renderSuppliers.map((supplier, index) => (
                        <Col key={index} className="mb-4">
                            <Card style={{ width: '20rem' }}>
                                <Card.Body>
                                    <Card.Title>{supplier.supplier_name}</Card.Title>
                                    <Card.Text>
                                        <b>Supplier ID:</b> {supplier.supplier_id}<br />
                                        <b>Address:</b> {supplier.address}<br />
                                        <b>Email:</b> {supplier.email}<br />
                                        <b>Contact:</b> {supplier.contact}<br />
                                    </Card.Text>
                                </Card.Body>
                                <ListGroup className="list-group-flush">
                                    <ListGroup.Item>
                                        <b>Product Types:</b> {supplier.product_types.join(', ')}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <b>Supplier Performance:</b><br />
                                        Quality: {supplier.sup_performance.quality}<br />
                                        Delivery Time: {supplier.sup_performance.delivery_time}
                                    </ListGroup.Item>
                                </ListGroup>
                                <Card.Body>
                                    <ButtonGroup size="sm">
                                        <Link to={`/supplier/update/${supplier._id}`} style={{ textDecoration: 'none' }}>
                                            <Button variant="primary" className="me-2">Edit Supplier</Button>
                                        </Link>
                                        <Button variant="danger" onClick={() => handleDeleteSupplier(supplier._id)}>Delete</Button>
                                    </ButtonGroup>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
            </div>
    )
}

export default Supplier;