import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Row, Col, Popover, OverlayTrigger} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

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

 const popover = (
  <Popover id="popover-basic">
    <Popover.Body>No '@' sign found. Please enter a valid email address.</Popover.Body>
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
        <div className="container-fluid mb-6 bg ps-5">
            <p className="fw-light ms-3 mb-4">Supplier Management
            <h2>Add new Supplier</h2></p>

            <div className="mt-4 container custom-container-supplier" style={{width:"65%"}}>
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
                        <Form.Control type="text" name="supplier_contact"  required
                        value={contact}  
                        onChange={(e) => {
                            setContactNumber(e.target.value);
                        }}/>
                    </Form.Group>

                    <Form.Group className="mt-2" controlId="supplierEmail">
                        <Form.Label htmlFor="emailInput">Email Address</Form.Label>
                        <OverlayTrigger
                            trigger="focus"
                            placement="right"
                            show={showPopover}
                            overlay={popover}
                        >
                            <Form.Control
                            type="email"
                            name="supplier_email"
                            required
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setShowPopover(!e.target.value.includes('@'));
                            }}
                            />
                        </OverlayTrigger>
                    </Form.Group>


                    <div className="mt-2">
                        <h6>Bank Details</h6>
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

                        <p className="mt-3"><b>Payment Details</b></p>
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
                    <h6>Product Types</h6>
                    <Row>
                        {['Mens-Shirts', 'Mens-Trousers', 'Mens T-Shirt', 'Suits', 'Shorts', 'Jackets and Blazers', 'Traditional wear',
                        'Tops and Blouses', 'Dresses','Party dresses', 'Skirts', 'Trousers and Denims', 'Office wear',
                        'Children wear', 'Toys', 'Accessories'].map((type, index) => (
                            <Col className="mt-2" key={index} xs={6} sm={4} md={3} lg={3}>
                                <Form.Check
                                    inline
                                    label={type}
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
                        <h6 className="mt-4">Product Details</h6>
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
                        <h6 className="mt-2">Average Supplier Performance</h6>
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
                        <h6 className="mt-4">Contract Details</h6>
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
                    

                    <div className="d-flex flex-column align-items-center justify-content-center">
                    <Button className="mt-5 col-md-4 text-white" variant="white" type="submit" style={{backgroundColor:"#F99417"}}>Add new Supplier</Button>
                    </div>
                
                </Form>
            </div>
            
        </div>
    )
}

export default AddSupplier;