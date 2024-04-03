import React, { useState } from "react";
import {Form, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function AddPurchaseOrder() {

    const navigate = useNavigate();

    const [purchaseOrder_id, setPOid] = useState("");
    const [supplier_id, setSupId] = useState("");
    const [supplier_name, setSupName] = useState("");
    const [order_date, setPurchaseOrderDate] = useState("");
    const [deliver_date, setDeliveryDate] = useState("");
    const [item_name, setItemName] = useState("");
    const [unit_price, setUnitPrice] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [description, setDescription] = useState("");
    const [total, setTotal] = useState(0);
    const [orderList, setOrderList] = useState([]);
    const [order_amount, setOrderAmount] = useState(0);
    const [delivery_method, setDeliveryMethod] = useState("");
    const [delivery_costs, setDeliveryCosts] = useState(0);
    const [payment_details, setPaymentDetails] = useState({payment_terms: "", payment_method: ""});
    const [additional_infomation, setAdditionalDetails] = useState("");
    const [invoice_no, setInvoiceNo] = useState(0);
    const [total_order_amount, setTotalOrderAmount] = useState(0);
    const [order_status, setOrderStatus] = useState("Pending");
    const [payment_status, setPaymentStatus] = useState("Paid");

    
    function sendDataPO(e) {
        e.preventDefault();

        const order_items_list = orderList.map(item => ({
            item_name: item.name,
            quantity: item.qty,
            unit_price: item.price,
            description: item.special,
            total_price: item.tot
        }));

        const newPurchaseOrder = {
            purchaseOrder_id,
            supplier_id,
            supplier_name,
            order_date,
            deliver_date,
            order_items: order_items_list,
            order_amount,
            delivery_information: {
                delivery_method: delivery_method,
                delivery_costs: delivery_costs
            },
            payment_information: {
                payment_terms: payment_details.payment_terms,
                payment_method: payment_details.payment_method
            },
            additional_infomation,
            invoice_no,
            total_order_amount,
            order_status,
            payment_status
        };

        axios.post("http://localhost:8080/purchaseOrder/add", newPurchaseOrder).then(() => {
            alert("New Purchase Order");
            navigate("/purchaseOrder");
        }).catch((err) => {
            alert(err);
        })

        console.log(newPurchaseOrder);
    }


    //Add Order Items and display Total Amount
    const handleAddOrderItems = () => {
        const totalAmount = quantity * unit_price;

        const newOrderItem = { name: item_name, price: unit_price, qty: quantity, special: description, tot: totalAmount };
        setOrderList([...orderList, newOrderItem]);

        const newOrderAmount = order_amount + totalAmount;
        setOrderAmount(newOrderAmount);
        setTotalOrderAmount(newOrderAmount + delivery_costs);
        setItemName("");
        setUnitPrice(0.00);
        setQuantity(0);
        setTotal(0.00);

    }
    
    //Add delivery costs + order Amount
    const handleAddDeliveryCost = (e) => {
        const newDeliveryCosts = parseFloat(e.target.value);
        const newTotalOrderAmount = order_amount + newDeliveryCosts;
        setDeliveryCosts(newDeliveryCosts);
        setTotalOrderAmount(newTotalOrderAmount);
    }
    

    return (
        <div className="w-50 container">
            <h2>New Purchase Order</h2>

            <Form onSubmit={sendDataPO}>
            <Form.Group controlId="POid">
                <Form.Label>Purchase Order ID</Form.Label>
                <Form.Control type="text" name="purchaseOrder_id" required 
                value={purchaseOrder_id}
                onChange={(e) => {
                    setPOid(e.target.value)
                }} />
            </Form.Group>

            <Form.Group controlId="supplierID">
                <Form.Label>Supplier ID</Form.Label>
                <Form.Control type="text" name="supplier_id" required
                value={supplier_id} 
                onChange={(e) => {
                    setSupId(e.target.value);
                }}/>
            </Form.Group>

            <Form.Group controlId="supplierName">
                <Form.Label>Supplier Name</Form.Label>
                <Form.Control type="text" name="supplier_name" required
                onChange={(e) => {
                    setSupName(e.target.value);
                }}/>
            </Form.Group>

            <Row className="my-2">
                <Col>
                <Form.Group controlId="orderDate">
                    <Form.Label>Order date</Form.Label>
                    <Form.Control type="date" name="order-Date" value={order_date}required 
                    onChange={(e) => {
                        setPurchaseOrderDate(e.target.value);
                    }}/>
                </Form.Group>
                </Col>

                <Col>
                <Form.Group controlId="deliveryDate">
                    <Form.Label>Delivery date</Form.Label>
                    <Form.Control type="date" name="deliver_date" value={deliver_date} required 
                    onChange={(e) => {
                        setDeliveryDate(e.target.value);
                    }}/>
                </Form.Group>
                </Col>
            </Row>
            
            <div className="mt-3">
                <h6>Order Items</h6>
                <Form.Group controlId="orderItemName">
                    <Form.Label>Item Name</Form.Label>
                    <Form.Control type="text" name="order_item_name"  
                    value={item_name}
                    onChange={(e) => {
                        setItemName(e.target.value);
                    }}/>
                </Form.Group>

                <Row>
                <Col>
                <Form.Group controlId="orderItemUnitPrice">
                    <Form.Label>Unit Price</Form.Label>
                    <Form.Control type="text" name="order_item_unit_price" required
                    value={unit_price}  
                    onChange={(e) => {
                        setUnitPrice(e.target.value);
                    }}/>
                </Form.Group>
                </Col>
                <Col>
                <Form.Group controlId="orderItemQuantity">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control type="number" name="order_item_quantity" required
                    value={quantity} 
                    onChange={(e) => {
                        const newQuantity = parseInt(e.target.value);
                        const newTotal = newQuantity * unit_price;
                        setQuantity(newQuantity);
                        setTotal(newTotal);
                    }}/>
                </Form.Group>
                </Col>
                <Col className="text-center fs-5 ">
                    <Row><p >Total </p></Row>
                    <Row><p>Rs. {total} </p></Row>
                </Col>
                </Row>

                <Row>
                <Col className="mt-2">
                <Form.Group controlId="orderItemDescription">
                    <Form.Label>Item description</Form.Label>
                    <small class="text-muted"> not required</small>
                    <Form.Control as="textarea" rows={2} name="order_item_description"
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value);
                    }}/>
                </Form.Group>
                </Col>
                <Col className="mt-4">
                <Button className="mt-4 mb-2" variant="success" type="submit" onClick={handleAddOrderItems}>Add Item to Purchase Order</Button>
                </Col>
                </Row>

                <div className="container">
                    <div className="bg-primary-subtle text-center">
                    <Row className="my-3 ">
                        <div className="row justify-content-center">
                            <table className="col-md-8">
                                {orderList.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name}:</td>
                                        <td>Rs.{item.price}</td> 
                                        <td>{item.qty}</td>
                                        <td>Rs.{item.tot}</td> 
                                    </tr>
                                ))}
                            </table>
                        </div>
                    </Row>
                    </div>
                </div>

                <h5 className="my-5">Order Amount : Rs. {order_amount}</h5>
            </div>

            <div className="mt-3">
                <h6>Delivery Information</h6>
                <Row>
                    <Col>
                    <Form.Group >
                        <Form.Label>Delivery Method</Form.Label>
                        <Form.Control type="text" name="delivery_method" required
                        value={delivery_method}
                        onChange={(e) => {
                            setDeliveryMethod(e.target.value);
                        }}/>
                    </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group >
                        <Form.Label>Delivery Costs</Form.Label>
                        <Form.Control type="text" name="delivery_costs" 
                        value={delivery_costs} 
                        onChange={handleAddDeliveryCost}
                        />
                    </Form.Group>
                    </Col>
                </Row>
            </div>

            <div className="mt-3">
                <h6>Payment Information</h6>
                <Row>
                    <Col>
                    <Form.Group >
                        <Form.Label>Payment Method</Form.Label>
                        <Form.Control type="text" name="payment_method" required
                        value={payment_details.payment_method}
                        onChange={(e) => {
                            setPaymentDetails({ ...payment_details, payment_method: e.target.value});
                        }}/>
                    </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group >
                        <Form.Label>Payment Terms and Aggrements</Form.Label>
                        <Form.Control as="textarea" rows={3} name="payment_terms" required
                        value={payment_details.payment_terms}
                        onChange={(e) => {
                            setPaymentDetails({ ...payment_details, payment_terms: e.target.value});
                        }}/>
                    </Form.Group>
                    </Col>
                </Row>
            </div>

            <div className="mt-3">
            <Form.Group controlId="additionalOrderInfo">
                <Form.Label>Additional Information</Form.Label>
                <Form.Control as="textarea" rows={3} name="additional_infomation"
                value={additional_infomation}
                onChange={(e) => {
                    setAdditionalDetails(e.target.value);
                }}/>
            </Form.Group>

            <Form.Group controlId="invoicdID">
                <Form.Label>Invoice Number</Form.Label>
                <Form.Control type="text" name="invoice_id"
                value={invoice_no}
                onChange={(e) => {
                    setInvoiceNo(e.target.value);
                }} />
            </Form.Group>
            </div>

            <div>
            <h3 className="my-5">Total Order Amount : Rs. {total_order_amount}</h3>
            </div>

            <div className="mt-3 text-center">
                <h6>Tract your Purchase Order</h6>
                <Row>
                    <Col>
                        <Form.Group >
                            <Form.Label>Order Status</Form.Label>
                            <Col>
                            <input type="radio" class="btn-check" name="order_status" id="order_pending" autocomplete="off" checked={order_status === "Pending"}
                            onChange={() => {
                                setOrderStatus("Pending");
                            }}/>
                            <label class="btn btn-secondary me-2" for="order_pending">Pending</label>

                            <input type="radio" class="btn-check" name="order_status" id="order_delivered" autocomplete="off" checked={order_status === "Delivered"}
                            onChange={() => {
                                setOrderStatus("Delivered");
                            }}/>
                            <label class="btn btn-secondary" for="order_delivered">Delivered</label>
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group >
                            <Form.Label>Payment Status</Form.Label>
                            <Col>
                            <input type="radio" class="btn-check"  name="payment_status" id="order_payment_paid" autocomplete="off" checked={payment_status === "Paid"}
                            onChange={() => {
                                setPaymentStatus("Paid");
                            }}/>
                            <label class="btn btn-secondary me-2" for="order_payment_paid">Paid</label>

                            <input type="radio" class="btn-check"  name="payment_status" id="order_payment_unpaid" autocomplete="off" checked={payment_status === "UnPaid"}
                            onChange={() => {
                                setPaymentStatus("UnPaid");
                            }}/>
                            <label class="btn btn-secondary" for="order_payment_unpaid">Unpaid</label>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
            </div>
            

            <div className="d-flex flex-column align-items-center justify-content-center">
            <Button className="mt-4 col-md-4" variant="primary" type="submit">Create Purchase Order</Button>
            </div>
            
            </Form>
        </div>
    );
}

export default AddPurchaseOrder;