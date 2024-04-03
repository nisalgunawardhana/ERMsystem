import React from "react";
import { Button, Form } from "react-bootstrap";

function RFQ(){
    return (
        <div className="container-xl">
            <h3>Requests For Quotations</h3><p class="text-body-secondary">RFQ</p>
            <Button variant="primary" size="lg">Create a RFQ</Button>
            <div>
            <Form >
                <Form.Group controlId="rfq_id">
                    <Form.Label>RFQ ID</Form.Label>
                    <Form.Control type="text" name="rfq_id" required />
                </Form.Group>

                <Form.Group controlId="introduction">
                    <Form.Label>Introduction</Form.Label>
                    <Form.Control type="text" name="introduction"  required />
                </Form.Group>

                <Form.Group controlId="quotation_items">
                    <Form.Label>Quotation Items</Form.Label>
                    {/* You can add inputs for quotation_items as needed */}
                </Form.Group>

                <Form.Group controlId="quality_standards">
                    <Form.Label>Quality Standards</Form.Label>
                    <Form.Control type="text" name="quality_standards"  required />
                </Form.Group>

                <Form.Group controlId="pricing_terms">
                    <Form.Label>Pricing Terms</Form.Label>
                    <Form.Control type="text" name="pricing_terms"  required />
                </Form.Group>

                <Form.Group controlId="delivery_requirements">
                    <Form.Label>Delivery Requirements</Form.Label>
                    <Form.Control type="text" name="delivery_requirements"  required />
                </Form.Group>

                <Form.Group controlId="payment_terms">
                    <Form.Label>Payment Terms</Form.Label>
                    <Form.Control type="text" name="payment_terms"  required />
                </Form.Group>

                <Form.Group controlId="deadline_for_rfq">
                    <Form.Label>Deadline for RFQ</Form.Label>
                    <Form.Control type="date" name="deadline_for_rfq" required />
                </Form.Group>

                <Form.Group controlId="submission_criteria">
                    <Form.Label>Submission Criteria</Form.Label>
                    <Form.Control type="text" name="submission_criteria"  required />
                </Form.Group>

                <Form.Group controlId="additional_instructions">
                    <Form.Label>Additional Instructions</Form.Label>
                    <Form.Control type="text" name="additional_instructions"  required />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
        </Form>
            </div>
        </div>
    );
}

export default RFQ;