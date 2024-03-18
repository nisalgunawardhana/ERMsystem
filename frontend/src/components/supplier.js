import React, { useState } from "react";
import {Button, Card, Row, Col } from 'react-bootstrap';
import {Link} from "react-router-dom";

function Supplier () {
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
                        <Card.Title>Purchase Orders</Card.Title>
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
                        <Link to="#"><Button variant="success">Create RFQ</Button></Link>
                    </Card.Body>
                </Card>
                </Col>
            </Row>
            
            </div>
        </div>
    )
}

export default Supplier;