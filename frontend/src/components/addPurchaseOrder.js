import React from "react";
import {Form, Row, Col, Button } from "react-bootstrap";

function AddPurchaseOrder() {
    return (
        <div className="w-50 container">
            <h2>New Purchase Order</h2>

            <Form >
            <Form.Group controlId="POid">
                <Form.Label>Purchase Order ID</Form.Label>
                <Form.Control type="text" name="PO_id" required />
            </Form.Group>

            <Form.Group controlId="supplierID">
                <Form.Label>Supplier ID</Form.Label>
                <Form.Control type="text" name="supplier_id" required />
            </Form.Group>

            <Form.Group controlId="supplierName">
                <Form.Label>Supplier Name</Form.Label>
                <Form.Control type="text" name="supplier_name" required />
            </Form.Group>

            <Row className="my-2">
                <Col>
                <Form.Group controlId="orderDate">
                    <Form.Label>Order date</Form.Label>
                    <Form.Control type="date" name="order-Date" required />
                </Form.Group>
                </Col>

                <Col>
                <Form.Group controlId="deliveryDate">
                    <Form.Label>Delivery date</Form.Label>
                    <Form.Control type="date" name="delivery_Date" required />
                </Form.Group>
                </Col>
            </Row>
            
            <div className="mt-3">
                <h6>Order Items</h6>
                <Form.Group controlId="orderItemName">
                    <Form.Label>Item Name</Form.Label>
                    <Form.Control type="text" name="order_item_name" required />
                </Form.Group>

                <Row>
                <Col>
                <Form.Group controlId="orderItemUnitPrice">
                    <Form.Label>Unit Price</Form.Label>
                    <Form.Control type="text" name="order_item_unit_price" required />
                </Form.Group>
                </Col>
                <Col>
                <Form.Group controlId="orderItemQuantity">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control type="number" name="order_item_quantity" required />
                </Form.Group>
                </Col>
                </Row>

                <Row>
                <Col>
                <Form.Group controlId="orderItemDescription">
                    <Form.Label>Item Specifications</Form.Label>
                    <small class="text-muted"> not required</small>
                    <Form.Control as="textarea" rows={2} name="order_item_description"/>
                </Form.Group>
                </Col>
                <Col className="mt-4">
                <Button className="mt-2 mb-2" variant="success" type="submit">Add</Button>
                </Col>
                </Row>

                <p className="mt-2">Total</p>
            </div>

            <div className="mt-3">
                <h6>Delivery Information</h6>
                <Row>
                    <Col>
                    <Form.Group >
                        <Form.Label>Delivery Method</Form.Label>
                        <Form.Control type="text" name="delivery_method"/>
                    </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group >
                        <Form.Label>Delivery Costs</Form.Label>
                        <Form.Control type="text" name="delivery_costs" required />
                    </Form.Group>
                    </Col>
                </Row>
            </div>

            <div className="mt-3">
            <Form.Group controlId="additionalOrderInfo">
                <Form.Label>Additional Information</Form.Label>
                <Form.Control as="textarea" rows={3} name="additional_order_info"/>
            </Form.Group>

            <Form.Group controlId="invoicdID">
                <Form.Label>Invoice Number</Form.Label>
                <Form.Control type="text" name="invoice_id" required />
            </Form.Group>
            </div>

            <div>
            <p className="my-3 fs-5">Total Order Amount</p>
            </div>

            <div className="mt-3">
                <h6>Tract your Purchase Order</h6>
                <Row>
                    <Col>
                        <Form.Group >
                            <Form.Label>Order Status</Form.Label>
                            <Col>
                            <input type="radio" class="btn-check" id="order_pending" autocomplete="off" checked/>
                            <label class="btn btn-secondary me-2" for="order_pending">Pending</label>

                            <input type="radio" class="btn-check" id="order_delivered" autocomplete="off"/>
                            <label class="btn btn-secondary" for="order_delivered">Delivered</label>
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group >
                            <Form.Label>Payment Status</Form.Label>
                            <Col>
                            <input type="radio" class="btn-check" name="options-outlined" id="order_payment_paid" autocomplete="off" checked/>
                            <label class="btn btn-secondary me-2" for="order_payment_paid">Paid</label>

                            <input type="radio" class="btn-check" name="options-outlined" id="order_payment_unpaid" autocomplete="off"/>
                            <label class="btn btn-secondary" for="order_payment_unpaid">Unpaid</label>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
            </div>
            

            <div className="d-flex flex-column align-items-center justify-content-center">
            <Button className="mt-4" variant="primary" type="submit">Submit</Button>
            </div>
            
            </Form>
        </div>
    );
}

export default AddPurchaseOrder;