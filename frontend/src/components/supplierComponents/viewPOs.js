import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import {Button, Row, Col, Card} from 'react-bootstrap'
import './supplier.css';
// import {jsPDF} from 'jspdf';

function ViewPO() {

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
        payment_status: "",
        payment_date: "",
        sup_deliver_date: "",
        leadTime: 0,
        qualityOfGoods: 0,
        quantityAccuracy: 0,
        responsiveness: "",
        costEffectiveness: "",
        additional: "",
        overallSatisfaction: ""
    })

    const [supplier, setSupplier] = useState({
        supplier_name: "",
        address: "",
        contact: "",
        email: "",
    });


    const [OrderItem, setOrderItem] = useState({
        item_name: "",
        quantity: 0,
        unit_price: 0,
        description: "",
        total_price: 0,
        product_items: []
    });

    
    useEffect(() => {
        axios.get(`http://localhost:8080/purchaseOrder/get/${id}`)
            .then(response => {
                const { po } = response.data; 
                setPurchaseOrder({
                    ...po,
                    order_date: po.order_date ? po.order_date.substring(0, 10) : "",
                    deliver_date: po.deliver_date ? po.deliver_date.substring(0, 10) : "",
                    payment_date: po.payment_date ? po.payment_date.substring(0, 10) : "",
                    sup_deliver_date: po.sup_deliver_date ? po.sup_deliver_date.substring(0, 10) : ""
                });
            })
            .catch(error => {
                console.error("Error fetching purchase order:", error);
            });
    }, [id]);


    //FETCH SUPPLIER
    useEffect(() => {
        axios.get('http://localhost:8080/supplier')
            .then(response => {
                const allSuppliers = response.data;
                // Find the supplier that matches the supplier_id of the purchase order
                const foundSupplier = allSuppliers.find(supplier => supplier.supplier_id === purchaseOrder.supplier_id);
                if (foundSupplier) {
                    // If a matching supplier is found, update the state with its details
                    setSupplier({
                        supplier_id: foundSupplier.supplier_id,
                        supplier_name: foundSupplier.supplier_name,
                        address: foundSupplier.address,
                        contact: foundSupplier.contact,
                        email: foundSupplier.email,
                        product_items: foundSupplier.product_items
                    });
                } else {
                    console.log("Supplier not found for the given supplier_id");
                }
            })
            .catch(error => {
                console.error('Error fetching supplier data:', error);
            });
    }, [purchaseOrder.supplier_id]);
    

    //DELETE PO
    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            axios.delete(`http://localhost:8080/purchaseOrder/delete/${id}`)
                .then(response => {
                    alert("Order deleted successfully");
                    navigate('/purchaseOrder'); 
                })
                .catch(error => {
                    console.error("Error deleting purchase order:", error);
                    alert("Failed to delete order");
                });
        }
    };


    //PRINT PO 2
    const printPO = () => {
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
                            <div class="ms-2 container-fluid mb-5">
                                <div class="ms-4">
                                    <p class="fw-light">Purchase order Management</p>
                                    <h3>Purchase Order {id}</h3>
                                </div>
                            
                                <div class="mt-5 container-fluid "> 
                            
                                    <div class="row">
                                        <div class="col-md-7"> 
                                            <div class="pe-4 bg-warning"> 
                                                <p class="fs-5">Purchase Order ID: ${purchaseOrder.purchaseOrder_id}</p>
                                                <p class="fs-6">Mongo DB database ID: ${id}</p>
                                                <p>Supplier ID: ${purchaseOrder.supplier_id}</p>
                                                
                                                <div class="row ms-5 mt-5 mb-4">
                                                    <div class="col-xs-4">
                                                        <p class="fs-6 p-3 text-center fw-light bg-info-dates">Order date: <br><span class="fw-semibold fs-5">${purchaseOrder.order_date}</span></p>
                                                    </div>
                                                    <div class="col-xs-4 ms-5">
                                                        <p class="fs-6 p-3 text-center fw-light bg-info-dates">Delivery date: <br><span class="fw-semibold fs-5">${purchaseOrder.deliver_date}</span></p>
                                                    </div>
                                                </div>
                            
                                                <div >
                                                    <h6>Delivery Information</h6>
                                                    <p class="ms-3">Delivery Method :  ${purchaseOrder.delivery_information.delivery_method}</p>
                                                    <p class="ms-3">Delivery costs for the order :  ${purchaseOrder.delivery_information.delivery_costs}</p>
                                                </div>
                            
                                                <div class="mt-4">
                                                    <h6>Payment details of the order</h6>
                                                    <p class="ms-3">Payment terms :  ${purchaseOrder.payment_information.payment_terms}</p>
                                                    <p class="ms-3">Payment Method :  ${purchaseOrder.payment_information.payment_method}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                            
                                    <div class="p-4 bg-info w-75 mt-3 rounded">
                                        <h6 class="mt-2">Ordered Items</h6>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Unit Price</th>
                                                    <th>Quantity</th>
                                                    <th>Description</th>
                                                    <th>Total Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${purchaseOrder.order_items.map(item => `
                                                    <tr>
                                                        <td>${item.item_name}</td>
                                                        <td>${item.unit_price}</td>
                                                        <td>${item.quantity}</td>
                                                        <td>${item.description}</td>
                                                        <td>${item.total_price}</td>
                                                    </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                    </div>
        
                            
                                    <p class="fw-light mt-5 mb-4">Total Amount of the ordered items : <span class="fw-semibold fs-4"> Rs. ${purchaseOrder.total_order_amount}</span></p>
                            
                                    <div class="text-center ms-5 ">
                                        <p class="text-start">Current status of the order</p>
                                        <div class="row">
                                            <div class="col-xs-2">
                                                <p class="fs-6 p-3 fw-light bg-warning">Payment Status<br><span>${purchaseOrder.payment_status}</span></p>
                                            </div>
                                            <div class="col-xs-2">
                                                <p class="ms-3 fs-6 p-3 fw-light bg-warning">Order Status<br><span>${purchaseOrder.order_status}</span></p>
                                            </div>
                                        </div>                    
                                    </div>
                            
                                    <p class="text-secondary mt-4 bg-success-subtle p-3 me-3 ">If payment is done,<br><span class="ms-3 text-dark">Invoice number : ${purchaseOrder.invoice_no}</span></p>
                            
                                    <p class="mt-4 fw-semibold"> Additional instructions to follow: <br><span class="fw-normal">${purchaseOrder.additional_infomation}</span></p>
                                    
                                
                                </div>
                            </div>  
                        </div>
                    </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    //PRINT AS A PDF
    // const printPdfPO = () => {
    //     const doc = new jsPDF();
    
    //     // Add a border around the entire content
    //     doc.setLineWidth(0.5); // Set border width
    //     doc.rect(5, 5, 200, 280); // x, y, width, height
    
    //     doc.setFontSize(16);
    //     doc.text('Purchase Order', 10, 20);
    
    //     doc.setFontSize(12);
    //     doc.text(`Purchase Order ID: ${purchaseOrder.purchaseOrder_id}`, 10, 30);
    //     doc.text(`Mongo DB ID: ${purchaseOrder._id}`, 10, 40);
    //     doc.text(`Supplier ID: ${purchaseOrder.supplier_id}`, 10, 50);
    //     doc.text(`Supplier Name: ${purchaseOrder.supplier_name}`, 10, 60);

    //     doc.text(`Order Date: ${purchaseOrder.order_date}`, 20, 75);
    //     doc.text(`Delivery Date: ${purchaseOrder.deliver_date}`, 90, 75);
    
    //     doc.text(`Delivery Method: ${purchaseOrder.delivery_information.delivery_method}`, 10, 90);
    //     doc.text(`Delivery Costs: ${purchaseOrder.delivery_information.delivery_costs}`, 10, 100);
    
    //     doc.text(`Payment Terms: ${purchaseOrder.payment_information.payment_terms}`, 10, 115);
    //     doc.text(`Payment Method: ${purchaseOrder.payment_information.payment_method}`, 10, 125);
    
    //     // Draw table headers
    //     doc.setFillColor(200, 200, 200); // Set header background color
    //     doc.rect(10, 140, 190, 10, 'F'); // Draw header rectangle
    //     doc.setTextColor(0); // Reset text color
    //     doc.text('Item Name', 15, 145);
    //     doc.text('Unit Price', 65, 145);
    //     doc.text('Quantity', 95, 145);
    //     doc.text('Description', 125, 145);
    //     doc.text('Total Price', 165, 145);
    
    //     // Draw table rows
    //     let y = 155;
    //     purchaseOrder.order_items.forEach((item) => {
    //         doc.text(item.item_name, 15, y);
    //         doc.text(item.unit_price.toString(), 65, y);
    //         doc.text(item.quantity.toString(), 95, y);
    //         doc.text(item.description, 125, y);
    //         doc.text(item.total_price.toString(), 165, y);
    //         y += 10; // Adjust Y-coordinate for next row
    //     });
    
    //     doc.setFontSize(16); // Set the font size to 16 for the total order amount
    //     doc.text(`Total Order Amount: ${purchaseOrder.total_order_amount}`, 10, y + 10);

    //     doc.setFontSize(12);
    //     doc.text(`Order Status: ${purchaseOrder.order_status}`, 10, y + 30);
    //     doc.text(`Payment Status: ${purchaseOrder.payment_status}`, 80, y + 30);
    //     doc.text(`Additional Information: ${purchaseOrder.additional_infomation}`, 10, y + 40);
    
    //     // Save the PDF with a meaningful filename
    //     doc.save(`Purchase_Order_${purchaseOrder.purchaseOrder_id}.pdf`);
    // };
    

    //INVOICE UPLOAD - NOT WORKING
    const fileInputRef = useRef(null);

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        // Handle file change here
        console.log(event.target.files[0]);
    };



    return(
        <div className="p-3 container-fluid mb-3 bg">
            <Row >
                <Col xs={8}>
                    <div className="">
                        <div className="ms-4 ">
                            <p className="fw-light">Purchase order Management
                            <h2 >Purchase Order {purchaseOrder.purchaseOrder_id}</h2></p>
                            <Link to="/purchaseOrder">
                                <Button className="back-btn" variant="secondary" ><i className="bi bi-arrow-left me-2"></i><span>Back</span></Button>
                            </Link>

                            {/* <Button className="ms-2 text-white " variant="info" onClick={printPdfPO} id="up-btn" ><i className="bi bi-filetype-pdf me-2"></i>Download Purchase Order</Button> */}
                            <Button className="ms-2 text-white " variant="info" id="up-btn" ><i className="bi bi-filetype-pdf me-2"></i>Download Purchase Order</Button>
                        </div>

                        <div className="mt-4 pe-4 shadow-lg rounded"> 
                            <p className="fs-4 fw-light">Purchase Order ID: {purchaseOrder.purchaseOrder_id}</p>
                            <p className="fs-6">Mongo DB database ID: {id}</p>
                            <p>Supplier ID: {purchaseOrder.supplier_id}</p>
                            
                            <div >
                                <h6>Delivery Information</h6>
                                <p className="ms-3">Delivery Method :  {purchaseOrder.delivery_information.delivery_method}</p>
                                <p className="ms-3">Delivery costs for the order :  {purchaseOrder.delivery_information.delivery_costs}</p>
                            </div>

                            <div className="mt-4">
                                <h6>Payment details of the order</h6>
                                <p className="ms-3">Payment terms :  {purchaseOrder.payment_information.payment_terms}</p>
                                <p className="ms-3">Payment Method :  {purchaseOrder.payment_information.payment_method}</p>
                            </div>

                            <div>
                                <Row className="ms-3 mt-5">
                                    <Col xs={4}>
                                        <p className="fs-6 p-3 text-center fw-light text-light rounded" style={{backgroundColor:"#334eac"}}>Order date: <br></br><span className="fw-semibold fs-5">{purchaseOrder.order_date}</span></p>
                                    </Col>
                                    <Col xs={4} className="ms-5">
                                        <p className="fs-6 p-3 text-center fw-light text-light rounded" style={{backgroundColor:"#334eac"}}>Delivery date: <br></br><span className="fw-semibold fs-5">{purchaseOrder.deliver_date}</span></p>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col xs={4} >
                    <div className=" p-3 rounded shadow-lg rounded ">
                        <h4 className="mb-4 ms-2">Supplier Details </h4>
                        <p>Supplier ID: {supplier.supplier_id}</p>
                        <p>Supplier Name: {supplier.supplier_name}</p>
                        <p>Email: {supplier.email}</p>
                        <p>Address: {supplier.address}</p>
                        <p>Contact Number: {supplier.contact}</p>

                        <Link to={`/supplier/get/${supplier._id}`}>
                        <button  className="ms-3 side-btn dark-blue">
                            <span>View Bank details<i className="bi bi-chevron-right"></i></span>
                        </button>
                        </Link>

                        <p className="mt-2">Supplier selling product items:</p>
                        <ul>
                            {supplier.product_items && supplier.product_items.map((item, index) => (
                                <li key={index}>
                                    {item.product_name} - ${item.unit_price}
                                </li>
                            ))}
                        </ul>

                    </div>
                </Col>
            </Row>

            <div className="p-4 mt-3 rounded " >
                <h6 >Ordered Items</h6>
                <Row xs={1} md={6} lg={7}  className="g-4">
                    {purchaseOrder.order_items.map((item, index) => (
                        <Col key={index}>
                            <Card style={{backgroundColor:"#d6cdc5", borderColor: "#d6cdc5"}}>
                                <Card.Body>
                                    <Card.Title ><span className="fw-light fs-6">#{index + 1}</span><br></br>{item.item_name}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">Price: Rs. {item.unit_price}</Card.Subtitle>
                                    <Card.Text>
                                        <p><span>Quantity : </span> {item.quantity}<br />
                                        <span>Description : </span> {item.description}<br />
                                        <span>Total Price : </span> <br></br><span className="text-center fw-semibold">Rs. {item.total_price}</span></p>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
                    

            <Row className="mt-5">
                <Col md={7}>
                    <div >
                        <p className="fw-light  mb-4">Total Amount of the ordered items : <span className="fw-semibold fs-3"> Rs. {purchaseOrder.total_order_amount}</span></p>

                        <div className="text-center my-5 ms-5 ">
                            <p className="text-start">Current status of the order</p>
                            <Row>
                                <Col xs={4}>
                                    <p className="fs-6 p-3 fw-light rounded text-light" style={{backgroundColor:"#334eac"}}>Payment Status<br></br><span className="fs-5 ">{purchaseOrder.payment_status}</span></p>
                                </Col>
                                <Col xs={4}>
                                    <p className="ms-3 fs-6 p-3 fw-light rounded text-light"  style={{backgroundColor:"#334eac"}}>Order Status<br></br><span className="fs-5 ">{purchaseOrder.order_status}</span></p>
                                </Col>
                            </Row>                    
                        </div>

                        <div className="mb-4 rounded"  style={{backgroundColor:"#89CFF3"}}>
                            <Row>
                                <Col >
                                    <div className="text-secondary p-4 ">If payment is done,<br></br><span className="ms-3 text-dark ">Invoice number : <span className="fw-semibold ">{purchaseOrder.invoice_no}</span></span></div>
                                </Col>
                                <Col >
                                <div className="file-input-container position-relative top-50 start-50 translate-middle">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="file-input"
                                        onChange={handleFileChange}
                                    />
                                    <Button variant="success" className="text-white" onClick={handleClick} style={{backgroundColor:"#1679AB"}}><i className="bi bi-coin me-2"></i>Add invoice</Button>
                                </div>    
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Col>
                <Col md={5}>
                    <div className=" p-3" style={{backgroundColor:"#334eac"}}>
                        <h4 className="mb-4 text-white">Performance Metrics <span className="fs-6 fw-light ">for Purchase order </span><small className=" fs-6 ">${purchaseOrder._id}</small></h4>

                        <p></p>
                        <p></p>
                        <p></p>
                        <p></p>
                        <p></p>
                    </div>
                </Col>
            </Row>
            
            <div className="container-fluid">
                <p className="mb-5  fw-semibold"> Additional instructions to follow: <br></br><span className="fw-normal">{purchaseOrder.additional_infomation}</span></p>

                <div className="d-flex justify-content-start me-3 mt-4">
                    <Button variant="info" className="ms-2 text-white" id="up-btn" onClick={printPO}><i className="bi bi-printer-fill me-2"></i>Print as a document</Button>

                    <Link to={`/purchaseOrder/update/${purchaseOrder._id}`} >
                        <Button variant="white" className="ms-2 text-white " id="up-btn" style={{backgroundColor:"#334eac"}}><i className="bi bi-pen me-2"></i>Edit Order details</Button>
                    </Link>

                    <Button variant="danger" className="ms-2 " id="up-btn" onClick={handleDelete}><i className="bi bi-trash me-2" ></i>Delete order</Button>
                </div>
            </div>
        </div>
    )
}

export default ViewPO;

 //PRINT PO
    // const printPO = (purchaseOrder) => {
    //     const printWindow = window.open("", "_blank", "width=600,height=600");
    //     printWindow.document.write(`
    //         <html>
    //             <head>
    //                 <meta charset="UTF-8">
    //                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //                 <title>Purchase Order</title>
    //                 <style>
    //                     body {
    //                         font-family: Arial, sans-serif;
    //                         padding: 20px;
    //                     }
    
    //                     .container {
    //                         max-width: 800px;
    //                         margin: 0 auto;
    //                     }
    
    //                     .header {
    //                         text-align: center;
    //                         margin-bottom: 20px;
    //                     }
    
    //                     .section {
    //                         margin-bottom: 20px;
    //                     }
    
    //                     .section-title {
    //                         font-size: 20px;
    //                         font-weight: bold;
    //                         margin-bottom: 10px;
    //                     }
    
    //                     .item {
    //                         margin-left: 20px;
    //                     }
    
    //                     .item-title {
    //                         font-weight: bold;
    //                     }
    //                 </style>
    //             </head>
    //             <body>
    //                 <div class="container">
    //                 <div class="ms-2 container-fluid mb-5">
    //                     <div class="ms-4">
    //                         <p class="fw-light">Purchase order Management</p>
    //                         <h3>Purchase Order {id}</h3>
    //                         <a href="/purchaseOrder">
    //                             <button class="back-btn btn btn-secondary"><i class="bi bi-arrow-left me-2"></i><span>Back</span></button>
    //                         </a>
    //                         <button class="btn btn-info ms-2 text-white" id="up-btn"><i class="bi bi-printer-fill me-2"></i>Print as a document</button>
    //                     </div>
                    
    //                     <div class="mt-5 container-fluid "> <!-- LOKUMA EKA -->
                    
    //                         <div class="row">
    //                             <div class="col-md-7"> <!-- ORDER ITEMS WLT UDA TIKA -->
    //                                 <div class="pe-4 bg-warning"> 
    //                                     <p class="fs-5">Purchase Order ID: {purchaseOrder.purchaseOrder_id}</p>
    //                                     <p class="fs-6">Mongo DB database ID: {id}</p>
    //                                     <p>Supplier ID: {purchaseOrder.supplier_id}</p>
                                        
    //                                     <div class="row ms-5 mt-5 mb-4">
    //                                         <div class="col-xs-4">
    //                                             <p class="fs-6 p-3 text-center fw-light bg-info">Order date: <br><span class="fw-semibold fs-5">{purchaseOrder.order_date}</span></p>
    //                                         </div>
    //                                         <div class="col-xs-4 ms-5">
    //                                             <p class="fs-6 p-3 text-center fw-light bg-info">Delivery date: <br><span class="fw-semibold fs-5">{purchaseOrder.deliver_date}</span></p>
    //                                         </div>
    //                                     </div>
                    
    //                                     <div >
    //                                         <h6>Delivery Information</h6>
    //                                         <p class="ms-3">Delivery Method :  {purchaseOrder.delivery_information.delivery_method}</p>
    //                                         <p class="ms-3">Delivery costs for the order :  {purchaseOrder.delivery_information.delivery_costs}</p>
    //                                     </div>
                    
    //                                     <div class="mt-4">
    //                                         <h6>Payment details of the order</h6>
    //                                         <p class="ms-3">Payment terms :  {purchaseOrder.payment_information.payment_terms}</p>
    //                                         <p class="ms-3">Payment Method :  {purchaseOrder.payment_information.payment_method}</p>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                             <div class="col-md-5 align-self-start"> <!-- EHAPATHTHE EKA -->
    //                                 <div class="bg-success p-3">
    //                                     <h4>Supplier Details</h4>
    //                                     <p>Supplier ID: </p> <!-- me topics wge ewa ain krnna -->
    //                                     <p>Supplier name: </p>
    //                                     <p>Email</p>
    //                                     <p>Address</p>
    //                                     <p>conatct number</p>
    //                                     <button class="btn btn-success ms-3 side-btn">
    //                                         <span>View Bank details
    //                                             <i class="bi bi-bank"></i>
    //                                         </span>
    //                                     </button>
    //                                     <!-- <button style={{ backgroundColor: "orange" }} class="ms-3 btn-arrow">
    //                                         <span>View Bank details
    //                                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
    //                                         <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
    //                                         </svg>
    //                                         </span>
    //                                     </button> -->
    //                                     <p class="mt-2">Supplier performance</p>
    //                                 </div>
    //                             </div>
    //                         </div>
                            
                    
    //                         <div class="p-4 bg-info w-75 mt-3 rounded">
    //                             <h6 class="mt-2">Ordered Items</h6>
    //                             <div class="row row-cols-1 row-cols-md-3 row-cols-lg-6 g-4">
    //                                 <!-- Insert ordered items here -->
    //                             </div>
    //                         </div>
                            
                    
    //                         <p class="fw-light mt-5 mb-4">Total Amount of the ordered items : <span class="fw-semibold fs-4"> Rs. {purchaseOrder.total_order_amount}</span></p>
                    
    //                         <div class="text-center ms-5 ">
    //                             <p class="text-start">Current status of the order</p>
    //                             <div class="row">
    //                                 <div class="col-xs-2">
    //                                     <p class="fs-6 p-3 fw-light bg-warning">Payment Status<br><span>{purchaseOrder.payment_status}</span></p>
    //                                 </div>
    //                                 <div class="col-xs-2">
    //                                     <p class="ms-3 fs-6 p-3 fw-light bg-warning">Order Status<br><span>{purchaseOrder.order_status}</span></p>
    //                                 </div>
    //                             </div>                    
    //                         </div>
                    
    //                         <p class="text-secondary mt-4 bg-success-subtle p-3 me-3 ">If payment is done,<br><span class="ms-3 text-dark">Invoice number : {purchaseOrder.invoice_no}</span></p>
                    
    //                         <p class="mt-4 fw-semibold"> Additional instructions to follow: <br><span class="fw-normal">${purchaseOrder.additional_infomation}</span></p>
                            
                          
    //                     </div>
    //                 </div>
                
    //                 </div>
    //             </body>
    //         </html>
    //     `);
    //     printWindow.document.close();
    //     printWindow.print();
    // };
    