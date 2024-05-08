import {React, useState, useEffect} from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import Layout from '../Layout';
import './supplier.css';

function UpdateSupplier() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [supplier_id, setSupplierID] = useState("");
    const [supplier_name, setSupplierName] = useState("");
    const [address, setAddress] = useState("");
    const [contact, setContactNumber] = useState(0);
    const [email, setEmail] = useState("");
    const [product_types, setproduct_types] = useState([]);
    const [selectedProductTypes, setSelectedProductTypes] = useState([]);
    const [newProductItem, setNewProductItem] = useState("");
    const [newProductUnitPrice, setNewProductUnitPrice] = useState(0);
    const [product_items, setproduct_items] = useState([]);
    const [bank_details, setBankDetails] = useState({ bank: "", branch: "", acc_no: 0, payment_method: "", payment_terms: "" });
    const [sup_performance, setSupPerformance] = useState({ quality: "", delivery_time: "" });
    const [contract, setContract] = useState({ start_date: "", end_date: "" });


    useEffect(() => {
        axios.get(`http://localhost:8080/supplier/get/${id}`)
            .then(response => {
                const { supplier_id, supplier_name, address, contact, email, product_types, product_items, bank_details, sup_performance, contract } = response.data.supplier;
                
                // Update state with fetched data
                setSupplierID(supplier_id);
                setSupplierName(supplier_name);
                setAddress(address);
                setContactNumber(contact);
                setEmail(email);
                setproduct_types(product_types);
                setSelectedProductTypes(product_types);
                setproduct_items(product_items);
                setBankDetails(bank_details);
                setSupPerformance(sup_performance);
                setContract(contract);
            })
            .catch(error => {
                console.error('Error fetching supplier details:', error);
            });
    }, [id]);

    const handleUpdate = () => {
        const updatedSupplier = {
            supplier_name,
            address,
            contact,
            email,
            product_types: selectedProductTypes,
            product_items,
            bank_details,
            sup_performance,
            contract
        };
    
        axios.put(`http://localhost:8080/supplier/update/${id}`, updatedSupplier)
          .then(response => {
            console.log('Supplier updated successfully:', response.data);
            alert("Supplier successfully updated");
            navigate("/dashboard/logistics/supplier/");
        })
        .catch(error => {
            console.error('Error updating supplier:', error);
            // Log the error response from the server
            if (error.response) {
                console.error('Server response:', error.response.data);
            }
        });
    }

    //CHECKBOXES PRODUCT TYPES
    const handleProductCheckBox = (event) => {
        const { value, checked } = event.target;
        setSelectedProductTypes(prevState => {
            if (checked) {
                return [...prevState, value];
            } else {
                return prevState.filter(type => type !== value);
            }
        });
    };

    //HANDLE PRODUCT ITEMS CHANGE
    const handleItemChange = (index, key, value) => {
        const updatedProductItems = [...product_items];
        updatedProductItems[index][key] = value;
        setproduct_items(updatedProductItems);
      };

    //HANDLE REMOVE PRODUCTS
    const handleRemoveProduct = (index) => {
        const updatedProductItems = [...product_items];
        updatedProductItems.splice(index, 1);
        setproduct_items(updatedProductItems);
    };

    //ADD NEW PRODUCTS 
    const handleAddNewProduct = () => {
        const newProduct = { product_name: newProductItem, unit_price: newProductUnitPrice };
        setproduct_items([...product_items, newProduct]);
        setNewProductItem("");
        setNewProductUnitPrice(0);
    };

    

    return(
        <Layout>
            <div className="bg">

                <div className="container-fluid ">
                    <h2 >Update Supplier</h2><h4 className="mt-2 mb-3">{supplier_name}</h4>

                    <div className="container custom-container-supplier card-shadow-1">
                        <Form className="mt-4">
                        <Form.Group controlId="supplierID" >
                            <Form.Label>Supplier ID</Form.Label>
                            <Form.Control type="text" name="supplier_id" readOnly 
                            value={supplier_id}
                            />
                        </Form.Group>

                        <Form.Group controlId="supplierName" className="mt-3">
                            <Form.Label>Supplier Name</Form.Label>
                            <Form.Control type="text" name="supplier_name" readOnly
                            value={supplier_name}
                            />
                        </Form.Group>

                        <Form.Group controlId="supplierAddress" className="mt-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" name="supplier_address" required
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="supplierContact" className="mt-3">
                            <Form.Label>Contact Number</Form.Label>
                            <Form.Control type="text" name="supplier_contact"  required
                            value={contact}
                            onChange={(e) => {
                                setContactNumber(e.target.value);
                            }}/>
                        </Form.Group>

                        <Form.Group controlId="supplierEmail" className="mt-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type="text" name="supplier_email" required
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}/>
                        </Form.Group>




                        <div className="mt-3">
                            <h6>Product Types</h6>
                            <Row>
                                {['Mens-Shirts', 'Mens-Trousers', 'Mens T-Shirt', 'Suits', 'Shorts', 'Jackets and Blazers', 'Traditional wear',
                            'Tops and Blouses', 'Dresses','Party dresses', 'Skirts', 'Trousers and Denims', 'Office wear',
                            'Children wear', 'Toys', 'Accessories', ...product_types].map((type, index) => (
                                    <Col className="mt-2" key={index} xs={6} sm={4} md={3} lg={3}>
                                        <Form.Check
                                            inline
                                            label={<p className="mt-2">{type}</p>}
                                            name="product_types"
                                            type="checkbox"
                                            id={`inline-checkbox-${index}`}
                                            value={type}
                                            checked={selectedProductTypes.includes(type)}
                                            onChange={handleProductCheckBox}
                                            />
                                    </Col>
                                ))}
                            </Row>
                            <p className="mt-2 mb-4"><em>Previuosly selected Product types are shown above</em></p>
                        </div>




                        <div className="mt-2 w-75">
                            <h6>Bank Details</h6>
                            <Form.Group controlId="bank">
                                <Form.Label>Bank</Form.Label>
                                <Form.Control type="text" name="bank" 
                                value={bank_details.bank}
                                onChange={(e) => {
                                    setBankDetails({ ...bank_details, bank: e.target.value})
                                }} />
                            </Form.Group>

                            <Form.Group controlId="branch" className="mt-2">
                                <Form.Label>branch</Form.Label>
                                <Form.Control type="text" name="branch" 
                                value={bank_details.branch} 
                                onChange={(e) => {
                                    setBankDetails({ ...bank_details, branch: e.target.value})
                                }} />
                            </Form.Group>

                            <Form.Group controlId="accountNo" className="mt-2">
                                <Form.Label>Account No</Form.Label>
                                <Form.Control type="number" name="account_no" 
                                value={bank_details.acc_no} 
                                onChange={(e) => {
                                    setBankDetails({ ...bank_details, acc_no: e.target.value})
                                }}/>
                            </Form.Group>

                            <Form.Group controlId="paymentMethod" className="mt-2">
                                <Form.Label>Payment Method</Form.Label>
                                <Form.Control type="text" name="payment_method"
                                value={bank_details.payment_method}
                                onChange={(e) => {
                                    setBankDetails({ ...bank_details, payment_method: e.target.value})
                                }}/>
                            </Form.Group>

                            <Form.Group controlId="paymentTerms" className="mt-2">
                                <Form.Label>Payment Terms</Form.Label>
                                <Form.Control type="text" name="payment_terms" 
                                value={bank_details.payment_terms}
                                onChange={(e) => {
                                    setBankDetails({ ...bank_details, payment_terms: e.target.value})
                                }}/>
                            </Form.Group>
                        </div>

                        <div>
                            <h6 className="my-3">Add new product</h6>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>New Product Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="new_product_name"
                                            value={newProductItem}
                                            onChange={(e) => setNewProductItem(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>New Unit Price</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="new_unit_price"
                                            value={newProductUnitPrice}
                                            onChange={(e) => setNewProductUnitPrice(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="my-3">
                                <Button className="me-2" variant="outline-success" onClick={handleAddNewProduct}>Add New Product</Button>
                            </div>
                        </div>



                        {/* <div>
                            <h6 className="mt-4 ">Existing Product Details</h6>
                            <Form.Group controlId="items">
                                {product_items.map((item, index) => (
                                    <Row className="my-2" key={index}>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Product ID"
                                                value={item.product_name}
                                                onChange={(e) => handleItemChange(index, 'product_name', e.target.value)}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="number"
                                                placeholder="Unit Price"
                                                value={item.unit_price}
                                                onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                                            />
                                        </Col>
                                        <Col>
                                            <Button variant="danger" onClick={() => handleRemoveProduct(index)}>Remove Item</Button>
                                        </Col>
                                    </Row>
                                ))}
                            </Form.Group>
                        </div> */}


                        <div>
                            <h6 className="mt-4">Existing Product Details</h6>
                            <Form.Group controlId="items">
                                {product_items.map((item, index) => (
                                    <Row className="my-2" key={index}>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Product Name"
                                                value={item.product_name}
                                                onChange={(e) => handleItemChange(index, 'product_name', e.target.value)}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="number"
                                                placeholder="Unit Price"
                                                value={item.unit_price}
                                                onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                                            />
                                        </Col>
                                        <Col>
                                            <Button variant="danger" onClick={() => handleRemoveProduct(index)}>Remove Item</Button>
                                        </Col>
                                    </Row>
                                ))}
                                {newProductItem && (
                                    <Row className="my-2">
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Product Name"
                                                value={newProductItem}
                                                onChange={(e) => setNewProductItem(e.target.value)}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="number"
                                                placeholder="Unit Price"
                                                value={newProductUnitPrice}
                                                onChange={(e) => setNewProductUnitPrice(e.target.value)}
                                            />
                                        </Col>
                                        <Col>
                                            <Button variant="danger" onClick={() => setNewProductItem("")}>Remove Item</Button>
                                        </Col>
                                    </Row>
                                )}
                            </Form.Group>
                        </div>




                        <div className="mt-5">
                            <h6>Average Supplier Performance</h6>
                            <Row>
                                <Col>
                                <Form.Group controlId="supplierQuality">
                                    <Form.Label> Average Quality</Form.Label>
                                    <Form.Control type="text" name="supplier_quality" 
                                    value={sup_performance.quality}  
                                    onChange={(e) => {
                                        setSupPerformance({ ...sup_performance, quality: e.target.value})
                                    }}/>
                                </Form.Group>
                                </Col>
                            
                                <Col>
                                <Form.Group controlId="supplierDelivery">
                                    <Form.Label>Average Delivery time</Form.Label>
                                    <Form.Control type="text" name="supplier_delivery" 
                                    value={sup_performance.delivery_time}  
                                    onChange={(e) => {
                                        setSupPerformance({ ...sup_performance, delivery_time: e.target.value})
                                    }}/>
                                </Form.Group>
                                </Col>
                            </Row>
                        </div>

                        <div >
                            <h6 className="mt-5">Contract Details</h6>
                            <Row>
                                <Col>
                                <Form.Group >
                                    <Form.Label>Contract Start Date</Form.Label>
                                    <Form.Control type="text" name="contract_start_date"   
                                    value={contract.start_date} 
                                    onChange={(e) => {
                                        setContract({ ...contract, start_date: e.target.value})
                                    }}/>
                                </Form.Group>
                                </Col>
                                <Col>
                                <Form.Group >
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control type="text" name="contract_end_date" 
                                    value={contract.end_date} 
                                    onChange={(e) => {
                                        setContract({ ...contract, end_date: e.target.value})
                                    }}/>
                                </Form.Group>
                                </Col>
                            </Row>
                        </div>
                        

                        <div className="d-flex mt-5 mb-4 justify-content-center">
                            <Row>
                                <Col xs={8}>
                                    <Button className="px-4 luxery-yellow" variant="secondary" onClick={handleUpdate} type="submit">Update {supplier_name}</Button>
                                </Col>
                                <Col xs={1} >
                                    <Link to={`/dashboard/logistics/supplier/`}><Button className=" me-3" variant="secondary">Back</Button></Link>
                                </Col>
                            </Row>
                        </div>
                        
                        </Form>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default UpdateSupplier;