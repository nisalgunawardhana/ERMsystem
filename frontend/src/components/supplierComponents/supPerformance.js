import {React, useState, useEffect} from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { Button, Form, Row, Col, ProgressBar} from "react-bootstrap";
import axios from "axios";
import Layout from '../Layout';
import './supplier.css';

function AddSupplierPerformance() {

    
    const { id } = useParams();
    const navigate = useNavigate();

    const [payment_date, setPaymentDate] = useState('');
    const [sup_deliver_date, setSupDeliverDate] = useState('');
    const [leadTime, setLeadTime] = useState(0);
    const [qualityOfGoods, setQualityOfGoods] = useState(0);
    const [quantityAccuracy, setQuantityAccuracy] = useState(0);
    const [responsiveness, setResponsiveness] = useState('');
    const [costEffectiveness, setCostEffectiveness] = useState('');
    const [additional, setAdditional] = useState('');
    const [overallSatisfaction, setOverallSatisfaction] = useState('');

    const [noofDamages, setNoofDamages] = useState(0);
    const [noofActualItems, setNoofActualItems] = useState(0);
    const [actualItemsPercentage, setActualItemsPercentage] = useState(0);


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

    //FETCH PO
    useEffect(() => {
        axios.get(`http://localhost:8080/purchaseOrder/get/${id}`)
            .then(response => {
                const { po } = response.data; 
                setPurchaseOrder({
                    ...po,
                    order_date: po.order_date ? po.order_date.substring(0, 10) : "",
                    deliver_date: po.deliver_date ? po.deliver_date.substring(0, 10) : "",
                    payment_date: po.payment_date ? po.payment_date.substring(0, 10) : "",
                    sup_deliver_date: po.sup_deliver_date ? po.sup_deliver_date.substring(0, 10) : "",
                });
            })
            .catch(error => {
                console.error("Error fetching purchase order:", error);
            });
    }, [id]);

    useEffect(() => {
        // Calculate lead time
        const leadTimeDifference = calculateLeadTime();
        // Update lead time in state
        setLeadTime(leadTimeDifference);
    }, [purchaseOrder.sup_deliver_date]);


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


    const handleSubmit = e => {
        e.preventDefault();
        const updatedPurchaseOrder = {
            ...purchaseOrder,
            leadTime: leadTime, 
            qualityOfGoods: calculateQualityOfGoods(), // Calculate quality of goods
            quantityAccuracy: calculateQuantityAccuracy(),
        };
        axios.put(`http://localhost:8080/purchaseOrder/update/${id}`, updatedPurchaseOrder)
            .then(() => {
                alert("Purchase Order updated successfully");
                navigate("/purchaseOrder");
            })
            .catch(error => {
                console.error("Error updating purchase order:", error);
            });
    };
    
    // function progress_bar() {
    //     var speed = 30;
    //     var items = document.querySelectorAll('.progress_bar .progress_bar_item');
    
    //     items.forEach(function(item) {
    //         var progressBar = item.querySelector('.progress');
    //         var itemValue = progressBar.dataset.progress;
    //         var i = 0;
    //         var itemValueDisplay = item.querySelector('.item_value');
    
    //         var count = setInterval(function() {
    //             if (i <= itemValue) {
    //                 progressBar.style.width = i + '%';
    //                 itemValueDisplay.textContent = i + '%';
    //             } else {
    //                 clearInterval(count);
    //             }
    //             i++;
    //         }, speed);
    //     });
    // }
    
    // useEffect(() => {
    //     progress_bar();
    // }, []);

    
    //FORMAT DATE
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    

    //CALCULATE DIFFERENCE OF DELIVERY DATES
    const calculateDateDifference = () => {
        const deliverDate = new Date(purchaseOrder.deliver_date);
        const supDeliverDate = new Date(purchaseOrder.sup_deliver_date);
        const difference = Math.abs(deliverDate - supDeliverDate);
        const deliverDaysDifference = Math.ceil(difference / (1000 * 60 * 60 * 24));
        return deliverDaysDifference;
    };

    //CALCULATE LEAD TIME
    const calculateLeadTime = () => {
        const orderDate = new Date(purchaseOrder.order_date);
        const supDeliverDate = new Date(purchaseOrder.sup_deliver_date);
        const difference = Math.abs(orderDate - supDeliverDate);
        const leadTimeDifference = Math.ceil(difference / (1000 * 60 * 60 * 24));
        return leadTimeDifference;
    };

    //GET TOTAL NUMBER OF QUANTITY
    const calculateTotalQuantity = () => {
        let totalItems = 0;
        purchaseOrder.order_items.forEach(item => {
            totalItems += item.quantity;
        });
        return totalItems;
    };

    //CALCULATE QUALITY OF GOODS
    const calculateQualityOfGoods = () => {
        const totalOrderItems = calculateTotalQuantity();
        const qualityPercentage = ((totalOrderItems - noofDamages) / totalOrderItems) * 100;
        return qualityPercentage;
    };

    //CALCULATE QUANTITY ACCURACY
    const calculateQuantityAccuracy = () => {
        const totalOrderItems = calculateTotalQuantity();
        const actualItemsPercentage = ((noofActualItems) / totalOrderItems) * 100
        return actualItemsPercentage;
    }

    //OVERALL SATISFACTION
    const handleChangeSatisfaction = (value) => {
        setOverallSatisfaction(value);
    };

    const satisfactionOptions = [
        { name: 'Excellent', value: 'Excellent' },
        { name: 'Good', value: 'Good' },
        { name: 'Average', value: 'Average' },
        { name: 'Poor', value: 'Poor' }
    ];

    //FETCH SUPPLIER BY EQUAL SUPPLIER_ID
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

    return(
        <Layout>
        <div className="container-fluid bg">

            <Row>
                <Col>
                    <div className="p-2 ">
                        <div >
                            <p className="fw-light layout-blue">Purchase order Management
                            <h2 >Purchase Order {purchaseOrder.purchaseOrder_id}</h2></p>
                            <Link to="/dashboard/logistics/purchaseOrder">
                                <Button className="back-btn" variant="secondary" ><i className="bi bi-arrow-left me-2"></i><span>Back</span></Button>
                            </Link>
                            <Link to="/dashboard/logistics/purchaseOrder/add">
                            <Button className="ms-2 text-white layout-blue-bg" variant="secondary" id="up-btn" ><i className="bi bi-filetype-pdf me-2"></i>Create New Purchase Order</Button>
                            </Link>
                        </div>

                        <div className="mt-4">
                            <p className="fs-4 fw-light">Purchase Order ID: {purchaseOrder.purchaseOrder_id}</p>
                            <p className="fs-6">Mongo DB database ID: {id}</p>
                            <p>Supplier ID: {purchaseOrder.supplier_id}</p>

                            <div >
                                <p >Order date: <span className="fw-semibold fs-5">{purchaseOrder.order_date}</span></p>
                                <p >Delivery date: <span className="fw-semibold fs-5">{purchaseOrder.deliver_date}</span></p>
                            </div>

                            <p>Number of order items from the supplier: {purchaseOrder.order_items.length}</p>

                            <div>
                                <Row>
                                    <Col>
                                    <div class="card">
                                        <div class="card-statistic-3 p-4">
                                            <div class="d-flex justify-content-between align-items-center">
                                                <div class="col-8">
                                                    <h2 class="d-flex align-items-center fs-6 mb-3">
                                                        Order Status
                                                    </h2>
                                                    <h5 class="card-title " >{purchaseOrder.order_status}</h5>
                                                </div>
                                                <i className="bi bi-truck h1"></i>
                                            </div>
                                            <div class="progress mt-1 " data-height="8" style={{ height: '8px' }}>
                                                <div class="progress-bar" role="progressbar" data-width="25%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{ width: '75%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                    </Col>
                                    <Col>
                                    <div class="card">
                                        <div class="card-statistic-3 p-4">
                                            <div class="d-flex justify-content-between align-items-center">
                                                <div class="col-8">
                                                    <h2 class="d-flex align-items-center fs-6 mb-3">
                                                        Payment Status
                                                    </h2>
                                                    <h5 class="card-title " >{purchaseOrder.payment_status}</h5>
                                                </div>
                                                <i className="bi bi-credit-card-2-front h1"></i>
                                            </div>
                                            <div class="progress mt-1 " data-height="8" style={{ height: '8px' }}>
                                                <div class="progress-bar" role="progressbar" data-width="25%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{ width: '75%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col>
                    <div className="my-3 border border-secondary rounded card-shadow-1">
                        <h3 className="text-center mt-4 layout-blue">
                            <i className="bi bi-graph-up-arrow me-2"></i>Supplier Performance<br></br><span className="fw-light fs-5 ">based on purchase order {purchaseOrder.purchaseOrder_id}</span></h3>

                        <div className="d-flex justify-content-center">
                            <div className="container custom-container-supPerformance">
                                <Form onSubmit={handleSubmit} >
                                    <Form.Group controlId="payment_date" className="mb-3 mt-4">
                                    <Form.Label>Our Payment date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="payment_date"
                                        value={purchaseOrder.payment_date}
                                        onChange={handleChange}
                                    />
                                    </Form.Group>

                                    <Form.Group controlId="sup_deliver_date" >
                                        <Form.Label>Supplier Delivery Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="sup_deliver_date"
                                            value={purchaseOrder.sup_deliver_date}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>

                                    <div className="text-center p-3 my-4 shadow rounded-4">
                                        <div className="p-3 ">
                                            <h5><i className="bi bi-hourglass-bottom"></i></h5>
                                            Days Difference <br></br>
                                            <span className="fw-semibold fs-4">{calculateDateDifference()} days</span>
                                        </div>

                                        <div className="p-3 ">
                                            <h5><i className="bi bi-stopwatch"></i></h5>
                                            Lead Time<br></br>
                                            <span className="fw-semibold fs-4"> {calculateLeadTime()} days</span>
                                        </div>                               

                                        <div class="progress mt-1 " data-height="8" style={{ height: '8px' }}>
                                            <div class="progress-bar orange" role="progressbar" data-width="25%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{ width: '75%' }}></div>
                                        </div>
                                    </div>

                                    <Form.Group controlId="noofDamages" className="mt-2">
                                        <Form.Label>Number of damaged items:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="numberOfErrors"
                                            value={noofDamages}
                                            onChange={e => setNoofDamages(e.target.value)}
                                        />
                                    </Form.Group>

                                    <div className="mt-4 text-center shadow p-3 rounded-4">
                                        <p className="mt-3">Total Number of Order Items: {calculateTotalQuantity()}</p>
                                        <p>Number of Damaged Items: {noofDamages}</p>
                                        <p className="mt-4">
                                        <h5><i className="bi bi-patch-check"></i></h5>
                                        <b>Quality of Goods<br></br>
                                        <span className="fw-semibold fs-4">{calculateQualityOfGoods()}%</span></b></p>

                                        <div class="progress mt-1 " data-height="8" style={{ height: '8px' }}>
                                            <div class="progress-bar orange" role="progressbar" data-width="25%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{ width: '75%' }}></div>
                                        </div>
                                    </div>

                                    <Form.Group controlId="noofActualItems" className="mt-3">
                                        <Form.Label>No of items that were really delivered</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="noofActualItems"
                                            value={noofActualItems}
                                            onChange={e => setNoofActualItems(e.target.value)}
                                        />
                                    </Form.Group>

                                    <div className="shadow p-3 my-4 rounded-4">
                                        <p className="mt-2 text-center">
                                            <h5><i className="bi bi-bar-chart-line"></i></h5>
                                            <b>Quantity Accuracy<br></br>
                                            <span className="fw-semibold fs-4"> {calculateQuantityAccuracy()}%</span></b></p>

                                        <div class="progress mt-1 " data-height="8" style={{ height: '8px' }}>
                                            <div class="progress-bar orange" role="progressbar" data-width="25%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{ width: '75%' }}></div>
                                        </div>
                                    </div>
                                    
                                    <Form.Group controlId="responsiveness" className="mt-4 mb-3">
                                    <Form.Label>Responsiveness:</Form.Label><br></br>
                                    <div className="btn-group d-flex justify-content-center">
                                        <input
                                            type="radio"
                                            id="responsive-excellent"
                                            name="responsiveness"
                                            value="Excellent"
                                            checked={purchaseOrder.responsiveness === "Excellent"}
                                            onChange={handleChange}
                                            className="btn-check"
                                        />
                                        <label className="btn btn-secondary" htmlFor="responsive-excellent">
                                            Excellent
                                        </label>

                                        <input
                                            type="radio"
                                            id="responsive-good"
                                            name="responsiveness"
                                            value="Good"
                                            checked={purchaseOrder.responsiveness === "Good"}
                                            onChange={handleChange}
                                            className="btn-check"
                                        />
                                        <label className="btn btn-secondary" htmlFor="responsive-good">
                                            Good
                                        </label>

                                        <input
                                            type="radio"
                                            id="responsive-average"
                                            name="responsiveness"
                                            value="Average"
                                            checked={purchaseOrder.responsiveness === "Average"}
                                            onChange={handleChange}
                                            className="btn-check"
                                        />
                                        <label className="btn btn-secondary" htmlFor="responsive-average">
                                            Average
                                        </label>

                                        <input
                                            type="radio"
                                            id="responsive-poor"
                                            name="responsiveness"
                                            value="Poor"
                                            checked={purchaseOrder.responsiveness === "Poor"}
                                            onChange={handleChange}
                                            className="btn-check"
                                        />
                                        <label className="btn btn-secondary" htmlFor="responsive-poor">
                                            Poor
                                        </label>
                                    </div>
                                </Form.Group>




                                    <Form.Group controlId="costEffectiveness" className="mt-2">
                                        <Form.Label>Cost Effectiveness</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="costEffectiveness"
                                            value={purchaseOrder.costEffectiveness}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="additional" className="mt-3">
                                        <Form.Label>Additional Information</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            name="additional"
                                            value={purchaseOrder.additional}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="overallSatisfaction" className="mt-3">
                                    <Form.Label>overallSatisfaction:</Form.Label><br></br>
                                    <div className="btn-group d-flex justify-content-center">
                                        <input
                                            type="radio"
                                            id="satisfaction-excellent"
                                            name="overallSatisfaction"
                                            value="Excellent"
                                            checked={purchaseOrder.overallSatisfaction === "Excellent"}
                                            onChange={handleChange}
                                            className="btn-check"
                                        />
                                        <label className="btn btn-secondary" htmlFor="satisfaction-excellent">
                                            Excellent
                                        </label>

                                        <input
                                            type="radio"
                                            id="satisfaction-good"
                                            name="overallSatisfaction"
                                            value="Good"
                                            checked={purchaseOrder.overallSatisfaction === "Good"}
                                            onChange={handleChange}
                                            className="btn-check"
                                        />
                                        <label className="btn btn-secondary" htmlFor="satisfaction-good">
                                            Good
                                        </label>

                                        <input
                                            type="radio"
                                            id="satisfaction-average"
                                            name="overallSatisfaction"
                                            value="Average"
                                            checked={purchaseOrder.overallSatisfaction === "Average"}
                                            onChange={handleChange}
                                            className="btn-check"
                                        />
                                        <label className="btn btn-secondary" htmlFor="satisfaction-average">
                                            Average
                                        </label>

                                        <input
                                            type="radio"
                                            id="satisfaction-poor"
                                            name="overallSatisfaction"
                                            value="Poor"
                                            checked={purchaseOrder.overallSatisfaction=== "Poor"}
                                            onChange={handleChange}
                                            className="btn-check"
                                        />
                                        <label className="btn btn-secondary" htmlFor="satisfaction-poor">
                                            Poor
                                        </label>
                                    </div>
                                </Form.Group>


                                    <div className="mb-5 d-flex flex-column align-items-center justify-content-center">
                                        <Button className="mt-5 " variant="primary" type="submit">Update Purchase Order</Button>
                                    </div>
                                </Form>
                            </div>
                        </div>
                        
                    </div>
                </Col>
            </Row>

        </div>
    </Layout>
    )
}

export default AddSupplierPerformance;