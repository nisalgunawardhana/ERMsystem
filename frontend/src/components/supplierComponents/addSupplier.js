import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Row, Col, Popover, OverlayTrigger} from 'react-bootstrap';
import { useNavigate , Link} from "react-router-dom";
import Layout from '../Layout';
import './supplier.css';

function AddSupplier() {

    const navigate = useNavigate();

    const [supplier_id, setSupplierID] = useState("");
    const [supplier_name, setSupplierName] = useState("");
    const [address, setAddress] = useState("");
    const [contact, setContactNumber] = useState(0);
    const [email, setEmail] = useState("");
    const [selectedProductTypes, setSelectedProductTypes] = useState([]);
    const [product_item_name, setProductItemName] = useState("");
    const [product_unit_price, setProductUnitPrice] = useState(0);
    const [ProductList, setProductList] = useState([]);
    const [bank_details, setBankDetails] = useState({ bank: "", branch: "", acc_no: 0, payment_method: "", payment_terms: "" });
    const [sup_performance, setSupPerformance] = useState({ quality: "", delivery_time: "" });
    const [contract, setContract] = useState({ start_date: null, end_date: null });

    const [showPopover, setShowPopover] = useState(false);
    const [showContactPopover, setShowContactPopover] = useState(false);
    const [showEmailPopover, setShowEmailPopover] = useState(false);


    function sendData(e) {
        e.preventDefault();

        const product_items_list = ProductList.map(item => ({
            product_name: item.name,
            unit_price: item.price
        }));

        const NewSupplier ={
            supplier_id,
            supplier_name,
            address,
            contact,
            email,
            product_types: selectedProductTypes,
            product_items: product_items_list,
            bank_details,
            sup_performance,
            contract
        }

        console.log(NewSupplier);

        axios.post("http://localhost:8080/supplier/add", NewSupplier).then(() => {
            alert("sUPPLIER IS Added");
            navigate("/supplier");
        }).catch((err) => {
            alert(err)
        })
    }

    //Validate contact
    const validateContactNumber = () => {
        if (contact.length !== 10) {
            setShowContactPopover(true);
        } else {
            setShowContactPopover(false);
        }
    };

    //Validate email
    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setShowEmailPopover(true);
        } else {
            setShowEmailPopover(false);
        }
    };

    const contactPopover = (
        <Popover id="contact-popover">
            <Popover.Body>Contact number must have 10 digits.</Popover.Body>
        </Popover>
    );

    const emailPopover = (
        <Popover id="email-popover">
            <Popover.Body>Please enter a @ valid email address.</Popover.Body>
        </Popover>
    );

    //Product Check boxes
    const handleProductCheckBox = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedProductTypes([...selectedProductTypes, value]);
        } else {
            setSelectedProductTypes(selectedProductTypes.filter(type => type !== value));
        }
    };

    //REMOVE LAST PRODUCT
    const handleRemoveProduct = () => {
        if (ProductList.length > 0) {
            const updatedList = [...ProductList];
            updatedList.pop(); 
            setProductList(updatedList);
        }
    };

    //ADD NEW PRODUCTS 
    const handleAddProduct = () => {
        const newProduct = { name: product_item_name, price: product_unit_price };
        setProductList([...ProductList, newProduct]);
        setProductItemName("");
        setProductUnitPrice(0);
    };


    return(
        <Layout>
        <div className="container-fluid mb-6 bg ps-5">
            <p className="fw-light ms-3 mb-4">Supplier Management
            <h2>Add new Supplier</h2></p>

            <div className="mt-4 container custom-container-supplier card-shadow-1" >
                <Form onSubmit={sendData}>
                    <Form.Group controlId="supplierID">
                        <Form.Label>Supplier ID</Form.Label>
                        <Form.Control type="text" name="supplier_id"  required 
                        value={supplier_id} 
                        onChange={(e) => {
                            setSupplierID(e.target.value);
                        }} />
                    </Form.Group>

                    <Form.Group className="mt-2" controlId="supplierName">
                        <Form.Label>Supplier Name</Form.Label>
                        <Form.Control type="text" name="supplier_name" required
                        value={supplier_name}  
                        onChange={(e) => {
                            setSupplierName(e.target.value);
                        }} />
                    </Form.Group>

                    <Form.Group className="mt-2" controlId="supplierAddress">
                        <Form.Label>Address</Form.Label>
                        <Form.Control type="text" name="supplier_address" required
                        value={address}  
                        onChange={(e) => {
                            setAddress(e.target.value);
                        }}/>
                    </Form.Group>

                    <Form.Group className="mt-2" controlId="supplierContact">
                        <Form.Label>Contact Number</Form.Label>
                        <OverlayTrigger
                            trigger="focus"
                            placement="top"
                            show={showContactPopover}
                            overlay={contactPopover}
                        >
                            <Form.Control
                                type="text"
                                name="supplier_contact"
                                required
                                value={contact}
                                onBlur={validateContactNumber}
                                onChange={(e) => {
                                    setContactNumber(e.target.value);
                                }}
                            />
                        </OverlayTrigger>
                    </Form.Group>

                    {/* <Form.Group className="mt-2" controlId="supplierEmail">
                        <Form.Label htmlFor="emailInput">Email Address</Form.Label>
                        <OverlayTrigger
                            trigger="focus"
                            placement="right"
                            show={showEmailPopover}
                            overlay={emailPopover}
                        >
                            <Form.Control
                            type="email"
                            name="supplier_email"
                            required
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setShowEmailPopover(!e.target.value.includes('@'));
                            }}
                            />
                        </OverlayTrigger>
                    </Form.Group> */}

                    <Form.Group className="mt-2" controlId="supplierEmail">
                        <Form.Label htmlFor="emailInput">Email Address</Form.Label>
                        <OverlayTrigger
                            trigger="focus"
                            placement="top"
                            show={showEmailPopover}
                            overlay={emailPopover}
                        >
                            <Form.Control
                                type="email"
                                name="supplier_email"
                                required
                                value={email}
                                onBlur={validateEmail}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                            />
                        </OverlayTrigger>
                    </Form.Group>


                    <div className="mt-4">
                        <h6><i className="bi bi-bank2 me-2"></i>Bank Details</h6>
                        <Form.Group controlId="bank">
                            <Form.Label>Bank</Form.Label>
                            <Form.Control type="text" name="bank" required
                            value={bank_details.bank}
                            onChange={(e) => {
                                setBankDetails({ ...bank_details, bank: e.target.value})
                            }} />
                        </Form.Group>

                        <Form.Group className="mt-2" controlId="branch">
                            <Form.Label>branch</Form.Label>
                            <Form.Control type="text" name="branch" required
                            value={bank_details.branch} 
                            onChange={(e) => {
                                setBankDetails({ ...bank_details, branch: e.target.value})
                            }} />
                        </Form.Group>

                        <Form.Group className="mt-2" controlId="accountNo">
                            <Form.Label>Account No</Form.Label>
                            <Form.Control type="number" name="account_no" required
                            value={bank_details.acc_no} 
                            onChange={(e) => {
                                setBankDetails({ ...bank_details, acc_no: e.target.value})
                            }}/>
                        </Form.Group>

                        <p className="mt-4"><i className="bi bi-currency-exchange me-2"></i>Payment Details</p>
                        <Form.Group  controlId="paymentMethod">
                            <Form.Label>Payment Method</Form.Label>
                            <Form.Control type="text" name="payment_method"
                            value={bank_details.payment_method}
                            onChange={(e) => {
                                setBankDetails({ ...bank_details, payment_method: e.target.value})
                            }}/>
                        </Form.Group>

                        <Form.Group className="mt-2" controlId="paymentTerms">
                            <Form.Label>Payment Terms</Form.Label>
                            <Form.Control type="text" name="payment_terms" 
                            value={bank_details.payment_terms}
                            onChange={(e) => {
                                setBankDetails({ ...bank_details, payment_terms: e.target.value})
                            }}/>
                        </Form.Group>
                    </div>

                    <div className="mt-4">
                        <h6><i className="bi bi-magic me-2"></i>Product Types</h6>
                        <Row>
                        {['Mens-Shirts', 'Mens-Trousers', 'Mens T-Shirt', 'Suits', 'Shorts', 'Jackets and Blazers', 'Traditional wear',
                        'Tops and Blouses', 'Dresses','Party dresses', 'Skirts', 'Trousers and Denims', 'Office wear',
                        'Children wear', 'Toys', 'Accessories'].map((type, index) => (
                            <Col className="mt-2" key={index} xs={6} sm={4} md={3} lg={3}>
                                <Form.Check
                                    inline
                                    label={<p className="mt-2">{type}</p>}
                                    name="product_types"
                                    type="checkbox"
                                    id={`inline-checkbox-${index}`}
                                    value={type}
                                    onChange={handleProductCheckBox}
                                />
                            </Col>
                            ))}
                        </Row>
                    </div>

                    <div>
                        <h6 className="mt-4"><i className="bi bi-text-left me-2"></i>Product Details</h6>
                        <Row>
                            <Col>
                            <Form.Group >
                                <Form.Label>Product Name</Form.Label>
                                <Form.Control type="text" name="product_name" 
                                value={product_item_name} 
                                onChange={(e) => {
                                    setProductItemName(e.target.value);
                                }}/>
                            </Form.Group>
                            </Col>
                            <Col>
                            <Form.Group >
                                <Form.Label>Unit Price</Form.Label>
                                <Form.Control type="text" name="unit_price"
                                value={product_unit_price} 
                                onChange={(e) => {
                                    setProductUnitPrice(e.target.value);
                                }}/>
                            </Form.Group>
                            </Col>
                            <div className="my-3 d-flex justify-content-end">
                                <Button className="me-2" variant="outline-success" onClick={handleAddProduct}>Add product</Button>
                                <Button variant="outline-danger" onClick={handleRemoveProduct}>Remove last product</Button>
                            </div>
                        </Row>

                        <div className="container">
                            <div className=" text-center">
                            <Row className="my-3 ">
                                <h5>Added Products</h5>
                                <div className="row justify-content-center">
                                    <table className="col-md-8">
                                        {ProductList.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.name}:</td>
                                                <td>Rs.{item.price}</td> 
                                            </tr>
                                        ))}
                                    </table>
                                </div>
                            </Row>
                            </div>
                        </div>
                        
                    </div>
                
                    <div>
                        <h6 className="mt-2"><i className="bi bi-percent me-2 "></i>Average Supplier Performance</h6>
                        <Row>
                            <Col>
                            <Form.Group controlId="supplierQuality">
                                <Form.Label> Average Quality</Form.Label>
                                <Form.Control type="text" name="supplier_quality" required
                                value={sup_performance.quality}  
                                onChange={(e) => {
                                    setSupPerformance({ ...sup_performance, quality: e.target.value})
                                }}/>
                            </Form.Group>
                            </Col>
                        
                            <Col>
                            <Form.Group controlId="supplierDelivery">
                                <Form.Label>Average Delivery time</Form.Label>
                                <Form.Control type="text" name="supplier_delivery" required
                                value={sup_performance.delivery_time}  
                                onChange={(e) => {
                                    setSupPerformance({ ...sup_performance, delivery_time: e.target.value})
                                }}/>
                            </Form.Group>
                            </Col>
                        </Row>
                    </div>

                    <div >
                        <h6 className="mt-4"><i className="bi bi-person-check me-2"></i>Contract Details</h6>
                        <Row>
                            <Col>
                            <Form.Group >
                                <Form.Label>Contract Start Date</Form.Label>
                                <Form.Control type="date" name="contract_start_date"  required 
                                value={contract.start_date} 
                                onChange={(e) => {
                                    setContract({ ...contract, start_date: e.target.value})
                                }}/>
                            </Form.Group>
                            </Col>
                            <Col>
                            <Form.Group >
                                <Form.Label>End Date</Form.Label>
                                <Form.Control type="date" name="contract_end_date" required
                                value={contract.end_date} 
                                onChange={(e) => {
                                    setContract({ ...contract, end_date: e.target.value})
                                }}/>
                            </Form.Group>
                            </Col>
                        </Row>
                    </div>
                    

                    <div className="mt-5 d-flex  justify-content-center">
                        <Row >
                            <Col xs={4} >
                                <Link to="/supplier/" className="d-flex align-items-center">
                                    <Button className="back-btn" variant="secondary" style={{ height: '40px', fontSize: '16px' }}>
                                        <i className="bi bi-arrow-left me-2"></i>
                                        <span>Back</span>
                                    </Button>
                                </Link>
                            </Col>
                            <Col>
                                <Button className="text-white " variant="dark" type="submit" >Add new Supplier</Button>
                            </Col>
                            
                        </Row>
                    </div>    
                </Form>
            </div>
            
        </div>
    </Layout>
    )
}

export default AddSupplier;