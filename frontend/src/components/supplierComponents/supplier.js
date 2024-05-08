import React, { useEffect, useState } from "react";
import {Button, Card, Row, Col,Form, ListGroup, InputGroup} from 'react-bootstrap';
import { Link } from "react-router-dom";
import axios from "axios";
import Layout from '../Layout';
import './supplier.css';

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
                        <div class="container">
                            <div class="header">
                                <h2>Supplier Details Report</h2>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Supplier Name</th>
                                        <th>Supplier ID</th>
                                        <th>Address</th>
                                        <th>Email</th>
                                        <th>Contact</th>
                                        <th>Product Types</th>
                                        <th>Quality</th>
                                        <th>Delivery Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${renderSuppliers.map(supplier => `
                                        <tr>
                                            <td>${supplier.supplier_name}</td>
                                            <td>${supplier.supplier_id}</td>
                                            <td>${supplier.address}</td>
                                            <td>${supplier.email}</td>
                                            <td>${supplier.contact}</td>
                                            <td>${supplier.product_types.join(', ')}</td>
                                            <td>${supplier.sup_performance.quality}</td>
                                            <td>${supplier.sup_performance.delivery_time}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };


    const renderSuppliers = searchQuery === "" ? suppliers : searchResults

    return(
        <Layout>
            <div className="container-fluid bg">
                <h2><span className="fw-light fs-5 mb-5">Supplier and Purchase Order Management</span><br></br>
                Manage Suppliers and Purchase Orders</h2>

                <div className="mt-4">
                    <Row>
                        <Col>
                        <div className="card">
                            <div className="card-statistic-3 p-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="col-8">
                                        <h6 className="d-flex align-items-center text-secondary mb-1">
                                            Supplier details
                                        </h6>
                                        <h5 className="card-title fs-4" >Enhance Supplier Network</h5>
                                        <div>
                                            <Row>
                                                <Col xs={6}>
                                                    <Link to="/dashboard/logistics/supplier/add">
                                                    <Button variant="dark" className="side-btn mt-5 mb-2 ">
                                                        <span>
                                                        Add a new Supplier
                                                        <i className="bi bi-people-fill"></i></span>
                                                    </Button>
                                                    </Link>
                                                </Col>
                                                <Col xs={6}>
                                                    <Link to="/dashboard/logistics/rfq">
                                                    <Button variant="outline-success" className="side-btn mt-5 mb-2">
                                                        <span>
                                                        Create a <br></br>RFQ
                                                        <i className="bi bi-calculator"></i></span>
                                                    </Button>
                                                    </Link>
                                                </Col>
                                            </Row>
                                            
                                            
                                        </div>
                                    </div>
                                    <i className="bi bi-people-fill h1"></i>
                                </div>
                                <div className="progress mt-1 " data-height="8" style={{ height: '8px' }}>
                                    <div className="progress-bar orange" role="progressbar" data-width="25%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{ width: '75%' }}></div>
                                </div>
                            </div>
                        </div>
                        </Col>
                        <Col>
                        <div className="card ">
                            <div className="card-statistic-3 p-4 ">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <div className="col-8">
                                        <h6 className="d-flex align-items-center text-secondary  mb-1">
                                            Supplier report
                                        </h6>
                                        <h5 className="card-title " >Generate supplier report for financial processes</h5>
                                        <div>
                                            <Button className="mb-2 mt-5 position-relative bottom-0 start-0 text-white" variant="dark" onClick={handleSupplierReport}>Supplier report</Button>
                                        </div>
                                    </div>
                                    <i className="bi bi-file-earmark-bar-graph-fill h1"></i>
                                </div>
                                <div className="progress mt-1  " data-height="8" style={{ height: '8px' }}>
                                    <div className="progress-bar orange" role="progressbar" data-width="25%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{ width: '75%' }}></div>
                                </div>
                            </div>
                        </div>
                        </Col>
                    </Row>
                </div>
                

                <div className="mt-3">
                    <div className="fw-light fs-3 mb-1 ms-2 text-center">All Suppliers</div>
                    <div className="d-flex justify-content-center">
                    <Form className="w-50 ms-4">
                        <Form.Group controlId="formSearch">
                            <Row>
                                <Col >
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Supplier name"
                                        aria-label="formsearchSup"
                                        aria-describedby="basic-addon1"
                                        value={searchQuery}
                                        onChange={handleSearchSupplier}
                                    />
                                </Col>
                                <Col xs={2}>
                                    <Button variant="outline-secondary search-button" onClick={handleSearchSupplier}>
                                        <i className="bi bi-search search-icon"></i>
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Form>
                    </div>
                </div>  

                <div className="mt-4">
                <Row xs={1} sm={2} md={3} lg={4}>
                    {renderSuppliers.map((supplier, index) => (
                        <Col key={index} className="mb-4">
                            <Card className="card-up card-shadow-1" style={{height:"90%"}} >
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
                                <Card.Body >
                                    <div className="fw-light">Supplier Performance:</div>
                                    <div>Quality: {supplier.sup_performance.quality}</div>
                                    <div>Delivery Time: {supplier.sup_performance.delivery_time}</div>
                                    
                                    <div>
                                        <div className="mt-4 d-flex flex-column justify-content-between align-items-center">
                                            <Link to={`/dashboard/logistics/supplier/get/${supplier._id}`} style={{ textDecoration: 'none' }}>
                                                <Button variant="dark" id="up-btn" size="sm" className="mt-2">
                                                    <i className="bi bi-shop-window me-2"></i> View Supplier
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    </Layout>
    )
}

export default Supplier;

{/* <tr>
    <th scope="row"><i className="bi bi-list-ul"></i>&nbsp;&nbsp; Profit Log ID:</th>
    <td>{searchResult ? searchResult[0].Profit_ID : profit.Profit_ID}</td>
</tr> */}