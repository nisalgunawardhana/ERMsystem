import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link, Navigate } from "react-router-dom";
import axios from "axios";
import { Button, Row, Col, Collapse, Modal} from "react-bootstrap";
import { jsPDF } from "jspdf";
import './supplier.css';
import Layout from '../Layout';


function ViewSupplier() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [openBankDetails, setOpenBankDetails] = useState(false);
    const [officialPurchaseOrderCount, setofficialPurchaseOrderCount] = useState(0);
    const [officialFilteredPOs, setofficialFilteredPOs] = useState([]);
    const [supplierOnlyPOs, setsupplierOnlyPOs] = useState(false);
    const [paymentPendingPOs, setPaymentPendingPOs] = useState([]);
    const [performancePOcount, setPeroformancePOcount] = useState(0);
    const [performancePOs, setPeroformancePOs] = useState([]);
    const [maxDaysDifference, setMaxDaysDifference] = useState(0);


    const [supplier, setSupplier] = useState({
        supplier_id: "",
        supplier_name: "",
        address: "",
        contact: 0,
        email: "",
        product_types: [],
        product_items: [],
        bank_details: {
            bank: "",
            branch: "",
            acc_no: 0,
            payment_method: "",
            payment_terms: ""
        },
        sup_performance: {
            quality: "",
            delivery_time: ""
        },
        contract: {
            start_date: null,
            end_date: null
        }
    });

    useEffect(() => {
        axios.get(`http://localhost:8080/supplier/get/${id}`)
            .then(response => {
                const { supplier } = response.data; 
                setSupplier({
                    ...supplier
                });
            })
            .catch(error => {
                console.error("Error fetching supplier:", error);
            });


        axios.get("http://localhost:8080/purchaseOrder/")
            .then(response => {
                const purchaseOrders = response.data;
                //POs OF THE SUPPLIER
                const supplierPurchaseOrders = purchaseOrders.filter((order) => 
                    order.supplier_id === supplier.supplier_id
                );
                setofficialPurchaseOrderCount(supplierPurchaseOrders.length);

                const officialFilteredPOs = supplierPurchaseOrders.map(order => ({
                    ...order,
                  

                }));
                setofficialFilteredPOs(officialFilteredPOs);

                const performanceadded = supplierPurchaseOrders.filter(order => order.qualityOfGoods !== null);

                //ONLY PERFROMACNE ADDED POs
                setPeroformancePOcount(performanceadded.length);
                setPeroformancePOs(performanceadded);

                //PAYMENT PENDING POs
                const pendingPOs = supplierPurchaseOrders.filter(po => po.payment_status === 'UnPaid');
                setPaymentPendingPOs(pendingPOs);

                //DATE DIFFERENCE
                const poWithDaysDifference = calculateDaysDifference(performanceadded);
                setPeroformancePOcount(poWithDaysDifference.length);
                setPeroformancePOs(poWithDaysDifference);

                //MAX DAYS DIFFERENCE
                const { maxDifference } = calculateMaxDaysDifference(performancePOs);
                setMaxDaysDifference(maxDifference);
                
                })

            .catch(error => {
                console.error("Error fetching purchase orders:", error);
            });
    }, [id, supplier.supplier_id]);


    //GET MONTH FOR QUALITY OF GOODS GRAPH
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const calculateQualityOfGoodsRate = () => {
        const qualityOfGoodsByMonth = {};
        const purchaseOrdersByMonth = {};
    
        // Loop through each purchase order
        performancePOs.forEach(order => {
            const supDeliverDate = new Date(order.sup_deliver_date);
            const monthIndex = supDeliverDate.getMonth();
            const month = monthNames[monthIndex]; // Get month name
            if (!qualityOfGoodsByMonth[month]) {
                qualityOfGoodsByMonth[month] = 0;
                purchaseOrdersByMonth[month] = 0;
            }
            qualityOfGoodsByMonth[month] += order.qualityOfGoods;
            purchaseOrdersByMonth[month]++;
        });
    
        const qualityOfGoodsRateByMonth = {};
        Object.keys(qualityOfGoodsByMonth).forEach(month => {
            const qualityOfGoods = qualityOfGoodsByMonth[month];
            const numPurchaseOrders = purchaseOrdersByMonth[month];
            const qualityOfGoodsRate = numPurchaseOrders !== 0 ? qualityOfGoods / numPurchaseOrders : 0;
            qualityOfGoodsRateByMonth[month] = qualityOfGoodsRate;
        });
    
        return qualityOfGoodsRateByMonth;
    };
    
    const renderQualityOfGoodsRate = () => {
        const qualityOfGoodsRateByMonth = calculateQualityOfGoodsRate();
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
        return Object.keys(qualityOfGoodsRateByMonth).map(month => (
            // <div key={month} style={{ marginBottom: '20px' }}>
            //     <p>Month: {month} {qualityOfGoodsRateByMonth[month]}</p>
            //     <div style={{ width: '100%', backgroundColor: '#f0f0f0', height: '20px', borderRadius: '5px' }}>
            //         <div style={{ width: `${qualityOfGoodsRateByMonth[month]}%`, backgroundColor: 'green', height: '100%', borderRadius: '5px' }}></div>
            //     </div>
            //     <p>Quality of Goods Rate: {qualityOfGoodsRateByMonth[month]}</p>
            // </div>

            <div key={month} style={{ marginBottom: '20px' }}>
            <Row>
                <Col xs={1}>
                    <p className="text-center">{month}</p>
                </Col>
                <Col>
                    <div style={{ width: '100%', backgroundColor: '#f0f0f0', height: '20px', borderRadius: '5px' }}>
                        <div style={{ width: `${qualityOfGoodsRateByMonth[month]}%`, backgroundColor: 'green', height: '100%', borderRadius: '5px' }} className="text-center text-white">{qualityOfGoodsRateByMonth[month]}%</div>
                    </div>
                </Col>
            </Row>
            </div>
        ));
    };


    //DELETE SUPPLIER
    const handleDeleteSupplier = () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this supplier?");
        
        if (confirmDelete) {
            axios.delete(`http://localhost:8080/supplier/delete/${id}`)
                .then(() => {
                    alert("Supplier deleted successfully");
                    navigate("/supplier");
                })
                .catch((err) => {
                    console.error("Error deleting supplier:", err);
                    alert("Error deleting supplier");
                });
        }
    };


    //ALLPOs - MODEL
    const handleClose = () => setsupplierOnlyPOs(false);
    const handleShow = () => setsupplierOnlyPOs(true);


    //DAYS DIFFERENCE
    function calculateDaysDifference(supplierPurchaseOrders) {
        return supplierPurchaseOrders.map(order => {
            const deliverDate = new Date(order.deliver_date);
            const supDeliverDate = new Date(order.sup_deliver_date);
            const differenceInTime = supDeliverDate.getTime() - deliverDate.getTime();
            const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    
            // Extract month from sup_deliver_date and convert to month name
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const supDeliverMonth = monthNames[supDeliverDate.getMonth()]; 
    
            return {
                ...order,
                days_difference: differenceInDays,
                sup_deliver_month: supDeliverMonth 
            };
        });
    }

    //MAX DAYS DIFFERENCE
    function calculateMaxDaysDifference(supplierPurchaseOrders) {
        let maxDifference = 0;
        let ordersWithMaxDifference = [];
    
        supplierPurchaseOrders.forEach(order => {
            const deliverDate = new Date(order.deliver_date);
            const supDeliverDate = new Date(order.sup_deliver_date);
            const differenceInTime = supDeliverDate.getTime() - deliverDate.getTime();
            const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    
            if (differenceInDays > maxDifference) {
                maxDifference = differenceInDays;
                ordersWithMaxDifference = [order];
            } else if (differenceInDays === maxDifference) {
                ordersWithMaxDifference.push(order);
            }
        });
    
        return { maxDifference, ordersWithMaxDifference };
    }
    
    

    //AVG DELIVER RATE
    const finalAvgDeliveryRate = calculateAvgDeliveryRate(performancePOs);

    function calculateAvgDeliveryRate(performancePOs) {
        const totalDaysDifference = performancePOs.reduce((acc, po) => {
            return acc + po.days_difference;
        }, 0);
        const finalAvgDeliveryRate = totalDaysDifference / performancePOs.length;
        return finalAvgDeliveryRate;
    }


    //AVG QUALITY OF GOODS RATE
    function calculateAvgQualityOfGoodsRate() {
        const qualityOfGoodsByMonth = calculateQualityOfGoodsRate();
        const months = Object.keys(qualityOfGoodsByMonth);
        const totalQuality = months.reduce((total, month) => total + qualityOfGoodsByMonth[month], 0);
        const avgQualityRate = totalQuality / months.length;
        return avgQualityRate;
    }
    
    const avgQualityOfGoodsRate = calculateAvgQualityOfGoodsRate();


    //AVG QUANTITY ACCURACY RATE
    function calculateAvgQuantityAccuracyRate() {
        const totalQualityAccuracy = performancePOs.reduce((acc, po) => {
            return acc + po.qualityOfGoods;
        }, 0);
        const finalAvgQuantityAccuracyRate = totalQualityAccuracy / performancePOs.length;
        return finalAvgQuantityAccuracyRate;
    }

    const avgQuantityAccuracyRate = calculateAvgQuantityAccuracyRate();


    //FORMAT DATE
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US');
    }

    //GET SUPPLIER BY RESPONSIVENESS CATOGORY
    const calculatePerformancePOsByCategory = () => {
        const performancePOsByCategory = {
            'Excellent': 0,
            'Good': 0,
            'Average': 0,
            'Poor': 0
        };

        // Loop through performancePOs and categorize
        performancePOs.forEach(order => {
            const responsiveness = order.responsiveness;
            performancePOsByCategory[responsiveness]++;
        });

        return performancePOsByCategory;
    };

    const performancePOsByCategory = calculatePerformancePOsByCategory();




    //GET SUPPLIER BY OVERALL SATISFACTION
    const calculateOverallSatisfactionPOsByCategory = () => {
        const overallSatisfactionPOsByCategory = {
            'Excellent': 0,
            'Good': 0,
            'Average': 0,
            'Poor': 0
        };

        // Loop through overallSatisfactionPOs and categorize 
        performancePOs.forEach(order => {
            const satisfaction = order.overallSatisfaction;
            overallSatisfactionPOsByCategory[satisfaction]++;
        });

        return overallSatisfactionPOsByCategory;
    };

    const overallSatisfactionPOsByCategory = calculateOverallSatisfactionPOsByCategory();


    //FINAL SATISAFACTION WITH THE SUPPLIER
    const calculateFinalAvgSatisfaction = () => {
        const percentages = {
            'Excellent': 100,
            'Good': 75,
            'Average': 50,
            'Poor': 25
        };
    
        // Get the counts for each category
        const performancePOsByCategory = calculatePerformancePOsByCategory();
        const { Excellent, Good, Average, Poor } = performancePOsByCategory;
    
        // Calculate the weighted total satisfaction
        const weightedTotalSatisfaction =
            (Excellent * percentages['Excellent'] +
            Good * percentages['Good'] +
            Average * percentages['Average'] +
            Poor * percentages['Poor']);
    
        // Calculate the final average satisfaction
        const finalAvgSatisfaction = weightedTotalSatisfaction / performancePOcount;
    
        // Find the corresponding word based on the percentage
        let satisfactionWord = '';
        if (finalAvgSatisfaction >= 100) {
            satisfactionWord = 'A perfect supplier. Satisfied!';
        } else if (finalAvgSatisfaction >= 85) {
            satisfactionWord = 'Satisfied';
        } else if (finalAvgSatisfaction >= 75) {
            satisfactionWord = 'Good';
        } else if (finalAvgSatisfaction >= 50) {
            satisfactionWord = 'Average perfect';
        } else {
            satisfactionWord = 'Not satisfied';
        }
    
        return { percentage: finalAvgSatisfaction.toFixed(2), word: satisfactionWord };
    };
    
    



    // DOWNLOAD SUPPLIER
    const printPdfSupplier = () => {
        const doc = new jsPDF();
    
        doc.setLineWidth(0.5); 
        doc.rect(5, 5, 200, 280); 

        doc.setFontSize(16);
        doc.text('Supplier Details', 10, 20);
    
        doc.setFontSize(12);
        doc.text(`Supplier ID: ${supplier.supplier_id}`, 10, 30);
        doc.text(`Supplier Name: ${supplier.supplier_name}`, 10, 40);
        doc.text(`Address: ${supplier.address}`, 10, 50);
        doc.text(`Contact: ${supplier.contact}`, 10, 60);
        doc.text(`Email: ${supplier.email}`, 10, 70);
    
        doc.setFontSize(14);
        doc.text('Bank Details', 10, 85);

        doc.setFontSize(12);
        doc.text(`Bank: ${supplier.bank_details.bank}`, 10, 95);
        doc.text(`Branch: ${supplier.bank_details.branch}`, 10, 105);
        doc.text(`Account Number: ${supplier.bank_details.acc_no}`, 10, 115);
        doc.text(`Payment Terms: ${supplier.bank_details.payment_terms}`, 10, 125);
        doc.text(`Payment Method: ${supplier.bank_details.payment_method}`, 10, 135);
    
        doc.setFillColor(200, 200, 200); 
        doc.rect(10, 155, 190, 10, 'F'); 
        doc.setTextColor(0); 
        doc.text('Product Name', 15, 160);
        doc.text('Unit Price', 65, 160);

        doc.setFontSize(12);
        doc.text(`Products of ${supplier.supplier_name} supplier product types dl nh`, 10, 150);

        let y = 170;
        supplier.product_items.forEach((item) => {
            doc.text(item.product_name, 15, y);
            doc.text(item.unit_price.toString(), 65, y);
            y += 10; 
        });
    
        doc.setFontSize(11); 
        doc.text('Supplier Performance', 10, y + 10);

        doc.setFontSize(12);
        doc.text(`Quality: ${supplier.sup_performance.quality}`, 15, y + 20);
        doc.text(`Delivery Time: ${supplier.sup_performance.delivery_time}`, 15, y + 30);

        doc.setFontSize(11); 
        doc.text('Contract Details', 10, y + 50);

        doc.setFontSize(12);
        doc.text(`Start Date: ${supplier.contract.start_date}`, 10, y + 60);
        doc.text(`End Date: ${supplier.contract.end_date}`, 10, y + 70);
    
        doc.save(`Supplier_Details_${supplier.supplier_id}.pdf`);
    };
    

    return(
        <Layout>
            <div className="container-fluid mt-3 bg ">
                <div className="layout-blue">
                    <div >
                        <Row >
                            <Col >
                                <div className="fw-light">Supplier Details</div>
                            </Col>
                            <Col >
                                <div className="d-flex justify-content-end">
                                    <Link to="/supplier">
                                        <Button className="back-btn me-2" variant="secondary" ><i className="bi bi-arrow-left me-1"></i><span>Back</span></Button>
                                    </Link>
                                    <Link to="/rfq"><Button id="up-btn" className="me-2" variant="success"><i className="bi bi-shop me-2"></i>Call new Suppliers?</Button></Link>
                                    <Link to={`/supplier/add`} >
                                        <Button variant="primary" id="up-btn">
                                        <i className="bi bi-shop"></i> Add a Supplier
                                        </Button>
                                    </Link>
                                </div>
                            </Col>
                        </Row>           
                    </div>
                    <h1>Supplier {supplier.supplier_name}</h1>
                </div>

                <div> 

                    <div className="mb-5 mt-4 " >
                        
                        <div >
                            <p className="fw-light fs-5"><i className="ri-id-card-line me-2"></i>Supplier ID: {supplier.supplier_id}</p>
                            <p className=" fs-5"><i className="bi bi-mailbox2-flag me-2"></i>{supplier.address}</p>
                            <p className="  fs-5"><i className="bi bi-envelope-at me-2"></i>{supplier.email}</p>
                            <p className=" fs-5"><i className="bi bi-telephone me-2"></i>{supplier.contact}</p>
                            
                        </div>
                        
                    </div>

                    <div className="p-3 shadow rounded border border-dark">
                        <h5 className="fw-light mb-4 layout-blue"><i className="bi bi-bag me-1"></i>About Products</h5>

                        <div className="text-center">
                            <div className="fs-5 fw-light mt-5 mb-2"><i className="bi bi-tags me-2"></i>Supplier seling products</div>
                            <div className="fs-5 text-center">{supplier.product_types.join(', ')}</div>
                        </div>

                        <div>
                            <p className="fw-light fs-5 mt-4 text-center"><i className="bi bi-duffle me-2"></i>Product Items</p>
                            <div className="d-flex layout-blue-bg mb-3 justify-content-center">
                                <table className=" table p-3 mt-3 ">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Product Name</th>
                                            <th scope="col">Unit Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {supplier.product_items.map((item, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{item.product_name}</td>
                                                <td>{item.unit_price}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="p-3 rounded-2 mt-5 shadow">
                        <p className="fw-light fs-5"><i className="bi bi-graph-up-arrow me-2"></i>About Performance</p>

                        <div className="fw-light layout-blue text-center"><i className="bi bi-cart4 me-2"></i>{supplier.supplier_name}</div>
                        <h3 className="mb-5 fw-light layout-blue text-center">Supplier Performance</h3>

                        <div className="mb-4">
                            <Row >
                                <Col xs={4}>
                                    <div className="mt-1 ">Number of purchase orders so far: <span className="fw-semibold fs-5">{officialPurchaseOrderCount}</span></div>
                                    <p></p>
                                </Col>
                                <Col>
                                    <Button variant="secondary" size="sm" onClick={handleShow}>
                                        View all Purchase orders 
                                    </Button>
                                </Col>
                            </Row>

                            <Modal show={supplierOnlyPOs} onHide={handleClose}>
                                <Modal.Header closeButton>
                                <Modal.Title>Purchase Orders of {supplier.supplier_name}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body className="d-flex justify-content-center bg-secondary-subtle">
                                    <table  className="table table-sm table-secondary">
                                        <thead>
                                            <tr>
                                                <th>Purchase order ID</th>
                                                <th>Total Order amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="table-group-divider">
                                            {officialFilteredPOs.map((po, index) => (
                                            <tr key={index} >
                                                <td>{po.purchaseOrder_id}</td>
                                                <td colSpan={2}>{po.total_order_amount}</td>
                                                <td>
                                                    <Link to={`/purchaseOrder/get/${po._id}`}>
                                                        <Button variant="secondary-subtle" size="sm" style={{ fontSize: "small"}}><i class="bi bi-file-earmark-text me-1"></i>View PO</Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </Modal.Body>
                                <Modal.Footer>
                                <Button variant="secondary" size="sm" onClick={handleClose}>
                                    Close
                                </Button>
                                </Modal.Footer>
                            </Modal>
                        </div>

                        <div>
                            <div className="mb-2 ">Payment pending Purchase orders out of them: <span className="fw-semibold fs-5">{paymentPendingPOs.length}</span></div>
                            
                            <div className="d-flex justify-content-center">
                                <table className="table table-bordered table-sm w-75">
                                    <thead>
                                        <tr>
                                            <th>Purchase Order ID</th>
                                            <th>Total Order Amount</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paymentPendingPOs.map((po, index) => (
                                            <tr key={index}>
                                                <td>{po.purchaseOrder_id}</td>
                                                <td>{po.total_order_amount}</td>
                                                <td>
                                                    <Link to={`/purchaseOrder/get/${po._id}`}>
                                                        <Button variant="secondary-subtle" size="sm" style={{ fontSize: "small"}}><i class="bi bi-file-earmark-text me-1"></i>View PO</Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div  className="mt-4">
                            <div className="">Purchase orders which performances has benn added:<span className="fw-semibold fs-5"> {performancePOcount} out of {officialPurchaseOrderCount}</span></div>
                            <div className="mb-4">Out of Performance added Purchase orders, </div>

                            <Row>
                                <Col>
                                    <div>
                                        <div class="card layout-blue-bg-half text-white">
                                            <div class="card-body text-center">
                                                <div className="fs-5"><i className="bi bi-speedometer"></i></div>
                                                <div className="fw-light fs-6">Average Deliver Rate</div>
                                                <p className="fw-semibold fs-3 mt-3">{finalAvgDeliveryRate} DAYS</p>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col>
                                    <div>
                                        <div class="card layout-blue" >
                                            <div class="card-body text-center">
                                                <div className="fs-5"><i className="bi bi-patch-check"></i></div>
                                                <div className="fw-light fs-6">Quality of Products</div>
                                                <p className="fw-semibold fs-3 mt-3">{avgQualityOfGoodsRate.toFixed(3)}%</p>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col>
                                    <div>
                                        <div class="card layout-blue-bg-half text-white">
                                            <div class="card-body text-center">
                                                <div className="fs-5"><i className="bi bi-stack-overflow"></i></div>
                                                <div className="fw-light fs-6">Percentage of Quantity Accuracy</div>
                                                <p className="fw-semibold fs-3 mt-3">{avgQuantityAccuracyRate.toFixed(3)}%</p>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            <div className="d-flex justify-content-center layout-blue"> 
                                <div class="card w-75 ">
                                    <div class="card-body text-center">
                                        <div className="fs-5"><i className="bi bi-stack-overflow"></i></div>
                                        <div className="fw-light fs-6">Max Days</div>
                                        <div className="text-secondary">Max days took the supplier to complete a purchase order</div>
                                        <p className="fw-semibold fs-3 mt-3">{maxDaysDifference} DAYS</p>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="quality-of-goods-rates fw-semibold">
                            <p className="fw-light fs-5">Quality fluctuations</p>
                            <div>
                                <Row>
                                {renderQualityOfGoodsRate()}
                                </Row>
                            </div>
                        </div>



                        <div className="mt-4 shadow p-3 rounded">
                            <div className="fw-light layout-blue fs-5 text-center"><i class="bi bi-person-raised-hand me-2"></i>Responsiveness of the supplier</div>
                            <div className="text-center fw-light mb-3">to the inquiries, orders and in negotiations</div>
                            <div className="d-flex justify-content-around ">
                                {Object.keys(performancePOsByCategory).map(category => (
                                    <div className="">
                                        <div key={category} className="text-center ">
                                            <p>{performancePOsByCategory[category]}<br></br>
                                            <span>{category}</span></p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>


                        <div className="mt-4 shadow p-4 rounded">
                            <h5 className="fw-light layout-blue text-center mb-3"><i class="bi bi-emoji-heart-eyes me-2"></i>Satisfaction in each purchase Order</h5>
                            <div className="d-flex justify-content-around">
                                {Object.keys(overallSatisfactionPOsByCategory).map(category => (
                                    <div key={category} className="text-center">
                                        <p>{overallSatisfactionPOsByCategory[category]}<br></br>
                                        <span>{category}</span></p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="d-flex justify-content-center ">
                            <div className="mt-4 text-center w-50 ">
                                <h3 className="fw-light layout-blue "><i className="bi bi-award"></i><br></br
                                    >Final Average Satisfaction</h3><hr></hr>
                                <div className="fw-semibold fs-3">{calculateFinalAvgSatisfaction().percentage}%</div>
                                <div className="fs-3 mb-4">{calculateFinalAvgSatisfaction().word}</div>
                            </div>
                        </div>
                        
                    </div>

                    <div className="mt-4 shadow p-3 rounded border border-dark">
                        <div className="fs-5 fw-light"><i className="bi bi-shield-lock me-2"></i>About sensitive details</div>
                        <Row>
                            <Col>
                                <div className="text-center">
                                    <h5 className="mt-2 fw-light ">
                                        <i className="bi bi-bank2 me-2"></i>
                                        <br></br> 
                                        <Button
                                        className="side-btn collapsed mt-3"
                                        onClick={() => setOpenBankDetails(!openBankDetails)}
                                        aria-controls="bank-details-collapse"
                                        aria-expanded={openBankDetails}
                                        variant="success">
                                        <span>{openBankDetails ? "Hide " : "View "}Bank details<i className="bi bi-bank"></i></span>
                                        </Button>
                                    </h5>

                                    <Collapse in={openBankDetails}>
                                        <div id="bank-details-collapse" className="w-75 p-3 rounded">
                                            <div>{supplier.bank_details.bank}</div>
                                            <div>{supplier.bank_details.acc_no}</div>
                                            <div>{supplier.bank_details.branch}</div>
                                            <div>{supplier.bank_details.bank}</div>
                                        </div>
                                    </Collapse>

                                    <div className="mt-4 fw-semibold">Payment Terms</div>
                                    <div>{supplier.bank_details.payment_terms}</div>
                                    <div className="mt-3 fw-semibold">Payment Method</div>
                                    <div>{supplier.bank_details.payment_method}</div>
                                </div>
                            </Col>
                            <Col>
                                <div className="text-center">
                                    <h5 className=" mt-2 mb-3 fw-light "><i class="ri-shake-hands-line me-2"></i></h5>
                                    <div className="fw-semibold">Contract starts on</div>
                                    <div>{formatDate(supplier.contract.start_date)}</div>
                                    <div className="mt-3 fw-semibold">Contract ends on</div>
                                    <div>{formatDate(supplier.contract.end_date)}</div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
                        

                <div className="mt-4">
                    <Link to={`/supplier/update/${supplier._id}`} >
                        <Button variant="outline-primary"  className="me-1 ">
                        <i className="bi bi-pen"></i> Edit Supplier
                        </Button>
                    </Link>
                    <Button variant="outline-danger"  className="me-1 " onClick={() => handleDeleteSupplier(supplier._id)} >
                        <i className="bi bi-trash"></i> Delete
                    </Button>
                    <Button variant="outline-info"   onClick={printPdfSupplier}>
                            <i className="bi bi-download me-2"></i> Download
                    </Button>
                </div>
                
            </div>
        </Layout>
    )
}

export default ViewSupplier;


{/* <div>
<table className="table table-bordered">
    <thead>
        <tr>
            <th>ID</th>
            <th>Total Order Amount</th>
            <th>Order Date</th>
            <th>Cost</th>
        </tr>
    </thead>
    <tbody>
        {officialFilteredPOs.map((po, index) => (
            <tr key={index}>
                <td>{po.purchaseOrder_id}</td>
                <td>{po.total_order_amount}</td>
                <td>{po.order_date}</td>
                <td>{po.costEffectiveness}</td>
            </tr>
        ))}
    </tbody>
</table>
</div> */}


//BAR CHARTS

// useEffect(() => {
//     let lineChart = null;

//     // Function to create or update the line chart
//     const createOrUpdateLineChart = () => {
//         // If a previous Chart instance exists, destroy it
//         if (lineChart) {
//             lineChart.destroy();
//         }

//         // Extracting data for the chart
//         const salesLabels = profit.map(profit => profit.Month);
//         const salesData = profit.map(profit => parseFloat(profit.Sales_income));
//         const expenseData = profit.map(profit => parseFloat(profit.Other_expenses + profit.Supplier_expenses + profit.Salaries));

//         // Create the line chart
//         lineChart = new Chart(document.getElementById('canvas-1'), {
//             type: 'line',
//             data: {
//                 labels: salesLabels,
//                 datasets: [
//                     {
//                         label: 'Sales',
//                         data: salesData,
//                         borderColor: 'rgba(75, 192, 192, 1)',
//                         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                         borderWidth: 1
//                     },
//                     {
//                         label: 'Expenses',
//                         data: expenseData,
//                         borderColor: 'rgba(255, 99, 132, 1)',
//                         backgroundColor: 'rgba(255, 99, 132, 0.2)',
//                         borderWidth: 1
//                     }
//                 ]
//             },
//             options: {
//                 responsive: true,
//                 scales: {
//                     y: {
//                         beginAtZero: true
//                     }
//                 }
//             }
//         });
//     };
//
//     createOrUpdateLineChart();
//
//     // Cleanup function to destroy the charts when the component unmounts
//     return () => {
//         if (lineChart) {
//             lineChart.destroy();
//         }
//       
//     };
// }, [otherExpenses, monthlyProfit]);