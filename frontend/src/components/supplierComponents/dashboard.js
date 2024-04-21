import React, { useState, useEffect} from "react";
import {Form, Row, Col, Button, Card } from "react-bootstrap";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Layout from '../Layout';
import './supplier.css';
import { Divider } from "antd";

function LogisticDashboard() {

    return(
        <Layout>
            <div className="mb-2">
                <div className="layout-blue">
                    <div className="fw-light fs-6">Logistics Management</div>
                    <h1>Logistics Management</h1>
                </div>

                <p className="fw-light fs-4 mt-5  ">Stock Management</p>

                <div>
                    <Card className="h-100 text-white card-large card-shadow-1 luxery-yellow" >
                        <Card.Header>Stock Management</Card.Header>
                        <Card.Body className="d-flex flex-column">
                            <Card.Title>Stock Network</Card.Title>
                            <Card.Text>
                            Meet demand, minimize costs, and maximize operational efficiency in stock management
                            </Card.Text>
                            <div className=" mt-auto ml-auto">
                                <div className="mb-1 mt-4 ">Replenish inventory</div>
                                <Link to="/dashboard/stock">
                                    <Button variant="secondary" className="side-btn">
                                        <span>
                                        View supplies
                                        <i className="bi bi-cart4"></i></span>
                                    </Button>
                                </Link>
                            </div>   
                        </Card.Body>
                    </Card>
                </div>

                <p className="fw-light fs-4 mt-5">Supplier Management</p>

                <Row >
                    <Col xs={4}>
                        <Card className="h-100 text-white card-large card-shadow-1 luxery-yellow" >
                            <Card.Header>Supplier Management</Card.Header>
                            <Card.Body className="d-flex flex-column">
                                <Card.Title>Supplier Network</Card.Title>
                                <Card.Text>
                                Manage supplier network and safeguard sensitive details
                                </Card.Text>
                                <div className=" mt-auto ml-auto">
                                    <div className="mb-1 ">Add new suppliers to the system</div>
                                    <Link to="/supplier">
                                        <Button variant="secondary" className="side-btn">
                                            <span>
                                            View Suppliers
                                            <i className="bi bi-cart4"></i></span>
                                        </Button>
                                    </Link>
                                </div>   
                            </Card.Body>
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

                    <Col xs={3}>
                    {/* <Card  className="h-100 card-large card-shadow-1 middle-green">
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
                    </Card> */}
                    <Card className="h-100 text-white card-large card-shadow-1 middle-green" >
                        <Card.Header>RFQ Management</Card.Header>
                        <Card.Body className="d-flex flex-column">
                            <Card.Title>RFQ</Card.Title>
                            <Card.Text>
                            Ready to connect with new suppliers? Send a request to access their price lists and more
                            </Card.Text>
                            <div className=" mt-auto ml-auto">
                                <div className="mb-1 ">Want to call new suppliers?</div>
                                <Link to="/rfq">
                                    <Button variant="success" className="side-btn">
                                        <span>
                                        Call a new supplier
                                        <i className="bi bi-cart4"></i></span>
                                    </Button>
                                </Link>
                            </div>   
                        </Card.Body>
                    </Card>
                    </Col>
                </Row>
            </div>

            
        </Layout>
    )
}

export default LogisticDashboard;