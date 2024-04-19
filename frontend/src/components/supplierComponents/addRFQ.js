import React, { useState } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function AddRFQss() {

    const navigate = useNavigate();

    const [rfq_id, setRFQID] = useState("");
    const [introduction, setIntroduction] = useState("");
    const [quotation_items, setquotation_items] = useState([]);
    const [rfq_items, setrfq_items] = useState("");
    const [rfq_quantity, setrfq_quantity] = useState(0);
    const [quality_standards, setquality_standards] = useState("");
    const [pricing_terms, setpricing_terms] = useState("");
    const [delivery_requirements, setdelivery_requirements] = useState("");
    const [payment_terms, setpayment_terms] = useState("");
    const [deadline_for_rfq, setdeadline_for_rfq] = useState("");
    const [submission_criteria, setsubmission_criteria] = useState("");
    const [additional_instructions, setadditional_instructions] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        const quotation_items_list = quotation_items.map(item => ({
            qitem: item.rfq_item,
            quantity: item.quantity
        }));
        
        const newRFQ = {
            rfq_id,
            introduction,
            quotation_items: quotation_items_list,
            quality_standards,
            pricing_terms,
            delivery_requirements,
            payment_terms,
            deadline_for_rfq,
            submission_criteria,
            additional_instructions
        }

        console.log(newRFQ);

        axios.post("http://localhost:8080/rfq/add", newRFQ).then(() => {
            alert("RFQ is Added");
            navigate("/rfq");
        }).catch((err) => {
            alert(err)
        })
    }

    //ADD QUOTATION ITEMS
    const addItemRFQ = () => {
        const newItem = {
            rfq_item: rfq_items,
            quantity: rfq_quantity
        };
      
        setquotation_items([...quotation_items, newItem]); // Corrected here
        setrfq_items("");
        setrfq_quantity(0);
    }

    return( 
        <div>
            <div className="bg">
                <h3 className="ms-5">Create a Request For Quotation (RFQ)</h3>
                <div className="my-5 w-75 p-5 container custom-container-rfq" >
                <Form onSubmit={handleSubmit}>

                    <Form.Group controlId="rfqId">
                        <Form.Label>RFQ ID:</Form.Label>
                        <Form.Control type="text" value={rfq_id} required
                        onChange={(e) => 
                            setRFQID(e.target.value)
                        }/>
                    </Form.Group>

                    <Form.Group controlId="introduction" className="mt-2">
                        <Form.Label>Introduction:<br></br>
                            <small className="text-muted "><i>Brief overview of the project or requirements for which quotations are being sought. This should include relevant background information and context</i></small>
                        </Form.Label>
                        <Form.Control as="textarea" rows={3}  required
                        value={introduction}
                        onChange={(e) => 
                            setIntroduction(e.target.value)
                        }/>
                    </Form.Group>

                    <Form.Group controlId="quotation_items" className="mt-2">
                        <Form.Label>Quotation Items<br></br><small>Detailed list of the items or services for which quotations are being requested</small></Form.Label>
                        <Row>
                            <Col>
                                <Form.Label>Items</Form.Label>
                                <Form.Control className="mb-3" type="text" name="rfq_id" required
                                onChange={(e)=> {
                                    setrfq_items(e.target.value);
                                }} />
                            </Col>
                            <Col>
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control className="mb-3" type="Number" name="rfq_id" required
                                onChange={(e)=> {
                                    setrfq_quantity(e.target.value);
                                }} />
                            </Col>
                            <Col>
                                <Button variant="success" className="w-25 mt-4 py-2" onClick={addItemRFQ}>Add</Button>
                            </Col>
                        </Row>
                    </Form.Group>

                    <div>
                        <p></p>
                        {quotation_items.map((item, index) => (
                            <div key={index}>
                                <p>Item: {item.rfq_item}, Quantity: {item.quantity}</p>
                            </div>
                        ))}
                    </div>

                    <Form.Group controlId="quality_standards">
                        <Form.Label>Quality Standards</Form.Label>
                        <small className="text-muted ">
                            <em> Specify the quality standards and what should not contain when measuring quality.</em>
                        </small>
                        <Form.Control className="mb-3" as="textarea" rows={3} name="quality_standards"  required 
                        onChange={(e)=> {
                            setquality_standards(e.target.value);
                        }}/>
                    </Form.Group>

                    <p className="fw-semibold">Pricing Terms and Payment terms and conditions</p>
                    <Form.Group controlId="pricing_terms">
                        <Form.Label>Pricing Terms<br></br><small className="text-muted "><i>Outline the pricing terms, including unit prices, bulk discounts (if applicable), and any other pricing considerations.</i></small></Form.Label>
                        <Form.Control className="mb-3" as="textarea" rows={2} name="pricing_terms"  required 
                        onChange={(e)=> {
                            setpricing_terms(e.target.value);
                        }}/>
                    </Form.Group>

                    <Form.Group controlId="payment_terms">
                        <Form.Label>Payment Terms<br></br><small className="text-muted "><i>Outline the terms of payment, including payment methods, due dates, and any applicable payment terms or conditions.</i></small></Form.Label>
                        <Form.Control className="mb-3" as="textarea" rows={2} name="payment_terms"  required 
                        onChange={(e)=> {
                            setpayment_terms(e.target.value);
                        }}/>
                    </Form.Group>

                    <Form.Group controlId="delivery_requirements">
                        <Form.Label>Delivery Requirements</Form.Label>
                        <small className="text-muted"><i> Specify the required delivery timeline, shipping methods, and any special delivery instructions or requirements</i></small>
                        <Form.Control className="mb-3" as="textarea" rows={2} name="delivery_requirements"  required 
                        onChange={(e)=> {
                            setdelivery_requirements(e.target.value);
                        }}/>
                    </Form.Group>

                    <Form.Group controlId="deadline_for_rfq">
                        <Form.Label>Deadline for RFQ</Form.Label>
                        <Form.Control className="mb-3" type="date" name="deadline_for_rfq" required 
                        onChange={(e)=> {
                            setdeadline_for_rfq(e.target.value);
                        }}/>
                    </Form.Group>

                    <Form.Group controlId="submission_criteria">
                        <Form.Label>Submission Criteria</Form.Label>
                        <Form.Control className="mb-3" as="textarea" rows={2} name="submission_criteria"  required 
                        onChange={(e)=> {
                            setsubmission_criteria(e.target.value);
                        }}/>
                    </Form.Group>

                    <Form.Group controlId="additional_instructions">
                        <Form.Label>Additional Instructions that suppliers need to know</Form.Label>
                        <Form.Control className="mb-3"  as="textarea" rows={3} name="additional_instructions"   
                        onChange={(e)=> {
                            setadditional_instructions(e.target.value);
                        }}/>
                    </Form.Group>

                    <div className=" text-center">
                        <Link to="/rfq">
                            <Button variant="secondary mx-2">Back</Button>
                        </Link>
                        <Button variant="success" className = "fs-6 w-50" type="submit">Create a Request</Button>
                    </div> 
                </Form>
                </div>
            </div>
        </div>
    )
}

export default AddRFQss;