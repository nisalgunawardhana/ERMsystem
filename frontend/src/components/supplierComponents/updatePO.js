import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';

function UpdatePurchaseOrder() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [purchaseOrder, setPurchaseOrder] = useState({
        purchaseOrder_id: "",
        supplier_id: "",
        supplier_name: "",
        order_date: "",
        deliver_date: "",
        order_items: [],
        order_amount: 0,
        delivery_information: {
            delivery_method: "",
            delivery_costs: 0
        },
        payment_information: {
            payment_terms: "",
            payment_method: ""
        },
        additional_infomation: "",
        invoice_no: 0,
        total_order_amount: 0,
        order_status: "",
        payment_status: ""
    });

    const [newOrderItem, setNewOrderItem] = useState({
        item_name: "",
        quantity: 0,
        unit_price: 0,
        description: "",
        total_price: 0
    });
    

    useEffect(() => {
        axios.get(`http://localhost:8080/purchaseOrder/get/${id}`)
            .then(response => {
                const { po } = response.data;
                setPurchaseOrder({
                    ...po,
                    order_date: po.order_date ? po.order_date.substring(0, 10) : "", //order date
                    deliver_date: po.deliver_date ? po.deliver_date.substring(0, 10) : "" //deliver date
                });
            })
            .catch(error => {
                console.error("Error fetching purchase order:", error);
            });
    }, [id]);
    

    const handleChange = e => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setPurchaseOrder(prevState => ({
                ...prevState,
                [parent]: {
                    ...prevState[parent],
                    [child]: value
                }
            }));
        } else {
            setPurchaseOrder(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };
       

    
    //HANDLE FORM SUBMIT
    const handleSubmit = e => {
        e.preventDefault();
        axios.put(`http://localhost:8080/purchaseOrder/update/${id}`, purchaseOrder)
            .then(() => {
                alert("Purchase Order updated successfully");
                navigate("/purchaseOrder");
            })
            .catch(error => {
                console.error("Error updating purchase order:", error);
            });
    };

    //ADD DELIVER COSTS
    const handleDeliveryCostsChange = e => {
        const { value } = e.target;
        const orderAmount = parseFloat(purchaseOrder.order_amount);
        const deliveryCosts = parseFloat(value);
        const totalOrderAmount = deliveryCosts + orderAmount;
        setPurchaseOrder(prevState => ({
            ...prevState,
            delivery_information: {
                ...prevState.delivery_information,
                delivery_costs: deliveryCosts // Ensure it's stored as a number
            },
            total_order_amount: totalOrderAmount
        }));
    };

    //ADD NEW ORDER ITEM
    const handleAddNewItem = () => {
        // Calculate the total price for the new order item
        const totalPrice = parseFloat(newOrderItem.unit_price) * parseFloat(newOrderItem.quantity);

        // Update the order amount and total order amount in the purchase order state
        const orderAmount = parseFloat(purchaseOrder.order_amount) + totalPrice;
        const totalOrderAmount = parseFloat(purchaseOrder.delivery_information.delivery_costs) + orderAmount;

        // Create the new order item with the calculated total price
        const newItem = {
            ...newOrderItem,
            total_price: totalPrice
        };

        // Update the purchase order state with the new order item and updated amounts
        setPurchaseOrder(prevState => ({
            ...prevState,
            order_items: [...prevState.order_items, newItem],
            order_amount: orderAmount,
            total_order_amount: totalOrderAmount
        }));

        // Reset the new order item state for the next item
        setNewOrderItem({
            item_name: "",
            quantity: 0,
            unit_price: 0,
            description: ""
        });
    };

    

    //DELETE PREVIOUS ORDER ITEM
    const handleDeleteItem = index => {
        setPurchaseOrder(prevState => {
            // Remove the item at the specified index
            const updatedItems = [...prevState.order_items];
            updatedItems.splice(index, 1);

            // Recalculate order amount based on remaining items
            const orderAmount = updatedItems.reduce((acc, item) => acc + item.total_price, 0);

            // Update total order amount
            const totalOrderAmount = prevState.delivery_information.delivery_costs + orderAmount;

            // Return the updated state
            return {
                ...prevState,
                order_items: updatedItems,
                order_amount: orderAmount,
                total_order_amount: totalOrderAmount
            };
        });
    };


    return(
        <div className="bg">
            <div className="w-75 container custom-container-po">
                <h3>Update Purchase Order</h3>
                <div className="mt-4 container" style={{width:'75%'}}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="purchaseOrder_id">
                            <Form.Label>Purchase Order ID</Form.Label>
                            <Form.Control
                                type="text"
                                name="purchaseOrder_id"
                                value={purchaseOrder.purchaseOrder_id}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="supplier_id">
                            <Form.Label>Supplier ID</Form.Label>
                            <Form.Control
                                type="text"
                                name="supplier_id"
                                value={purchaseOrder.supplier_id}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="supplierName">
                            <Form.Label>Supplier Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="supplier_name"
                                value={purchaseOrder.supplier_name}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Row className="my-2">
                            <Col>
                            <Form.Group controlId="orderDate">
                                <Form.Label>Order date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="order_date"
                                    value={purchaseOrder.order_date}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            </Col>

                            <Col>
                            <Form.Group controlId="deliveryDate">
                                <Form.Label>Delivery date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="deliver_date"
                                    value={purchaseOrder.deliver_date}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            </Col>
                        </Row>


                
                        <div className="mt-3">
                            <h6>Order Items</h6>
                            <Form.Group controlId="orderItemName">
                                <Form.Label>Item Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="item_name"
                                    value={newOrderItem.item_name}
                                    onChange={e => setNewOrderItem({ ...newOrderItem, item_name: e.target.value })}
                                />
                            </Form.Group>

                            <Row>
                            <Col>
                            <Form.Group controlId="orderItemUnitPrice">
                                <Form.Label>Unit Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="unit_price"
                                    value={newOrderItem.unit_price}
                                    onChange={e => setNewOrderItem({ ...newOrderItem, unit_price: e.target.value })}
                                />
                            </Form.Group>
                            </Col>
                            <Col>
                            <Form.Group controlId="orderItemQuantity">
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="quantity"
                                    value={newOrderItem.quantity}
                                    onChange={e => setNewOrderItem({ ...newOrderItem, quantity: e.target.value })}
                                />
                            </Form.Group>
                            </Col>
                            <Col className="text-center fs-5 ">
                                <Row><p >Total </p></Row>
                                <Row><p>Rs. {newOrderItem.unit_price * newOrderItem.quantity} </p></Row>
                            </Col>
                            </Row>

                            <Row>
                            <Col className="mt-2">
                            <Form.Group controlId="orderItemDescription">
                                <Form.Label>Item description</Form.Label>
                                <small class="text-muted"> not required</small>
                                <Form.Control
                                    type="text"
                                    name="item_description"
                                    value={newOrderItem.description}
                                    onChange={e => setNewOrderItem({ ...newOrderItem, description: e.target.value })}
                                />
                            </Form.Group>
                            </Col>
                            <Col className="mt-4">
                            <Button className="my-3" variant="success" type="button"  onClick={handleAddNewItem} >Add Item to Purchase Order</Button>
                            </Col>
                            </Row>

                            <div  className=" rounded" style={{backgroundColor:"Red"}}>
                                <table className="table table-secondary text-center">
                                    <thead>
                                        <tr>
                                            <th>Item Name</th>
                                            <th>Unit Price</th>
                                            <th>Quantity</th>
                                            <th>Description</th>
                                            <th>Total Price</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {purchaseOrder.order_items.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.item_name}</td>
                                                <td>{item.unit_price}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.description}</td>
                                                <td className="fw-semibold fs-5">Rs. {item.total_price}</td>
                                                <td>
                                                    <Button variant="danger" size="sm" onClick={() => handleDeleteItem(index)}>
                                                        Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            

                            <h5 className="my-5">Order Amount : Rs. {purchaseOrder.order_amount}</h5>
                        </div>


                        <div className="mt-3">
                            <h6>Delivery Information</h6>
                            <Row>
                                <Col>
                                <Form.Group >
                                    <Form.Label>Delivery Method</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="delivery_information.delivery_method"
                                        value={purchaseOrder.delivery_information.delivery_method}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                </Col>
                                <Col>
                                <Form.Group >
                                    <Form.Label>Delivery Costs</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="delivery_costs"
                                        value={purchaseOrder.delivery_information.delivery_costs}
                                        onChange={handleDeliveryCostsChange}
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
                                    <Form.Control
                                        type="text"
                                        name="payment_information.payment_method"
                                        value={purchaseOrder.payment_information.payment_method}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                </Col>
                                <Col>
                                <Form.Group >
                                    <Form.Label>Payment Terms and Aggrements</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="payment_information.payment_terms"
                                        value={purchaseOrder.payment_information.payment_terms}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                </Col>
                            </Row>
                        </div>

                        <div className="mt-3">
                        <Form.Group controlId="additionalOrderInfo">
                            <Form.Label>Additional Information</Form.Label>
                            <Form.Control
                                type="text"
                                name="additional_infomation"
                                value={purchaseOrder.additional_infomation}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="invoicdID">
                            <Form.Label>Invoice Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="invoice_no"
                                value={purchaseOrder.invoice_no}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        </div>

                        <div>
                        <h3 className="my-5">Total Order Amount : Rs. {purchaseOrder.total_order_amount}</h3>
                        </div>

                        <div className="mt-3 text-center">
                            <h6>Tract your Purchase Order</h6>
                            <Row>
                                <Col>
                                    <Form.Group >
                                        <Form.Label>Order Status</Form.Label>
                                        <Col>
                                        <input 
                                            type="radio" 
                                            className="btn-check" 
                                            name="order_status" 
                                            id="order_pending" 
                                            autoComplete="off"
                                            value="Pending"
                                            checked={purchaseOrder.order_status === "Pending"} 
                                            onChange={handleChange} 
                                        />
                                        <label className="btn btn-secondary me-2" htmlFor="order_pending">Pending</label>

                                        <input 
                                            type="radio" 
                                            className="btn-check" 
                                            name="order_status" 
                                            id="order_delivered" 
                                            autoComplete="off"
                                            value="Delivered" 
                                            checked={purchaseOrder.order_status === "Delivered"} 
                                            onChange={handleChange} 
                                        />
                                        <label className="btn btn-secondary" htmlFor="order_delivered">Delivered</label>
                                        </Col>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group >
                                        <Form.Label>Payment Status</Form.Label>
                                        <Col>
                                        <input 
                                            type="radio" 
                                            className="btn-check" 
                                            name="payment_status" 
                                            id="order_payment_paid" 
                                            autoComplete="off"
                                            value="Paid" 
                                            checked={purchaseOrder.payment_status === "Paid"} 
                                            onChange={handleChange} 
                                        />
                                        <label className="btn btn-secondary me-2" htmlFor="order_payment_paid">Paid</label>

                                        <input 
                                            type="radio" 
                                            className="btn-check" 
                                            name="payment_status" 
                                            id="order_payment_unpaid" 
                                            autoComplete="off"
                                            value="Unpaid" 
                                            checked={purchaseOrder.payment_status === "UnPaid"} 
                                            onChange={handleChange} 
                                        />
                                        <label className="btn btn-secondary" htmlFor="order_payment_unpaid">Unpaid</label>
                                        </Col>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </div>
                        
                        <div className="mb-5 d-flex flex-column align-items-center justify-content-center">
                        <Button className="mt-4 col-md-4" variant="primary" type="submit">Update Purchase Order</Button>
                        </div>

                    </Form>
                </div>
            </div>
        </div>
    )
}

export default UpdatePurchaseOrder;




// const [purchaseOrder_id, setPOid] = useState("");
    // const [supplier_id, setSupId] = useState("");
    // const [supplier_name, setSupName] = useState("");
    // const [order_date, setPurchaseOrderDate] = useState("");
    // const [deliver_date, setDeliveryDate] = useState("");
    // const [item_name, setItemName] = useState("");
    // const [unit_price, setUnitPrice] = useState("");
    // const [quantity, setQuantity] = useState(0);
    // const [description, setDescription] = useState("");
    // const [total, setTotal] = useState(0);
    // const [orderList, setOrderList] = useState([]);
    // const [order_amount, setOrderAmount] = useState(0);
    // const [delivery_method, setDeliveryMethod] = useState("");
    // const [delivery_costs, setDeliveryCosts] = useState(0);
    // const [payment_terms, setPaymentTerms] = useState("");
    // const [payment_method, setPaymentMethod] = useState("");
    // const [additional_infomation, setAdditionalDetails] = useState("");
    // const [invoice_no, setInvoiceNo] = useState(0);
    // const [total_order_amount, setTotalOrderAmount] = useState(0);
    // const [order_status, setOrderStatus] = useState("");
    // const [payment_status, setPaymentStatus] = useState("");