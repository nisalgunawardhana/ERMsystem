import React, { useState } from "react";
import { Form, Button, Row, Col } from 'react-bootstrap';

function AddSupplier() {
    return(
        <div className="w-50 container mb-6">
            <h2>Add new Supplier</h2>

            <Form >
            <Form.Group controlId="supplierID">
                <Form.Label>Supplier ID</Form.Label>
                <Form.Control type="text" name="supplier_id" required />
            </Form.Group>

            <Form.Group controlId="supplierName">
                <Form.Label>Supplier Name</Form.Label>
                <Form.Control type="text" name="supplier_name" required />
            </Form.Group>

            <Form.Group controlId="supplierAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" name="supplier_address" required />
            </Form.Group>

            <Form.Group controlId="supplierContact">
                <Form.Label>Contact Number</Form.Label>
                <Form.Control type="text" name="supplier_contact" required />
            </Form.Group>

            <Form.Group controlId="supplierEmail">
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="text" name="supplier_email" required />
            </Form.Group>

            <div className="mt-2">
                <h6>Bank Details</h6>
                <Form.Group controlId="bank">
                    <Form.Label>Bank</Form.Label>
                    <Form.Control type="text" name="bank" required />
                </Form.Group>

                <Form.Group controlId="branch">
                    <Form.Label>branch</Form.Label>
                    <Form.Control type="text" name="branch" required />
                </Form.Group>

                <Form.Group controlId="accountNo">
                    <Form.Label>Account No</Form.Label>
                    <Form.Control type="number" name="account_no" required />
                </Form.Group>

                <Form.Group controlId="paymentMethod">
                    <Form.Label>Payment Method</Form.Label>
                    <Form.Control type="text" name="payment_method" required />
                </Form.Group>
            </div>
            <Row>
                <Col>
                <Form.Group >
                    <Form.Label>Products</Form.Label>
                    <Form.Control type="text" name="product_name" required />
                </Form.Group>
                </Col>
                <Col className="mt-4">
                <Button className="mt-2 mb-2" variant="success" type="submit">Add</Button>
                </Col>     
            </Row>

            <div>
                <h6>Product Details</h6>
                <Row>
                    <Col>
                    <Form.Group >
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control type="text" name="product_name"  required />
                    </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group >
                        <Form.Label>Unit Price</Form.Label>
                        <Form.Control type="text" name="unit_price" required />
                    </Form.Group>
                    </Col>
                    <div className="my-3">
                        <Button className="me-2" variant="outline-success">Add product</Button>
                        <Button variant="outline-danger">Remove product</Button>
                    </div>
                </Row>
            </div>
           
            <div>
                <h6>Supplier Performance</h6>
                <Row>
                    <Col>
                    <Form.Group controlId="supplierQuality">
                        <Form.Label>Quality</Form.Label>
                        <Form.Control type="text" name="supplier_quality" required />
                    </Form.Group>
                    </Col>
                
                    <Col>
                    <Form.Group controlId="supplierDelivery">
                        <Form.Label>Delivery time</Form.Label>
                        <Form.Control type="text" name="supplier_delivery" required />
                    </Form.Group>
                    </Col>
                </Row>
            </div>

            <div>
                <h6>Contract Details</h6>
                <Row>
                    <Col>
                    <Form.Group >
                        <Form.Label>Contract Start Date</Form.Label>
                        <Form.Control type="date" name="contract_start_date"  required />
                    </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group >
                        <Form.Label>End Date</Form.Label>
                        <Form.Control type="date" name="contract_end_date" required />
                    </Form.Group>
                    </Col>
                </Row>
            </div>
            

            <div className="d-flex flex-column align-items-center justify-content-center">
            <Button className="mt-3" variant="outline-primary" type="submit">Submit</Button>
            </div>
            
            </Form>
        </div>
    )
}

export default AddSupplier;