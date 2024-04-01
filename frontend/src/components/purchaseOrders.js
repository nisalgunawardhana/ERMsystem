import {React, useState, useEffect} from "react";
import axios from "axios";
import { Table, Button, Form, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function PurchaseOrder() {

    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const getPurchaseOrders = () => {
            axios.get("http://localhost:8080/purchaseOrder").then((res) => {
                setPurchaseOrders(res.data.map(order => ({
                    ...order,
                    order_date: formatDate(order.order_date),
                    deliver_date: formatDate(order.deliver_date)
                })));
            }).catch((err) => {
                alert(err.message);
            })
        }
        getPurchaseOrders();
    }, [])


    //SERACH PURCHASE ORDER
    // const handleSearchPurchaseOrder = (e) => {
    //     const query = e.target.value;
    //     setSearchQuery(query);
    //     const filteredPurchaseOrders = purchaseOrders.filter(
    //       (order) =>
    //         order.purchaseOrder_id.toLowerCase().includes(query.toLowerCase())
    //     );
    //     setSearchResults(filteredPurchaseOrders);
    //   };
    
    //   const renderPurchaseOrders =
    //     searchQuery === "" ? purchaseOrders : searchResults;

    const handleSearchPurchaseOrder = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        const filteredPurchaseOrders = purchaseOrders.filter(
          (order) =>
            order.purchaseOrder_id.toLowerCase().includes(query.toLowerCase()) ||
            order.order_date.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filteredPurchaseOrders);
      };
    
      // SEARCH PURCHASE ORDER BY DATE
      const handleSearchPurchaseOrderByDate = (e) => {
        const date = e.target.value;
        setSearchDate(date);
        const filteredPurchaseOrders = purchaseOrders.filter((order) =>
          order.order_date.includes(date)
        );
        setSearchResults(filteredPurchaseOrders);
      };
    
      const renderPurchaseOrders =
        searchQuery === "" && searchDate === "" ? purchaseOrders : searchResults;


    //FORMAT DATE
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    //DELETE PURCHASE ORDER
    const handleDeleteOrder = (id) => {
        axios.delete(`http://localhost:8080/purchaseOrder/delete/${id}`)
        .then(() => {
            setPurchaseOrders(purchaseOrders.filter((order) => order._id !== id));
            alert("Purchase Order deleted pamali");
        }).catch((err) => {
            alert("Error deleting purchase Order pamali")
            console.log(err);
        })
    };


    return(
        <div>

            <h3 className="container w-85">Purchase Orders</h3>

            <div className="container w-75 ">
                <Row>
                    <Col>
                    <div className="container my-4">
                        <Form>
                        <Form.Group controlId="formSearch">
                            <Form.Label>Search by Purchase Order ID</Form.Label>
                            <Form.Control
                            type="text"
                            placeholder="Enter Purchase Order ID"
                            value={searchQuery}
                            onChange={handleSearchPurchaseOrder}
                            />
                        </Form.Group>
                        </Form>
                    </div>
                    </Col>
                    <Col>
                    <div className="container my-4">
                        <Form>
                        <Form.Group controlId="formSearchDate">
                            <Form.Label>Search by Order date</Form.Label>
                            <Form.Control
                            type="date"
                            placeholder="Select Order Date"
                            value={searchDate}
                            onChange={handleSearchPurchaseOrderByDate}
                            />
                        </Form.Group>
                        </Form>
                    </div>
                    </Col>
                    <Col className="mt-5">
                        <Link to="/supplier/">
                            <Button>Back</Button>
                        </Link>
                    </Col>
                </Row>
            </div>



            <div className="container-fluid">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>Purchase Order ID</th>
                        <th>Supplier ID</th>
                        <th>Supplier Name</th>
                        <th>Order Date</th>
                        <th>Delivery Date</th>
                        <th>Order Items</th>
                        <th>Order Amount</th>
                        <th>Delivery Information</th>
                        <th>Payment Information</th>
                        <th>Additional Information</th>
                        <th>Total Order Amount</th>
                        <th>Invoice Number</th>
                        <th>Order Status</th>
                        <th>Payment Status</th>
                        <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderPurchaseOrders.map((order) => (
                        <tr key={order.purchaseOrder_id}>
                            <td>{order.purchaseOrder_id}</td>
                            <td>{order.supplier_id}</td>
                            <td>{order.supplier_name}</td>
                            <td>{order.order_date}</td>
                            <td>{order.deliver_date}</td>
                            <td>
                                <ul>
                                    {order.order_items.map((item, index) => (
                                    <li key={index}>
                                        {item.item_name} - Quantity: {item.quantity}
                                    </li>
                                    ))}
                                </ul>
                            </td>
                            <td>Rs. {order.order_amount}</td>
                            <td>
                                Method: {order.delivery_information.delivery_method} Costs:{" "}
                                {order.delivery_information.delivery_costs}
                            </td>
                            <td>
                                Method: {order.payment_information.payment_method}, Terms:{" "}
                                {order.payment_information.payment_terms}
                            </td>
                            <td>{order.additional_infomation}</td>
                            <td>Rs. {order.total_order_amount}</td>
                            <td>{order.invoice_no}</td>
                            <td>{order.order_status}</td>
                            <td>{order.payment_status}</td>
                            <td>
                            <Link to={`/purchaseOrder/update/${order.purchaseOrder_id}`}>
                                <Button variant="primary" className="me-2 mb-2">Edit</Button>
                            </Link>
                            <Button variant="danger" onClick={() => handleDeleteOrder(order._id)}>Delete</Button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    )
}

export default PurchaseOrder;
