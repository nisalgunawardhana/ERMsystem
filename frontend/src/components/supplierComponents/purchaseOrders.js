import {React, useState, useEffect} from "react";
import axios from "axios";
import { Table, Button, Form, Row, Col, Card, InputGroup, Pagination } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import './supplier.css';
import Layout from '../Layout';

function PurchaseOrder() {

    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [month, setMonth] = useState("");
    const [purchaseOrderIDs, setPurchaseOrderIDs] = useState([]);
    const [totalOrderAmountForMonth, setTotalOrderAmountForMonth] = useState(0);
    const [totalOrderAmountForCurrentMonth, setTotalOrderAmountForCurrentMonth] = useState(0);
    const [todaysPurchaseOrders, setTodaysPurchaseOrders] = useState([]);
    const [todaysTotalAmount, setTodaysTotalAmount] = useState(0);
    const [currentDate, setCurrentDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(10);

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


    //TO GET TOTAL OF TOTAL ORDER AMOUNT - USEEFFECT
    useEffect(() => {
        const getTotalOrderAmount = async () => {
            try {
                const response = await axios.get("http://localhost:8080/purchaseOrder/total");
                setTotalAmount(response.data.totalAmount);
            } catch (error) {
                console.error("Error fetching total order amount:", error);
            }
        };

        getTotalOrderAmount();
    }, []);


    //GET CURRENT DATE - USEEFFECT
    useEffect(() => {
        // Function to get the current date and format it
        const getCurrentDate = () => {
            const dateObj = new Date();
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            setCurrentDate(formattedDate);
        };
        getCurrentDate();
    }, []);


    //GET CURRENT MONTH, YEAR
    const getCurrentMonthAndYear = () => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonthIndex = currentDate.getMonth();
        const currentMonthName = months[currentMonthIndex];
        return { currentMonth: currentMonthName, currentYear: currentYear };
    };
    
    const { currentMonth, currentYear } = getCurrentMonthAndYear();


    //TODAY'S PURCHASE ORDERS - USEEFFECT
    useEffect(() => {
        if (currentDate) {
            const fetchTodaysPurchaseOrders = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/purchaseOrder/today`);
                    setTodaysPurchaseOrders(response.data.purchaseOrders);
                    setTodaysTotalAmount(response.data.purchaseOrders.reduce((total, order) => total + order.total_order_amount, 0));
                } catch (error) {
                    console.error("Error fetching purchase orders for today:", error);
                }
            };
            fetchTodaysPurchaseOrders();
        }
    }, [currentDate]);
    

    //NUMBER OF ORDERS - DELIVER STATUS PENDING (CARD 4)
    const getDeliveringOrders = () => {
        return purchaseOrders.filter(order => order.order_status === "Pending");
    };

    //NUMBER OF ORDERS - PAYMENT STATUS PENDING (CARD 4)
    const getPaymentUndoneOrders = () => {
        return purchaseOrders.filter(order => order.payment_status === "UnPaid");
    };


    //GET PO_IDs BY MONTH (CARD 2)
    const handleSearchByMonth = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/purchaseOrder/idsByMonth/${month}`);
    
            // Get filtered purchase order IDs for the selected month
            const filteredPurchaseOrderIDs = response.data.purchaseOrderIDs;
            setPurchaseOrderIDs(filteredPurchaseOrderIDs);
    
            // Filter purchaseOrders based on filtered IDs
            const filteredPurchaseOrders = purchaseOrders.filter(order =>
                filteredPurchaseOrderIDs.includes(order.purchaseOrder_id)
            );
            setSearchResults(filteredPurchaseOrders);
    
            // Calculate total order amount for the selected month
            const totalAmountForMonth = filteredPurchaseOrders.reduce((total, order) => {
                return total + order.total_order_amount;
            }, 0);
            setTotalOrderAmountForMonth(totalAmountForMonth);
    
        } catch (error) {
            console.error("Error fetching purchase orders by month:", error);
        }
    };
    

    const renderPurchaseOrders =
    searchQuery === "" && searchDate === "" ? purchaseOrders : searchResults;


    //TOTAL AMOUNT OF CURRENT MONTH
    useEffect(() => {
        const getCurrentMonth = () => {
            const dateObj = new Date();
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            return `${year}-${month}`;
        };

        const currentMonth = getCurrentMonth();

        const filteredPurchaseOrders = purchaseOrders.filter(order => {
            const orderMonth = order.order_date.slice(0, 7);
            return orderMonth === currentMonth;
        });

        const totalAmountForCurrentMonth = filteredPurchaseOrders.reduce((total, order) => {
            return total + parseFloat(order.total_order_amount);
        }, 0);

        setTotalOrderAmountForCurrentMonth(totalAmountForCurrentMonth);
    }, [purchaseOrders]);


    //SEARCH BY PO_ID
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


    // SEARCH BY ORDER DATE
    const handleSearchPurchaseOrderByDate = (e) => {
        const date = e.target.value;
        setSearchDate(date);
        const filteredPurchaseOrders = purchaseOrders.filter((order) =>
            order.order_date.includes(date)
        );
        setSearchResults(filteredPurchaseOrders);
    };

    const handlePOReport = () => {
        const printWindow = window.open("", "_blank", "width=600,height=600");
        printWindow.document.write(`
        <html>
        <head>
            <title>Purchase Order Report</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                }
                h1 {
                    text-align: center;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                th, td {
                    border: 1px solid #ccc;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
            </style>
        </head>
        <body>
            <h1>Purchase Order Report</h1>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Purchase Order ID</th>
                        <th>Supplier ID</th>
                        <th>Supplier Name</th>
                        <th>Order Date</th>
                        <th>Delivery Date</th>
                        <th colspan="5">Order Items</th>
                        <th>Order Amount</th>
                        <th colspan="2">Delivery Information</th>
                        <th colspan="2">Payment Information</th>
                        <th>Total Order Amount</th>
                        <th>Invoice Number</th>
                        <th>Order Status</th>
                        <th>Payment Status</th>
                        <th>Additional Information</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>#</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <th>Item anme</th>
                        <th>Unit price</th>
                        <th>quantoty</th>
                        <th>description</th>
                        <th>Total</th>
                        <td></td>
                        <th>Delivery Method</th>
                        <th>Delivery costs</th>
                        <th>Payment Methos</th>
                        <th>Payment terms</th>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>

                    </tr>
                    ${purchaseOrders.map((order, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${order.purchaseOrder_id}</td>
                            <td>${order.supplier_id}</td>
                            <td>${order.supplier_name}</td>
                            <td>${order.order_date}</td>
                            <td>${order.deliver_date}</td>
                                ${order.order_items.map(item => `
                                
                                    <td>${item.item_name}</td>
                                    <td>${item.quantity}</td>
                                    <td>${item.description}</td>
                                    <td>${item.unit_price}</td>
                                    <td>${item.total_price}</td>
                            `).join('')}
                            <td>Rs. ${order.order_amount}</td>
                            <td>${order.delivery_information.delivery_method}</td> 
                            <td>Costs: ${order.delivery_information.delivery_costs}</td>
                            <td>${order.payment_information.payment_method}</td>
                            <td> ${order.payment_information.payment_terms}</td>
                            <td>Rs. ${order.total_order_amount}</td>
                            <td>${order.invoice_no}</td>
                            <td>${order.order_status}</td>
                            <td>${order.payment_status}</td>
                            <td>${order.additional_infomation}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div>
                <button onclick="window.close()" class="btn btn-secondary">Back</button>
            </div>
        </body>
        </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };
    

    //PAGINATION
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = renderPurchaseOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
    );

    const paginate = (pageNumber) => setCurrentPage(pageNumber);   // Change page

    const paginationItems = []; //pagination componenet
    for (let number = 1; number <= Math.ceil(renderPurchaseOrders.length / ordersPerPage); number++) {
    paginationItems.push(
    <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
        {number}
    </Pagination.Item>,
    );
    }
    
    const paginationBasic = ( // Pagination component
    <Pagination>
    <Pagination.First onClick={() => paginate(1)} />
    <Pagination.Prev onClick={() => paginate(currentPage - 1)} />
    {paginationItems}
    <Pagination.Next onClick={() => paginate(currentPage + 1)} />
    <Pagination.Last onClick={() => paginate(Math.ceil(renderPurchaseOrders.length / ordersPerPage))} />
    </Pagination>
    );


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
        <Layout>
        <div className="bg container-fluid">
            <div className="container layout-blue">
                <h2><span className="fw-light fs-6 ">Purchase Order Management</span><br></br>Purchase Orders</h2>
                
                <div className="mt-3">
                    <Link to="/supplier/"><Button className="back-btn " variant="secondary"><i className="bi bi-arrow-left me-2"></i><span>Back</span></Button></Link>
            
                    <Link to="/purchaseOrder/add"><Button className=" ms-3 text-white" id="up-btn-btn" ><i className="bi bi-cart3 me-2"></i>Create Purchase Order</Button></Link>
                </div>
            </div>

            <div className="mt-4">
                <Row>
                    <Col>
                    <div className="card">
                        <div className="card-statistic-3 p-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="col-8">
                                    <h2 className="d-flex align-items-center text-secondary fs-6 mb-1">
                                        Purchase Orders
                                    </h2>
                                    <h5 className="card-title fs-4" >Order supplies to restock</h5>
                                    <div>
                                        <Link to="/purchaseOrder/add">
                                            <Button variant="dark" className="side-btn mt-5 mb-2 ">
                                                <span>
                                                Create a purchase Orders
                                                <i className="bi bi-file-bar-graph"></i></span>
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                                <i className="bi bi-cart4 h1"></i>
                            </div>
                            <div className="progress mt-1 " data-height="8" style={{ height: '8px' }}>
                                <div className="progress-bar orange" role="progressbar" data-width="25%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{ width: '75%' }}></div>
                            </div>
                        </div>
                    </div>
                    </Col>
                    <Col>
                    <div className="card ">
                        <div className="card-statistic-3 p-4 ">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <div className="col-8">
                                    <h2 className="d-flex align-items-center text-secondary fs-6 mb-1">
                                        Supplier report
                                    </h2>
                                    <h5 className="card-title " >Generate purchase order report for financial processes</h5>
                                    <div>
                                        <Button className="mb-2 mt-4 position-relative bottom-0 start-0 text-white side-btn" variant="dark" onClick={handlePOReport}><span>All Purchase Order report<i className="bi bi-journals"></i></span></Button>
                                    </div>
                                </div>
                                <i className="bi bi-file-earmark-bar-graph-fill h1"></i>
                            </div>
                            <div className="progress mt-1" data-height="8" style={{ height: '8px' }}>
                                <div className="progress-bar orange" role="progressbar" data-width="25%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{ width: '75%' }}></div>
                            </div>
                        </div>
                    </div>
                    </Col>
                </Row>
            </div>

            <div className="shadow p-3 rounded"> 
            <div>
                <div className="fs-5 mt-3 fw-semibold"><i className="bi bi-bar-chart-steps me-2"></i>Order Summery</div>
                <div className="text-secondary mb-4">Quick reference and analysis to condensed overview of recent purchasing transactions, with metrics like total order count.</div>
            </div>


               
            <div>
                <div className="row ">
                    <div className="col-lg-4 col-md-6 mb-3">
                        <div className="card ">
                            <div className="card-statistic-3 p-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="col-8">
                                        <h2 className="d-flex align-items-center mb-5">
                                            Rs.{totalAmount}
                                        </h2>
                                        <h5 className="card-title" style={{ marginTop: '25px' }}>Total Order Amount of all POs</h5>
                                    </div>
                                    <i className="bi bi-cash-coin h1"></i>
                                </div>
                                <div className="progress mt-1 " data-height="8" style={{ height: '8px' }}>
                                    <div className="progress-bar l-bg-cyan" role="progressbar" data-width="25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{ width: '25%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 mb-3">
                        <div className="card ">
                            <div className="card-statistic-3 p-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="col-8">
                                        <h2 className="d-flex align-items-center mb-5">
                                            Rs.{todaysTotalAmount}
                                            {/* <span className="fw-light fs-6 mt-3 ms-2">Today {currentDate}</span> */}
                                        </h2>
                                        <h5 className="card-title" style={{ marginTop: '25px' }}>Total Order Amount for Today 
                                        <span className="fw-light fs-6"> {todaysPurchaseOrders.length} order/s </span></h5>
                                    </div>
                                    <i className="bi bi-cash-coin h1"></i>
                                </div>
                                <div className="progress mt-1 " data-height="8" style={{ height: '8px' }}>
                                    <div className="progress-bar l-bg-cyan" role="progressbar" data-width="25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{ width: '25%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 mb-3">
                        <div className="card ">
                            <div className="card-statistic-3 p-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="col-8">
                                        <h2 className="d-flex align-items-center mb-5">
                                            Rs. {totalOrderAmountForCurrentMonth}
                                        </h2>
                                        <h5 className="card-title" style={{ marginTop: '25px' }}>Total Order Amount for current month <span className="fw-light">{currentMonth} {currentYear}</span></h5>
                                    </div>
                                    <i className="bi bi-cash-coin h1"></i>
                                </div>
                                <div className="progress mt-1 " data-height="8" style={{ height: '8px' }}>
                                    <div className="progress-bar l-bg-cyan" role="progressbar" data-width="25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{ width: '25%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div >
                <Row>
                    <Col>
                    <div className="card" style={{height:"90%"}}>
                        <div className="card-header  fw-semibold">
                        <i className="bi bi-calendar2-event me-2"></i>Monthly Orders
                        </div>
                        <div className="card-statistic-3 p-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="col-8">
                                <Form className="text-center">
                                    <Form.Group controlId="formSearchPO">
                                        <Form.Label>Search Purchase order by month</Form.Label>
                                        <Row>
                                            <Col xs={11}>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter month"
                                                    aria-label="formSearchmonth"
                                                    aria-describedby="basic-addon1"
                                                    value={month}
                                                    onChange={(e) => setMonth(e.target.value)}
                                                />
                                            </Col>
                                            <Col xs={1}>
                                                <Button variant="outline-secondary search-button" style={{width:"20px", height:"40px"}} onClick={handleSearchByMonth}>
                                                    <i className="bi bi-search search-button d-flex justify-content-center"></i>
                                                </Button>
                                            </Col>
                                        </Row>
                                        <p className="mt-4 fw-light">Number of POs in month of {month}: <span className="fw-semibold"> {purchaseOrderIDs.length}</span> </p>
                                        <p className="mt-4 fw-light">Total Order Amount for that month: <br></br><span className="fs-4 d-block text-center fw-semibold">Rs. {totalOrderAmountForMonth}</span></p>
                                    </Form.Group>
                                </Form>
                                </div>
                                <h1><i className="bi bi-calendar2-event me-2"></i></h1>
                            </div>
                        </div>
                    </div>
                    </Col>
                    <Col>
                    <div className="card " style={{height:"90%"}}>
                        <div className="card-header  fw-semibold">
                        <i className="bi bi-truck me-2"></i>Pending payments and orders
                        </div>
                        <div className="card-statistic-3 p-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="col-8">
                                    <div>
                                        <div className="fw-light fs-6">pending orders</div>
                                        <h4>Number of delivering orders: {getDeliveringOrders().length}</h4>
                                    </div>
                                    <div className="mt-5">
                                        <div className="fw-light fs-6">payment not done orders</div>
                                        <h4 >Number of payment not done orders: {getPaymentUndoneOrders().length}</h4>
                                    </div>
                                </div>
                                <h1><i className="bi bi-truck me-2"></i></h1>
                            </div>
                        </div>
                    </div>
                    </Col>
                </Row>
            </div>
        </div>
{/* 
            <div > 
                <Row >
                    <Col xs={3}>
                        <Card className="mt-4 text-center card-shadow-1 rounded text-white dark-blue" style={{height:"80%"}}>
                            <Card.Body className="mt-4">
                                <Card.Text>
                                <p className="fs-3">Rs.{totalAmount}<br></br>
                                <span className="fs-6 fw-light">Total Order Amount of all POs</span></p>
                                </Card.Text>
                                <Button variant="primary" className="mb-3 me-3 position-absolute bottom-0 end-0 side-btn"  onClick={handlePOReport}><span>Generate Report<i className="bi bi-journals"></i></span></Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={3}>
                        <Card className="mt-4 card-shadow-1 rounded" style={{ height:"80%", backgroundColor:'#7096d1', borderColor:'#E5DDC5' }}>
                            <Card.Header as="h6" style={{backgroundColor:'#7096d1'}}>Monthly Purchase Orders</Card.Header>
                            <Card.Body >
                                <Form>
                                    <Form.Group controlId="formSearchPO">
                                        <Form.Label>Search Purchase order by month</Form.Label>
                                        <Row>
                                            <Col xs={9}>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter month"
                                                    aria-label="formSearchmonth"
                                                    aria-describedby="basic-addon1"
                                                    value={month}
                                                    onChange={(e) => setMonth(e.target.value)}
                                                />
                                            </Col>
                                            <Col xs={1}>
                                                <Button variant="outline-secondary search-button" style={{width:"20px", height:"40px"}} onClick={handleSearchByMonth}>
                                                    <i className="bi bi-search search-button d-flex justify-content-center"></i>
                                                </Button>
                                            </Col>
                                        </Row>
                                        <p className="mt-3">Number of POs in month of {month}: <span className="fw-semibold"> {purchaseOrderIDs.length}</span> </p>
                                        <p className="mt-4">Total Order Amount for that month: <br></br><span className="fs-4 d-block text-center">Rs. {totalOrderAmountForMonth}</span></p>
                                    </Form.Group>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={3}>
                        <Card className="mt-4 card-shadow-1 rounded light-brown" style={{height:"80%"}}>
                            <Card.Header as="h6" >Today Purchase Orders</Card.Header>
                            <Card.Body className="light-brown">
                                <Card.Text >
                                <p className="fw-light fs-6 text-end"><i className="me-1 bi bi-calendar4-event"></i>Today's Date: <br></br><span className=" fw-normal">{currentDate}</span></p>
                                <p className="text-center fw-light">Total Order Amount for Today: <br></br><span className="fs-4 fw-normal"> Rs. {todaysTotalAmount}</span></p>
                                <p>Number of Purchase Orders: <span className="fs-5">{todaysPurchaseOrders.length}</span></p>
                                
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={3}>
                        <Card className="mt-4 me-2 card-shadow-1 rounded" style={{ height:"80%", backgroundColor:'#89CFF3', borderColor:'#7096d1' }}>
                            <Card.Header as="h6"  style={{backgroundColor:'#89CFF3'}}>Deliver status and Payment status</Card.Header>
                            <Card.Body >
                                <Card.Title>Delivering Orders</Card.Title>
                                <Card.Text>
                                    Number of delivering orders: {getDeliveringOrders().length}
                                </Card.Text>
                            </Card.Body>
                            <hr style={{ color:'Grey'}} ></hr>
                            <Card.Body>   
                                <Card.Title>Payment undone Orders</Card.Title>
                                <Card.Text>
                                    Number of payment not done orders: {getPaymentUndoneOrders().length}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div> */}

            <div className="mt-4">
                <div className="ms-2 fs-4 layout-blue" >All Purchase Orders</div>
                <Row>
                    <Col xs={5} >
                    <div className="container mb-3 ">
                        <Form>
                            <Form.Group controlId="formSearchPO " className="mt-3 ">
                                <Form.Label>Search by Purchase Order ID</Form.Label>
                                <Row>
                                    <Col >
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Purchase Order ID"
                                            aria-label="formSearchPO"
                                            aria-describedby="basic-addon1"
                                            value={searchQuery}
                                            onChange={handleSearchPurchaseOrder}
                                        />
                                    </Col>
                                    <Col xs={2}>
                                        <Button variant="outline-secondary search-button" ><i className="bi bi-search search-icon"></i></Button>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Form>
                    </div>
                    </Col>
                    <Col  xs={5} >
                    <div className="container mb-3 ms-5">
                        <Form>
                            <Form.Group ontrolId="formSearchDate" className="mt-3">
                                <Form.Label>Search by Order date</Form.Label>
                                <Row>
                                    <Col>
                                        <Form.Control
                                        type="date"
                                        placeholder="Select Order Date"
                                        aria-label="formSearchPOdtae"
                                        aria-describedby="basic-addon1"
                                        value={searchDate}
                                        onChange={handleSearchPurchaseOrderByDate}
                                        />
                                    </Col>
                                    <Col xs={2}>
                                        <Button variant="outline-secondary search-button" ><i className="bi bi-search search-icon"></i></Button>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Form>
                    </div>
                    </Col>
                </Row>
            </div>

            <div>
                <Table striped bordered hover  className="shadow">
                    <thead>
                        <tr>
                        <th>Purchase Order ID</th>
                        <th>Supplier ID</th>
                        <th>Supplier Name</th>
                        <th>Order Date</th>
                        <th>Delivery Date</th>
                        {/* <th>Order Items</th> */}
                        <th>Order Amount</th>
                        <th>Delivery Information</th>
                        {/* <th>Payment Information</th> */}
                        <th>Additional Information</th>
                        <th>Total Order Amount</th>
                        <th>Invoice Number</th>
                        <th>Order Status</th>
                        <th>Payment Status</th>
                        <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOrders.map((order) => (
                        <tr key={order.purchaseOrder_id}>
                            <td>{order.purchaseOrder_id}</td>
                            <td>{order.supplier_id}</td>
                            <td>{order.supplier_name}</td>
                            <td>{order.order_date}</td>
                            <td>{order.deliver_date}</td>
                            {/* <td>
                                <ul>
                                    {order.order_items.map((item, index) => (
                                    <li key={index}>
                                        {item.item_name} - Quantity: {item.quantity}
                                    </li>
                                    ))}
                                </ul>
                            </td> */}
                            <td>Rs. {order.order_amount}</td>
                            <td>
                                Method: {order.delivery_information.delivery_method} Costs:{" "}
                                {order.delivery_information.delivery_costs}
                            </td>
                            {/* <td>
                                Method: {order.payment_information.payment_method}, Terms:{" "}
                                {order.payment_information.payment_terms}
                            </td> */}
                            <td>{order.additional_infomation}</td>
                            <td><b>Rs. {order.total_order_amount}</b></td>
                            <td>{order.invoice_no}</td>
                            <td>{order.order_status}</td>
                            <td>{order.payment_status}</td>
                            <td>

                            <div className="position-relative" >
                                <Link to={`/purchaseOrder/get/${order._id}`}>
                                    <Button id="up-btn" variant="dark" size="sm" style={{ fontSize: "small"}}  className="my-2 text-white"><i class="bi bi-file-earmark-text me-1"></i>View PO</Button>
                                </Link>
                                <Link to={`/purchaseOrder/addPerformance/${order._id}`}>
                                    <Button id="up-btn" variant="secondary" size="sm" style={{ fontSize: "small"}}  className="my-2 text-white"><i class="bi bi-file-earmark-text me-1"></i>Performance</Button>
                                </Link>
                                
                            </div>
                            
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <div className="container d-flex justify-content-center">
            <Pagination>
                <Pagination.First onClick={() => paginate(1)} />
                <Pagination.Prev onClick={() => paginate(currentPage - 1)} />
                {paginationItems}
                <Pagination.Next onClick={() => paginate(currentPage + 1)} />
                <Pagination.Last onClick={() => paginate(Math.ceil((searchQuery === "" && searchDate === "" ? purchaseOrders.length : searchResults.length) / ordersPerPage))} />
            </Pagination>
            </div>

        </div>
    </Layout>
    )
}

export default PurchaseOrder;


 // const handleSearchByMonth = async () => {
    //     try {
    //         const response = await axios.get(`http://localhost:8080/purchaseOrder/idsByMonth/${month}`);
    //         setPurchaseOrderIDs(response.data.purchaseOrderIDs);
            
    //         // Calculate total order amount for the selected month
    //         const totalAmountForMonth = response.data.purchaseOrderIDs.reduce((total, id) => {
    //             const order = purchaseOrders.find(order => order.purchaseOrder_id === id);
    //             return total + order.total_order_amount;
    //         }, 0);
    //         setTotalOrderAmountForMonth(totalAmountForMonth);
    //     } catch (error) {
    //         console.error("Error fetching purchase orders by month:", error);
    //     }
    // };


// ${order.order_items.map(item => `
                                
//     <td>${item.item_name}</td>
//     <td>${item.quantity}</td>
//     <td>${item.description}</td>
//     <td>${item.unit_price}</td>
//     <td>${item.total_price}</td>
// `).join('')}