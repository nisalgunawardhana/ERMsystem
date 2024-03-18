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
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

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
      setItemPrice(0);
    }
  }, [itemCode]);

  useEffect(() => {
    if (customer_id) {
      axios.get(`http://localhost:8080/customer/points/${customer_id}`)
        .then(response => {
          const points = response.data.points;
          const calculatedDiscount =  points / 100;
          setDiscount(calculatedDiscount);
        })
        .catch(error => {
          console.error("Error fetching customer points:", error);
        });
    } else {
      setDiscount(0);
    }
  }, [customer_id]);

  useEffect(() => {
    const calculateTotal = () => {
      const total = items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
      setTotalAmount(total - discount);
    };
    calculateTotal();
  }, [items, discount]);

  const addItem = () => {
    const newItem = { code: itemCode, price: itemPrice, quantity: itemQuantity };
    setItems([...items, newItem]);
    setItemCode("");
    setItemQuantity(1);
  };

  const removeItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const sendData = (e) => {
    e.preventDefault();
    console.log("Submitting form...");
    
    const convertedItems = items.map(item => ({
      product_id: item.code,
      quantity: item.quantity,
      unit_price: item.price
    }));

    const newBill = {
      customer_id,
      billing_date,
      items: convertedItems,
      total_amount: totalAmount
    };

    axios
      .post("http://localhost:8080/bills/add", newBill)
      .then((response) => {
        alert("Bill Added");
        setCustomerId("");
        setBillingDate("");
        setItems([]);
        setTotalAmount(0);
        handlePrint(newBill);
        navigate("/bill/");
      })
      .catch((err) => {
        console.error("Error while submitting form:", err);
        alert("Error occurred while submitting the form. Please try again later.");
      });
  };

  const handlePrint = (billToPrint) => {
    const printWindow = window.open("", "_blank", "width=600,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Bill</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            .bill-container {
              max-width: 800px;
              margin: 0 auto;
              border: 1px solid #ccc;
              padding: 20px;
              border-radius: 10px;
            }
            .bill-header {
              text-align: center;
              margin-bottom: 20px;
            }
            .bill-header h1 {
              margin: 0;
              color: #333;
            }
            .bill-details {
              margin-bottom: 20px;
            }
            .bill-details p {
              margin: 5px 0;
            }
            .bill-items {
              margin-bottom: 20px;
            }
            .bill-items table {
              width: 100%;
              border-collapse: collapse;
            }
            .bill-items th, .bill-items td {
              border: 1px solid #ccc;
              padding: 8px;
              text-align: left;
            }
            .bill-items th {
              background-color: #f2f2f2;
            }
            .bill-items td {
              background-color: #fff;
            }
            .bill-total {
              text-align: right;
              font-weight: bold;
            }
            .back-button {
              text-align: center;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="bill-container">
            <div class="bill-header">
              <h2>Diyana fashion Store</h2>
              <h1>Bill Details</h1>
              <p>No 01, DS senanayaka Mw, Anuradhapura <br> 071 09876743</p>
            </div>
            <div class="bill-details">
              <p><strong>Customer ID:</strong> ${billToPrint.customer_id}</p>
              <p><strong>Billing Date:</strong> ${billToPrint.billing_date}</p>
              <p><strong>Total Amount:</strong> ${billToPrint.total_amount}</p>
            </div>
            <div class="bill-items">
              <table>
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${billToPrint.items.map(item => `
                    <tr>
                      <td>${item.product_id}</td>
                      <td>${item.quantity}</td>
                      <td>${item.unit_price}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            <div class="bill-total">
              <p>Total: ${billToPrint.total_amount}</p>
            </div>
            <div class="back-button">
              <button onclick="window.open('', '_self').close();">Back</button>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
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
        <p>Discount: ${discount}</p>

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
