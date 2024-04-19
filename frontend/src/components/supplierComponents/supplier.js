import React, { useEffect, useState } from "react";
import {Button, Card, Row, Col,Form, ListGroup, InputGroup} from 'react-bootstrap';
import { Link } from "react-router-dom";
import axios from "axios";
// import "./supplier.css";

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


    //SUPPLIER REPORT GENERATION
    const handleSupplierReport = () => {
        const printWindow = window.open("", "_blank", "width=600,height=600");
        printWindow.document.write(`
            <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Purchase Order</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            padding: 20px;
                            background-color: #f5f5f5;
                        }

                        .container {
                            max-width: 90%;
                            margin: 0 auto;
                            background-color: #fff;
                            border-radius: 10px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            padding: 20px;
                        }

                        .header {
                            text-align: center;
                            margin-bottom: 20px;
                        }

                        .section {
                            margin-bottom: 20px;
                        }

                        .section-title {
                            font-size: 20px;
                            font-weight: bold;
                            margin-bottom: 10px;
                        }

                        .item {
                            margin-left: 20px;
                        }

                        .item-title {
                            font-weight: bold;
                        }

                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 20px;
                            border-radius: 10px;
                            overflow: hidden;
                        }

                        th, td {
                            border: 1px solid #ddd;
                            padding: 12px;
                            text-align: left;
                        }

                        th {
                            background-color: #f2f2f2;
                            text-align: left;
                        }

                        .bg-info {
                            background-color: #F1EEDC;
                            color: #fff;
                            padding: 10px 15px;
                            border-radius: 5px;
                        }

                        .bg-info-dates{
                            background-color: #B3C8CF;
                            color: #fff;
                            padding: 10px 15px;
                            border-radius: 5px;
                        }

                        .bg-success-subtle {
                            background-color: #d4edda;
                            color: #155724;
                            padding: 10px 15px;
                            border-radius: 5px;
                        }
                    </style>

                    </head>
                    <body>
                        
                    </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };


    const renderSuppliers = searchQuery === "" ? suppliers : searchResults

    return(
            <div className="container-fluid bg ">
                <h2><span className="fw-light fs-5">Supplier and Purchase Order Management</span><br></br>
                Manage Suppliers and Purchase Orders</h2>

                <div className="mt-5 ">
                    <Row >
                        <Col xs={4}>
                            <Card className="h-100 text-white card-large card-shadow-1 luxery-yellow">
                                <Card.Header>Supplier Management</Card.Header>
                                <Card.Body>
                                    <Card.Title>Suppliers</Card.Title>
                                    <Card.Text>
                                        Manage supplier network and safeguard sensitive details
                                        <Button className="mt-3 text-white" variant="secondary" onClick={handleSupplierReport}>Supplier report</Button>
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer className="d-flex justify-content-end flex-column align-items-end" >
                                    <div className="text-secondary  mb-auto">Insert new supplier details to the system</div>
                                    <Link to="/supplier/add">
                                        <Button variant="secondary" className="mt-1 mb-2 side-btn"><span>Add Supplier<i className="bi bi-shop"></i></span></Button>
                                    </Link>
                                </Card.Footer>
                            </Card> 
                        </Col>
                        <Col xs={5}>
                            <Card className="h-100 text-white card-large card-shadow-1 dark-blue" >
                                <Card.Header>Purchase Order Management</Card.Header>
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title>Purchase Orders</Card.Title>
                                    <Card.Text>
                                        Simplify purchase order management process for streamlined efficiency
                                    </Card.Text>
                                    <div className=" mt-auto ml-auto">
                                        <div className="mb-1 ">Restock Inventory by making a order</div>
                                        <Link to="/purchaseOrder">
                                            <Button variant="primary" className="side-btn">
                                                <span>
                                                Manage Purchase Orders
                                                <i className="bi bi-cart4"></i></span>
                                            </Button>
                                        </Link>
                                    </div>   
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col xs={3} >
                        <Card style={{ width: '20rem'}} className="h-100 card-large card-shadow-1 middle-green">
                            <Card.Body  className="d-flex flex-column">
                                <Card.Title>RFQ</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Requests For Quotations</Card.Subtitle>
                                <Card.Text>
                                Ready to connect with new suppliers? Send a request to access their price lists and more
                                </Card.Text>
                                <div className=" mt-auto ml-auto">
                                    <div className="mb-1  text-success">Want to call new suppliers?</div>
                                    <Link to="/rfq">
                                        <Button variant="success" className="side-btn">
                                            <span>
                                            Call a supplier<i className="bi bi-send"></i>
                                            </span>
                                        </Button>
                                    </Link>
                                </div>  
                            </Card.Body>
                        </Card>
                        </Col>
                    </Row>
                </div>

                
                <div className="mt-5 ">
                    <div className="fw-light fs-3 mb-1 ms-2 text-center">All Suppliers</div>
                    <div className="d-flex justify-content-center">
                    <Form className="w-50 ms-4">
                        <Form.Group controlId="formSearch">
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Supplier name"
                                    aria-label="formsearchSup"
                                    aria-describedby="basic-addon1"
                                    value={searchQuery}
                                    onChange={handleSearchSupplier}
                                />
                                <Button variant="outline-secondary" id="button-addon3" onClick={handleSearchSupplier}>
                                    <i className="bi bi-search"></i>
                                </Button>
                            </InputGroup>
                        </Form.Group>
                    </Form>
                    </div>
                </div>  

                <div className="mt-4">
                <Row xs={1} sm={2} md={3} lg={4}>
                    {renderSuppliers.map((supplier, index) => (
                        <Col key={index} className="mb-4">
                            <Card className="h-100 card-up card-shadow-1" >
                                <Card.Body>
                                    <Card.Title className="text-center">{supplier.supplier_name}</Card.Title><br></br>
                                    <Card.Text className="text-center">
                                    <div className="fw-light">Supplier ID: <span className="fw-normal">{supplier.supplier_id}</span></div>
                                    <div className="fw-light">Address: <span className="fw-normal">{supplier.address}</span></div>
                                    <div className="fw-light">Email: <span className="fw-normal">{supplier.email}</span></div>
                                    <div className="fw-light">Contact: <span className="fw-normal">{supplier.contact}</span></div>
                                    </Card.Text>
                                </Card.Body>
                                <ListGroup className="list-group-flush" >
                                    <ListGroup.Item className="">
                                        <div className="fw-light">Product Types:</div> {supplier.product_types.join(', ')}
                                    </ListGroup.Item>
                                </ListGroup>
                                <Card.Body className="">
                                        <div className="fw-light">Supplier Performance:</div>
                                        <div>Quality: {supplier.sup_performance.quality}</div>
                                        <div>Delivery Time: {supplier.sup_performance.delivery_time}</div>
                                </Card.Body><hr></hr>
                                <Card.Body className="d-flex justify-content-end align-items-end">
                                    <Row className="g-0">
                                        <Col>
                                            <Link to={`/supplier/get/${supplier._id}`} className="d-flex justify-content-center align-items-center" style={{ textDecoration: 'none' }}>
                                                <Button variant="dark" id="up-btn" size="sm" className="mt-2 border-0">
                                                    <i className="bi bi-shop-window me-2"></i> View Supplier
                                                </Button>
                                            </Link>
                                        </Col>
                                    </Row>
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

{/* <tr>
    <th scope="row"><i className="bi bi-list-ul"></i>&nbsp;&nbsp; Profit Log ID:</th>
    <td>{searchResult ? searchResult[0].Profit_ID : profit.Profit_ID}</td>
</tr> */}