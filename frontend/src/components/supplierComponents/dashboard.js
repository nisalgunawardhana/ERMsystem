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

                <div>
                    <div className="mt-5">
                        <Row>
                            <Col>
                            <div className="card new-blue">
                                <div className="card-statistic-3 p-4">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="col-8">
                                            <h6 className="d-flex align-items-center text-secondary mb-1">
                                                Meet demand, minimize costs, and maximize operational efficiency in stock management
                                            </h6>
                                            <h5 className="card-title fs-3" >Stock Management </h5>
                                            <div>
                                                <Link to="/stock">
                                                <Button variant="dark " className="side-btn mt-5 mb-2 ">
                                                    <span>
                                                    Stock Management
                                                    <i className="bi bi-basket"></i></span>
                                                </Button>
                                                </Link>
                                            </div>
                                        </div>
                                        <i className="bi bi-basket h1"></i>
                                    </div>
                                    <div className="progress mt-1 " data-height="8" style={{ height: '8px' }}>
                                        <div className="progress-bar orange" role="progressbar" data-width="25%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{ width: '75%' }}></div>
                                    </div>
                                </div>
                            </div>
                            </Col>
                            <Col>
                            <div className="card ash">
                                <div className="card-statistic-3 p-4 ">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <div className="col-8">
                                            <h6 className="d-flex align-items-center  mb-1">
                                            Focuses on fostering strong partnerships with suppliers to optimize cost, quality, and delivery.
                                            </h6>
                                            <h5 className="card-title fs-3" >Supplier Management </h5>
                                            <div>
                                                <Link to="/supplier">
                                                    <Button variant="dark" className="side-btn mt-5 mb-2">
                                                        <span>
                                                        Supplier Management
                                                        <i className="bi bi-cart4"></i></span>
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                        <i className="bi bi-shop h1"></i>
                                    </div>
                                    <div className="progress mt-1  " data-height="8" style={{ height: '8px' }}>
                                        <div className="progress-bar orange" role="progressbar" data-width="25%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{ width: '75%' }}></div>
                                    </div>
                                </div>
                            </div>
                            </Col>
                        </Row>
                    </div>
                </div>


                
                <Row className="mt-4">
                    <div className="fw-semibold">Quick References</div>
                    <Col >
                        <p className="fw-light fs-4  ">Stock Management</p>
                    </Col>
                    <Col >
                        <p className="fw-light fs-4">Supplier Management</p>
                    </Col>
                </Row>
                <Row>
                    <Col >
                        <div className="card luxery-yellow" style={{height:"90%"}}>
                            <div className="card-statistic-3 p-4 ">
                                <div className="text-center">
                                    <div className="mt-4">
                                        <h3 ><i className="bi bi-car-front-fill"></i></h3>
                                        <div className="text-secondary fw-light fs-6">Stock Management</div>
                                        <h5 className="card-title fs-4 layout-blue" >Toys<br></br> Management </h5>
                                        <div>
                                            <Link to="/stock">
                                            <Button variant="dark" className=" side-btn mt-5 mb-2 ">
                                                Toys Management
                                            </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="progress mt-1 " data-height="8" style={{ height: '8px' }}>
                                    <div className="progress-bar orange" role="progressbar" data-width="25%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{ width: '50%' }}></div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col> 
                        <div className="card luxery-yellow" style={{height:"90%"}}>
                            <div className="card-statistic-3 p-4 ">
                                <div className="text-center">
                                    <div className="mt-4">
                                        <h3 >< i className="ri-shirt-fill"></i></h3>
                                        <div className="text-secondary fw-light fs-6">Stock Management</div>
                                        <h5 className="card-title fs-4 layout-blue" >Clothes <br/> Management </h5>
                                        <div>
                                            <Link to="/stock">
                                            <Button variant="dark" className=" side-btn mt-5 mb-2 ">
                                                Clothes Management
                                            </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="progress mt-1 " data-height="8" style={{ height: '8px' }}>
                                    <div className="progress-bar orange" role="progressbar" data-width="25%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{ width: '50%' }}></div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col>
                     <div className="card middle-green" style={{height:"90%"}}>
                            <div className="card-statistic-3 p-4 ">
                                <div className="text-center">
                                    <div className="mt-4">
                                        <h3 >< i className="bi bi-file-earmark-text-fill"></i></h3>
                                        <div className="text-secondary fw-light fs-6">Supplier Management</div>
                                        <h5 className="card-title fs-4 layout-blue" >Purchase Orders Management </h5>
                                        <div>
                                            <Link to="/purchaseOrder" >
                                            <Button variant="dark" className=" side-btn mt-5 mb-2 " style={{padding:"8px", width:"245px"}}>
                                                Purchase Order Management
                                            </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="progress mt-1 " data-height="8" style={{ height: '8px' }}>
                                    <div className="progress-bar orange" role="progressbar" data-width="25%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{ width: '50%' }}></div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col>
                    <div className="card ash" style={{height:"90%"}}>
                            <div className="card-statistic-3 p-4 ">
                                <div className="text-center">
                                    <div className="mt-4">
                                        <h3 >< i className="bi bi-mailbox2-flag "></i></h3>
                                        <div className=" fw-light fs-6">Supplier Management</div>
                                        <h5 className="card-title fs-4 layout-blue" >RFQ <br></br>Management </h5>
                                        <div>
                                            <Link to="/rfq" >
                                            <Button variant="dark" className=" side-btn mt-5 mb-2 " style={{padding:"8px", width:"245px"}}>
                                                RFQ Management
                                            </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="progress mt-1 " data-height="8" style={{ height: '8px' }}>
                                    <div className="progress-bar orange" role="progressbar" data-width="25%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{ width: '50%' }}></div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            
        </Layout>
    )
}

export default LogisticDashboard;