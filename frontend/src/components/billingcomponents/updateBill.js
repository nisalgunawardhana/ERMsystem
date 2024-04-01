import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";

function UpdateBill() {
  const { id } = useParams();
  const [customer_id, setCustomerId] = useState('');
  const [billing_date, setBillingDate] = useState('');
  const [items, setItems] = useState([]);
  const [total_amount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Fetching data for id:', id);
    axios.get(`http://localhost:8080/bills/${id}`)
      .then(response => {
        console.log('Response:', response.data);
        const { customer_id, billing_date, items, total_amount } = response.data;
        setCustomerId(customer_id);
        setBillingDate(formatDate(billing_date));
        setItems(items);
        setTotalAmount(total_amount);
      })
      .catch(error => {
        console.error('Error fetching bill details:', error);
      });
  }, [id]);

  // Function to format date to YYYY-MM-DD format
  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    const year = dateObject.getFullYear();
    let month = dateObject.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    let day = dateObject.getDate();
    if (day < 10) {
      day = '0' + day;
    }
    return `${year}-${month}-${day}`;
  };

  const handleUpdate = () => {
    // Construct the updated bill object
    const updatedBill = {
      customer_id,
      billing_date,
      items,
      total_amount
    };

    // Send a PUT request to update the bill
    axios.put(`http://localhost:8080/bills/update/${id}`, updatedBill)
      .then(response => {
        console.log('Bill updated successfully:', response.data);
        navigate("/bill/");
      })
      .catch(error => {
        console.error('Error updating bill:', error);
      });
  };

  const handleItemChange = (index, key, value) => {
    const updatedItems = [...items];
    updatedItems[index][key] = value;
    setItems(updatedItems);

    const newTotalAmount = updatedItems.reduce((total, item) => total + (item.quantity * item.unit_price), 0);
    setTotalAmount(newTotalAmount);
  };

  const addItem = () => {
    setItems([...items, { product_id: '', quantity: 0, unit_price: 0 }]);
  };

  const removeItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);

    const newTotalAmount = updatedItems.reduce((total, item) => total + (item.quantity * item.unit_price), 0);
    setTotalAmount(newTotalAmount);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <h2 style={{ textAlign: 'center' }} >Update Bill</h2>
            <Form card-body border rounded p-4 style={{ margin: '30px' }}>
              <Form.Group controlId="customerId">
                <Form.Label>Customer ID</Form.Label>
                <Form.Control type="text" value={customer_id} readOnly />
              </Form.Group>
              <Form.Group controlId="billingDate">
                <Form.Label>Billing Date</Form.Label>
                <Form.Control type="date" value={billing_date} readOnly />
              </Form.Group>
              <Form.Group controlId="items">
                <Form.Label>Items</Form.Label>
                {items.map((item, index) => (
                  <div key={index}>
                    <Form.Control type="text" placeholder="Product ID" value={item.product_id} readOnly />
                    <Form.Control type="number" placeholder="Quantity" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} />
                    <Form.Control type="number" placeholder="Unit Price" value={item.unit_price} onChange={e => handleItemChange(index, 'unit_price', e.target.value)} readOnly />
                    <Button variant="danger" onClick={() => removeItem(index)}>Remove Item</Button>
                  </div>
                ))}

              </Form.Group>
              <Form.Group controlId="totalAmount">
                <Form.Label>Total Amount</Form.Label>
                <Form.Control type="number" value={total_amount} onChange={e => setTotalAmount(e.target.value)} />
              </Form.Group>
              <br></br>
              <Button variant="primary" onClick={handleUpdate}>Update Bill</Button>
            </Form>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Instructions:</h3>
              <p className="card-text">To create a new bill, please follow these steps:</p>
              <ol>
                <li><strong>Customer ID:</strong> Verify the customer's identification.</li>
                <li><strong>Billing Date:</strong> Select the updated billing date from the calendar.</li>
                <li><strong>Items:</strong> Review and modify the details of each item as necessary.</li>
                <li><strong>Total Amount:</strong> Ensure the total amount accurately reflects the updated bill.</li>
                <li>Click on the <strong>"Update Bill"</strong> button to save the changes.</li>
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

export default UpdateBill;
