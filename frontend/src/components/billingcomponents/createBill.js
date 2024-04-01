import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateBill() {
  const [customer_id, setCustomerId] = useState("");
  const [billing_date, setBillingDate] = useState(new Date().toISOString().split('T')[0]);
  const [itemCode, setItemCode] = useState("");
  const [itemPrice, setItemPrice] = useState(0);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();
  const [discountRules, setDiscountRules] = useState([]);

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
        // Fetch discount rules when the component mounts
        axios.get('http://localhost:8080/discounts/')
            .then((response) => {
                // Assuming the response data is an array of discount rules
                setDiscountRules(response.data);
            })
            .catch((error) => {
                console.error("Error fetching discount rules:", error);
                // Handle error appropriately (e.g., show error message to the user)
            });
    }, []);

  const calculateApplicableDiscount = (discountRules, totalAmount) => {
    let applicableDiscount = 0;
    discountRules.forEach(rule => {
        if (totalAmount >= rule.rule_con) {
            // Accumulate the discount instead of overwriting
            applicableDiscount += (totalAmount * rule.Discount_presentage) / 100;
        }
    });
    return applicableDiscount;
};

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
      const loyaltyPointsDiscount = discount ;
      const applicableDiscount = calculateApplicableDiscount(discountRules, total);
      setTotalAmount(total - applicableDiscount - loyaltyPointsDiscount);
    };
    calculateTotal();
  }, [items, discount, discountRules]);


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
    
     <div className="container-fluid">
      <div className="row">
        <div className="col-md-6">
          <div className="card">
      <Form card-body border rounded p-4 style={{ margin: '30px' }} onSubmit={sendData}>
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
                {item.code} - Rs{item.price} x {item.quantity}{" "}
                <button type="button" onClick={() => removeItem(index)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>

        
        <p>Discount: Rs{calculateApplicableDiscount(discountRules, totalAmount).toFixed(2)}</p>
        <p>Loyalty points Discount: Rs{discount}</p>
        <h3>Total Amount: Rs{totalAmount}</h3>


        <div className="submit-btn-container">
          <div className="row mb-3">
            <div className="col">
              <div className="btn-group">
                <Button variant="btn btn-success" type="submit" className="me-5 rounded">
                  Submit
                </Button>
                <button className="btn btn-dark rounded" onClick={handleBack}>
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
        </div>
        <div className="col-md-6">
  <div className="card">
    <div className="card-body">
      <h3 className="card-title">Instructions:</h3>
      <p className="card-text">To create a new bill, please follow these steps:</p>
      <ol>
        <li>Enter the <strong>Customer ID</strong> of the customer making the purchase.</li>
        <li>Select the <strong>Billing Date</strong> from the calendar.</li>
        <li>Enter the <strong>Item Code</strong> of the product being purchased.</li>
        <li>The <strong>Item Price</strong> will be automatically fetched based on the entered Item Code.</li>
        <li>Enter the <strong>Item Quantity</strong> being purchased.</li>
        <li>Click on <strong>Add Item</strong> to add the item to the bill.</li>
        <li>Repeat steps 3-6 to add more items to the bill.</li>
        <li>The list of added items will be displayed under <strong>Items</strong>.</li>
        <li>The <strong>Discount</strong> and <strong>Loyalty Points Discount</strong> will be calculated automatically based on the items added and customer's loyalty points.</li>
        <li>The <strong>Total Amount</strong> will be calculated after applying discounts.</li>
        <li>Review the bill details.</li>
        <li>Click on <strong>Submit</strong> to add the bill.</li>
      </ol>
    </div>
  </div>
  <div className="card">
    <div className="card-body">
      <h3 className="card-title">Stuff Notification:</h3>
      <p className="card-text"> Upcoming events And other Notice:</p>
      <ol>
        
      </ol>
    </div>
</div>
</div>

      </div>
          <br></br>
    <br></br>
    </div>
  );
}



export default CreateBill;
