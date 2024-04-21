import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link, Navigate } from "react-router-dom";
import axios from "axios";
import { Button, Row, Col, Collapse } from "react-bootstrap";
import { jsPDF } from "jspdf";
import './supplier.css';
import Layout from '../Layout';


function ViewSupplier() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [openBankDetails, setOpenBankDetails] = useState(false);

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
    }, [id]);


    //DELETE SUPPLIER
    const handleDeleteSupplier = () => {
        // Display confirmation dialog
        const confirmDelete = window.confirm("Are you sure you want to delete this supplier?");
        
        // Check if user confirmed
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
                    <div className="fw-light">Supplier Details</div>
                    <h1>Supplier {supplier.supplier_name}</h1>
                </div>

                <div> 
                    <Row>
                        <Col>   
                            <div>
                                <Link to="/supplier">
                                    <Button className="back-btn" variant="secondary" ><i className="bi bi-arrow-left me-2"></i><span>Back</span></Button>
                                </Link>
                                <Link to="/rfq"><Button id="up-btn" variant="success"><i className="bi bi-shop me-2"></i>Call new Suppliers?</Button></Link>
                            </div>


                            <div className="mb-5 container-fluid " >
                                
                                <div >
                                    <p className="fw-light fs-5">Supplier ID: {supplier.supplier_id}</p>
                                    <div className=" fs-5">{supplier.address}</div>
                                    <div className="  fs-5">{supplier.email}</div>
                                    <div className=" fs-5">Contact Number: {supplier.contact}</div>
                                </div>
                                

                                <div>
                                    <div className="fs-6 fw-light mt-4">Supplier seling products</div>
                                    <div className="fs-5">Product Types: {supplier.product_types.join(', ')}</div>
                                </div>
                            </div>

                            

                            <div className="p-4 rounded card-shadow-1" >
                                <h4 className="fw-light mb-4 layout-blue">More Details of <span className="fw-semibold">{supplier.supplier_name}</span></h4>

                                <div>
                                    <h5>Product Items</h5>
                                    <div className="d-flex bg-secondary mt-4 justify-content-center">
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

                                <div className="">
                                    <h5 className="mt-4">
                                        Bank details 
                                        <Button
                                        className="ms-3 side-btn collapsed"
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
                                    <div className="fw-semibold">Payment Method</div>
                                    <div>{supplier.bank_details.payment_method}</div>
                                </div>

                                <div>
                                    <h5 className=" my-3">Contract Details</h5>
                                    <div className="fw-semibold">Contract starts on</div>
                                    <div>{supplier.contract.start_date}</div>
                                    <div className="fw-semibold">Contract ends on</div>
                                    <div>{supplier.contract.end_date}</div>
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div className="p-3 rounded-2 mt-5 card-shadow-1 ">
                                <h3 className="mb-3 fw-light layout-blue">Supplier Performance</h3>


                            </div>
                        </Col>
                    </Row>
                </div>
                        

                <div className="mt-4">
                    <Link to={`/supplier/update/${supplier._id}`} >
                        <Button variant="primary" id="up-btn" className="me-1 ">
                        <i className="bi bi-pen"></i> Edit Supplier
                        </Button>
                    </Link>
                    <Button variant="danger" id="up-btn" className="me-1 " onClick={() => handleDeleteSupplier(supplier._id)} >
                        <i className="bi bi-trash"></i> Delete
                    </Button>
                    <Button variant="info" id="up-btn"  onClick={printPdfSupplier}>
                            <i className="bi bi-download me-2"></i> Download
                    </Button>
                    <Link to={`/supplier/add`} >
                        <Button variant="primary" id="up-btn" className="me-1 ">
                        <i className="bi bi-shop"></i> Add a Supplier
                        </Button>
                    </Link>
                </div>
                
            </div>
        </Layout>
    )
}

export default ViewSupplier;