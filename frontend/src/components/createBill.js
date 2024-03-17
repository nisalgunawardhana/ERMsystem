import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import "./OtherFormdesign.css";
import { useNavigate } from "react-router-dom";

function CreateBill() {
  const [customer_id, setCustomerId] = useState("");
  const [billing_date, setBillingDate] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [itemPrice, setItemPrice] = useState(0);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discount, setDiscount] = useState(0); // New state to hold the discount

  const navigate = useNavigate();

  // Fetch item price when item code changes
  useEffect(() => {
    if (itemCode) {
      axios.get(`http://localhost:8080/item/price/${itemCode}`)
        .then(response => {
          setItemPrice(response.data.price);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      // Reset item price if item code is empty
      setItemPrice(0);
    }
  }, [itemCode]);

  // Fetch customer points when customer_id changes
   useEffect(() => {
    if (customer_id) {
      axios.get(`http://localhost:8080/customer/points/${customer_id}`)
        .then(response => {
          const points = response.data.points;
          const calculatedDiscount = points * 2;
          setDiscount(calculatedDiscount);
        })
        .catch(error => {
          console.error("Error fetching customer points:", error);
        });
    } else {
      setDiscount(0);
    }
  }, [customer_id]);

  // Calculate total amount whenever item quantity, price, or discount changes
  useEffect(() => {
    const calculateTotal = () => {
      const total = items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
      setTotalAmount(total - discount); // Apply discount to total amount
    };
    calculateTotal();
  }, [items, discount]);

  // Add item to the list
  const addItem = () => {
    const newItem = { code: itemCode, price: itemPrice, quantity: itemQuantity };
    setItems([...items, newItem]);
    setItemCode("");
    setItemQuantity(1);
  };

  // Remove item from the list
  const removeItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  // When submitting the form
  const sendData = (e) => {
    e.preventDefault();
    console.log("Submitting form...");
    
    // Convert items array to match the schema expected by the backend
    const convertedItems = items.map(item => ({
      product_id: item.code, // Assuming 'code' corresponds to 'product_id' in the backend
      quantity: item.quantity,
      unit_price: item.price // Assuming 'price' corresponds to 'unit_price' in the backend
    }));
  
    const newBill = {
      customer_id,
      billing_date,
      items: convertedItems, // Use converted items array
      total_amount: totalAmount // Assuming 'totalAmount' corresponds to 'total_amount' in the backend
    };
  
    console.log("New bill data:", newBill);
  
    axios
      .post("http://localhost:8080/bills/add", newBill)
      .then(() => {
        alert("Bill Added");
        setCustomerId("");
        setBillingDate("");
        setItems([]);
        setTotalAmount(0);
        navigate("/bill/");
      })
      .catch((err) => {
        console.error("Error while submitting form:", err);
        alert("Error occurred while submitting the form. Please try again later.");
      });
  };

  const handleBack = () => {
    navigate("/bill/");
  };

  return (
    <div className="custom-form-container">
      <Form onSubmit={sendData}>
        <h2 className="form-title">Bill details</h2>
        <br />

        <Form.Group className="mb-3" controlId="formBasicCustomerId">
          <Form.Label>Customer ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Customer ID"
            value={customer_id}
            onChange={(e) => setCustomerId(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicBillingDate">
          <Form.Label>Billing Date</Form.Label>
          <Form.Control
            type="date"
            placeholder="Enter Billing Date"
            value={billing_date}
            onChange={(e) => setBillingDate(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicItemCode">
          <Form.Label>Item Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Item Code"
            value={itemCode}
            onChange={(e) => setItemCode(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicItemPrice">
          <Form.Label>Item Price</Form.Label>
          <Form.Control
            type="text"
            placeholder="Item Price"
            value={itemPrice}
            readOnly
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicItemQuantity">
          <Form.Label>Item Quantity</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter Item Quantity"
            value={itemQuantity}
            onChange={(e) => setItemQuantity(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" onClick={addItem}>
          Add Item
        </Button>

        <br/><br/>

        <div>
          <h4>Items:</h4>
          <ul>
            {items.map((item, index) => (
              <li key={index}>
                {item.code} - ${item.price} x {item.quantity}{" "}
                <button type="button" onClick={() => removeItem(index)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>

        <p>Total Amount: ${totalAmount}</p>
        <p>Discount: ${discount}</p> {/* Display discount in the UI */}

        <div className="submit-btn-container">
          <div className="row mb-3">
            <div className="col">
              <div className="btn-group">
                <Button variant="primary" type="submit" className="me-5 rounded">
                  Submit
                </Button>
                <button className="btn btn-secondary rounded" onClick={handleBack}>
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default CreateBill;
