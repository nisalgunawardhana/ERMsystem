import React, { useState, useEffect } from "react";
import { Button, Table, Collapse, Row, Col, Form, Card, Container, InputGroup} from "react-bootstrap"; 
import { Link } from "react-router-dom";
import axios from "axios";
import Layout from '../Layout';
import './supplier.css';
// import '../finance.css';

function RFQ() {

    const [rfqs, setRFQs] = useState([]);
    const [selectedRFQ, setSelectedRFQ] = useState(null); 
    const [filterDate, setFilterDate] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedRFQs, setSelectedRFQs] = useState([]);

    useEffect(() => {
        function getRFQs() {
            axios.get("http://localhost:8080/rfq/").then((res) => {
                setRFQs(res.data);
            }).catch((err) => {
                alert(err.message);
            });
        }
        getRFQs();
    }, []);

    //HANDLE PREVIEW BUTTON
    const handlePreview = (rfq) => {
        setSelectedRFQ(selectedRFQ === rfq ? null : rfq); 
    };

    //HANDLE INTRO SEARCH
    const handleSearch = () => {
        const results = rfqs.filter(rfq =>
            rfq.introduction.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
    };

    //SEARCH BAR - DATE
    const filteredRFQs = rfqs.filter(rfq => {
        if (!filterDate) return true; // If filter date is empty, return all RFQs
        
        const selectedDate = new Date(filterDate).toISOString().slice(0, 10); // Convert both filterDate and deadline_for_rfq to the same format for comparison
        const deadlineDate = new Date(rfq.deadline_for_rfq).toISOString().slice(0, 10);

        return deadlineDate === selectedDate;
    });

    //DEADLINE CLOSE RFQS
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);
    const rfqsWithinThreeDays = rfqs.filter(rfq => {
        const deadlineDate = new Date(rfq.deadline_for_rfq);
        return deadlineDate <= threeDaysFromNow;
    });

    // DELETE SELECTED RFQS
    const deleteSelectedRFQs = () => {
        if (selectedRFQs.length === 0) {
            alert("Please select RFQs to delete.");
            return;
        }
        if (window.confirm("Are you sure you want to delete the selected RFQs?")) {
            // Assuming there is a delete API endpoint
            axios.delete("http://localhost:8080/rfq/", { data: { rfqIds: selectedRFQs.map(rfq => rfq.id) } })
                .then(() => {
                    setRFQs(rfqs.filter(rfq => !selectedRFQs.includes(rfq))); // Remove the selected RFQs from the array
                    setSelectedRFQs([]); // Clear the selected RFQs
                }).catch((err) => {
                    alert(err.message);
                });
        }
    };


    //GENERATE RFQ REPORT
    const handleRFQReport = () => {
        const printWindow = window.open("", "_blank", "width=600,height=600");
        printWindow.document.write(`
            <html>
                <head>
                    <title>Request for Quotations</title>
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
                    <h1>RFQ Report</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Introduction</th>
                                <th>Quality Standards</th>
                                <th colspan="2">Quotation Items</th>
                                <th>Delivery Requirements</th> 
                                <th>Pricing terms</th>
                                <th>Payment Terms</th>
                                <th>Submittion Crieria</th>
                                <th>Deadline for RFQ</th>
                                <th>Additional Instructions</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            ${rfqs.map(rfq => `
                                <tr>
                                    <td>${rfq.introduction}</td>
                                    <td>${rfq.quality_standards}</td>
                                    <td>
                                        <p>Item name</p>
                                        ${rfq.quotation_items.map(item => `
                                            <li>${item.qitem}</li>
                                        `).join('')}
                                    </td>
                                    <td>
                                        <p>Quantity</p>
                                        ${rfq.quotation_items.map(item => `
                                            <li>${item.quantity}</li>
                                        `).join('')}
                                    </td>
                                    <td>${rfq.delivery_requirements}</td>
                                    <td>${rfq.pricing_terms}</td>
                                    <td>${rfq.payment_terms}</td>
                                    <td>${rfq.submission_criteria}</td>
                                    <td>${rfq.deadline_for_rfq}</td>
                                    <td>${rfq.additional_instructions}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div >
                    <button onclick="window.close()" class="btn btn-secondary">Back</button>
                </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };


    //PRINT EACH RFQ
    const printRFQ = (rfq) => {
        const printWindow = window.open("", "_blank", "width=600,height=600");
        printWindow.document.write(`
            <html>
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>RFQ Details</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                    }

                    .container {
                        max-width: 800px;
                        margin: 0 auto;
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
                </style>
                </head>

                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Request for Quotation (RFQ)</h1>
                        </div>

                        <div class="section">
                            <h2 class="section-title">RFQ ID</h2>
                            <p>${rfq.rfq_id}</p>
                        </div>

                        <div class="section">
                            <h2 class="section-title">Introduction</h2>
                            <p>${rfq.introduction}</p>
                        </div>

                        <div class="section">
                            <h2 class="section-title">Quality Standards</h2>
                            <p>${rfq.quality_standards}</p>
                        </div>

                        <div class="section">
                            <h2 class="section-title">Quotation Items</h2>
                            <div class="item">
                                <p class="item-title">Item</p>
                                ${rfq.quotation_items.map(item => `<p>${item.qitem}</p>`).join('')}
                            </div>
                            <div class="item">
                                <p class="item-title">Quantity</p>
                                ${rfq.quotation_items.map(item => `<p>${item.quantity}</p>`).join('')}
                            </div>
                        </div>

                        <div class="section">
                            <h2 class="section-title">Delivery Requirements</h2>
                            <p>${rfq.delivery_requirements}</p>
                        </div>

                        <div class="section">
                            <h2 class="section-title">Pricing Terms</h2>
                            <p>${rfq.pricing_terms}</p>
                        </div>

                        <div class="section">
                            <h2 class="section-title">Payment Terms</h2>
                            <p>${rfq.payment_terms}</p>
                        </div>

                        <div class="section">
                            <h2 class="section-title">Submission Criteria</h2>
                            <p>${rfq.submission_criteria}</p>
                        </div>

                        <div class="section">
                            <h2 class="section-title">Deadline for RFQ</h2>
                            <p>${new Date(rfq.deadline_for_rfq).toLocaleDateString()}</p>
                        </div>

                        <div class="section">
                            <h2 class="section-title">Additional Instructions</h2>
                            <p>${rfq.additional_instructions}</p>
                        </div>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <Layout>
        <Container fluid className="mb-4 bg" >
            <Row>
                <Col sm={8}>
                    <div >
                        <h2><span><h6 className="fw-light">RFQ management</h6></span>Requests For Quotations
                            <small className="text-body-secondary"> RFQ</small>
                        </h2>
                        <Link to="/rfq/add">
                            <Button className="fs-6 my-3 text-white" id="up-btn" variant="success"><i class="bi bi-send-plus-fill me-1"></i>Create an Request For Quotations</Button>
                        </Link>
                    </div>

                    <div className="ms-2 w-100">
                        <div className="w-50">
                            <Form.Group className="mt-3" controlId="formFilterDate">
                                <Form.Label>Filter by Date</Form.Label>
                                <Form.Control type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
                            </Form.Group>
                        </div>

                        <Table className="mt-4 rounded " striped bordered hover>
                            <thead>
                                <tr>
                                    <th>RFQ ID</th>
                                    <th>Introduction</th>
                                    <th>Quality Standards</th>
                                    <th>Pricing terms</th>
                                    <th>Delivery Requirements</th>
                                    {/* <th>Payment Terms</th> */}
                                    <th>Deadline for RFQ</th>
                                    {/* <th>Submittion Crieria</th>
                                    <th>Additional Instructions</th> */}
                                    <th>Actions</th> 
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRFQs.map((rfq, index) => (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <td>{rfq.rfq_id}</td>
                                            <td>{rfq.introduction}</td>
                                            <td>{rfq.quality_standards}</td>
                                            <td>{rfq.pricing_terms}</td>
                                            <td>{rfq.delivery_requirements}</td>
                                            <td>{new Date(rfq.deadline_for_rfq).toLocaleDateString()}</td>
                                            <td>
                                                <Button className="fs-6" variant="secondary" onClick={() => handlePreview(rfq)}>
                                                    {selectedRFQs.includes(rfq) ? "Hide RFQ" : "Preview RFQ"}
                                                </Button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="11">
                                                <Collapse in={selectedRFQ === rfq}>
                                                    <div style={{ position: 'relative' }}>
                                                        <p className="fw-semibold fs-5">RFQ ID : {rfq.rfq_id}</p>
                                                        <p className="fw-semibold">Introduction to the RFQ<br></br><span className="fw-light">{rfq.introduction}</span></p>
                                                        <p className="fw-semibold">Quality standerds for the items reqested: <span className="fw-light">{rfq.quality_standards}</span></p>
                                                        <p className="fw-semibold">Pricing Terms and Payment Terms</p>
                                                        <p >Pricing Terms: <span className="fw-normal">{rfq.pricing_terms}</span><br></br>Payment Terms: <span className="fw-normal">{rfq.payment_terms}</span></p>
                                                        <p className="fw-medium">Delivery Requirements when delivering: <span className="fw-normal">{rfq.delivery_requirements}</span></p>
                                                        <p className="fw-semibold">Submission Criteria when calling quotations: <span className="fw-normal">{rfq.submission_criteria}</span> </p>
                                                        <p className="fw-semibold">Items to be in the Quotation from suppliers</p>
                                                        <Row className="ms-5">
                                                            <Col xs={2}> Item</Col>
                                                            <Col xs={2}> Quantity</Col>
                                                        </Row>
                                                        <ul className="ms-5">
                                                            {rfq.quotation_items.map((item, index) => (
                                                                <li key={index}>
                                                                    <Row className="fw-light">
                                                                        <Col xs={2}>{item.qitem}</Col>
                                                                        <Col xs={2}>{item.quantity}</Col>
                                                                    </Row>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        <p><b>DEADLINE: <span className="text-success">{new Date(rfq.deadline_for_rfq).toLocaleDateString()}</span></b></p>
                                                        <p >Addtional Instructions for the suppliers<br></br><span className="fw-light">{rfq.additional_instructions}</span></p>
                                                        <div style={{ position: 'relative' }}>
                                                            <p className="text-info mb-4" style={{ position: 'absolute', bottom: '20px', right: '0' }}>
                                                                <small>Print RFQ before distributing</small>
                                                            </p>
                                                            {/* <Row>
                                                                <Col> */}
                                                                    <Button 
                                                                        variant="info" 
                                                                        className="text-light" 
                                                                        style={{ position: 'absolute', bottom: '0', right: '0' }} 
                                                                        onClick={() => printRFQ(rfq)}>Print RFQ
                                                                        <i className=" bi bi-printer ps-1"></i>
                                                                    </Button>
                                                                {/* </Col>
                                                                <Col>
                                                                    <Button>
                                                                    </Button>
                                                                </Col>
                                                            </Row> */}
                                                            
                                                        </div>
                                                    </div>
                                                </Collapse>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Col>
                <Col sm={4}>
                    <div className="mt-2 ms-2" style={{ marginTop: "0.5rem" }}>
                        <Row className="g-4">
                            <Col  xs={13}>
                                <div className="card">
                                    <div className="card-statistic-3 p-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="col-8">
                                                <div className="text-secondary">Expiring Requests</div>
                                                <div className="fs-5 fw-semibold">RFQs with Deadline Within 3 Days</div>
                                                <div className="d-flex align-items-center mb-3 mt-4">
                                                    <ul>
                                                        {rfqsWithinThreeDays.map((rfq, index) => (
                                                            <li key={index}><i className="bi bi-layers-fill layout-blue me-2"></i>{rfq.rfq_id}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                            <i className="bi bi-cash-coin h1"></i>
                                        </div>
                                        <div className="progress mt-1 " data-height="8" style={{ height: '8px' }}>
                                            <div className="progress-bar " role="progressbar" data-width="25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{ width: '75%', backgroundColor:"red" }}></div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col  xs={13}>
                                <div className="card">
                                    <div className="card-statistic-3 p-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="">
                                                <p className="text-secondary">Find Quotations by entering any word term in the introduction</p>
                                                <Row>
                                                    <Col>
                                                        <Form.Control 
                                                        type="text" 
                                                        placeholder="Enter search term" 
                                                        value={searchTerm} 
                                                        onChange={(e) => setSearchTerm(e.target.value)} 
                                                        />
                                                    </Col>
                                                    <Col xs={3}>
                                                        <Button variant="light " className="search-button" onClick={handleSearch}><i className="bi bi-search search-icon"></i></Button>
                                                    </Col>
                                                </Row>

                                                <div className="mt-3 mb-2">RFQ IDs related to that term,</div>
                                                <ul>
                                                    {searchResults.map((rfq, index) => (
                                                        <li key={index}><i className="bi bi-layers-fill layout-blue me-2"></i>{rfq.rfq_id}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="progress mt-1 " data-height="8" style={{ height: '8px' }}>
                                            <div className="progress-bar orange" role="progressbar" data-width="25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{ width: '75%'}}></div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col  xs={13}>
                                <div class="card">
                                    <div class="card-statistic-3 p-4">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <div class="col-8">
                                                <h3 class="d-flex align-items-center mb-5">
                                                    RFQ Report
                                                </h3>
                                                <Button variant="dark" className="mt-5 mb-2" onClick={handleRFQReport}>Generate Report</Button>
                                            </div>
                                            <i className="bi bi-cash-coin h1"></i>
                                        </div>
                                        <div class="progress mt-1 " data-height="8" style={{ height: '8px' }}>
                                            <div class="progress-bar orange" role="progressbar" data-width="25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{ width: '75%'}}></div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col  xs={13}>
                                <Card className="card shadow">
                                <Card.Header as="h6">happy?</Card.Header>
                                <Card.Body>
                                    <Card.Title>cdcdcd</Card.Title>
                                    <Card.Text>
                                    With support bla bla bla
                                    </Card.Text>
                                    <Button variant="primary">Go somewhere</Button>
                                </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>

            {/* <div class="card">
                <div class="card-statistic-3 p-4">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="col-8">
                            <h2 class="d-flex align-items-center mb-5">
                                Rs.
                            </h2>
                            <h5 class="card-title" style={{ marginTop: '25px' }}>Total Profit</h5>
                        </div>
                        <i className="bi bi-cash-coin h1"></i>
                    </div>
                    <div class="progress mt-1 " data-height="8" style={{ height: '8px' }}>
                        <div class="progress-bar " role="progressbar" data-width="25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{ width: '25%', backgroundColor:"red" }}></div>
                    </div>
                </div>
            </div> */}
        </Container>
    </Layout>
    );
}

export default RFQ;



// <div>
//                                 {rfqs.map((rfq, index) => (
//                                     <React.Fragment key={index}>
//                                         <Collapse in={selectedRFQ === rfq}>
//                                             <div>
//                                                 <p>Details of RFQ: {rfq.rfq_id}</p>
//                                                 <p>Introduction </p>
//                                                 <p className="ms-2">{rfq.introduction}</p>
//                                                 <p><b>Quality Standerds of stock </b>{rfq.quality_standards}</p>
//                                                 <p>All about payment process and terms and conditions</p>
//                                                 <p className="ms-2">Pricing terms{rfq.pricing_terms}</p>
//                                                 <p className="ms-2">Payment terms{rfq.payment_terms}</p>
//                                                 <p>Delivery requirements: {rfq.delivery_requirements}</p>
//                                                 <p>Submittion criteria we hope them to submit: {rfq.submission_criteria}</p>
//                                                 <p>Quotation items in the Request:</p>
//                                                 <ul>
//                                                     {rfq.quotation_items.map((item, index) => (
//                                                         <li key={index}>
//                                                             Item: {item.qitem}, Quantity: {item.quantity}
//                                                         </li>
//                                                     ))}
//                                                 </ul>
//                                                 <p className="fs-6 text-danger"><b>Deadline: {rfq.deadline_for_rfq}</b></p>
//                                             </div>
//                                         </Collapse>
//                                     </React.Fragment>
//                                 ))}
//                             </div>


//CARDS
{/* <div className="ms-4 mt-4">
                    <Row xs={1} sm={2} md={2} lg={4} className="g-4">
                        {[1, 2, 3, 4].map((index) => (
                            <Col key={index}>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Card {index}</Card.Title>
                                        <Card.Text>
                                            Some details about Card {index}.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div> */}

//COLLAPSE FROM OUTSIDE

{/* <Collapse in={selectedRFQ !== null}>
                <div>
                    {selectedRFQ && (
                        <Container fluid>
                            <Row className="justify-content-center">
                                <Col sm={8}>
                                    <Card className="mt-4">
                                        <Card.Header as="h4" className="text-center">{selectedRFQ.rfq_id}</Card.Header>
                                        <Card.Body>
                                            <Card.Text><strong>Introduction:</strong> {selectedRFQ.introduction}</Card.Text>
                                            <Card.Text><strong>Quality Standards:</strong> {selectedRFQ.quality_standards}</Card.Text>
                                            <Card.Text><strong>Delivery Requirements:</strong> {selectedRFQ.delivery_requirements}</Card.Text>
                                            <Card.Text><strong>Pricing Terms:</strong> {selectedRFQ.pricing_terms}</Card.Text>
                                            <Card.Text><strong>Payment Terms:</strong> {selectedRFQ.payment_terms}</Card.Text>
                                            <Card.Text><strong>Submission Criteria:</strong> {selectedRFQ.submission_criteria}</Card.Text>
                                            <Card.Text><strong>Deadline for RFQ:</strong> {new Date(selectedRFQ.deadline_for_rfq).toLocaleDateString()}</Card.Text>
                                            <Card.Text><strong>Additional Instructions:</strong> {selectedRFQ.additional_instructions}</Card.Text>
                                            <Button variant="success" onClick={() => printRFQ(selectedRFQ)}>Print RFQ</Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Container>
                    )}
                </div>
            </Collapse> */}