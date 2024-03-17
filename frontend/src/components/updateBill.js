import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function UpdateBill() {
  const { id } = useParams();
  const [customer_id, setCustomerId] = useState('');
  const [billing_date, setBillingDate] = useState('');
  const [items, setItems] = useState([]);
  const [total_amount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Fetch the bill details based on the ID
    axios.get(`http://localhost:8080/bills/${id}`)
      .then(response => {
        const { customer_id, billing_date, items, total_amount } = response.data;
        setCustomerId(customer_id);
        setBillingDate(formatDate(billing_date)); // Format billing date as per HTML input type="date"
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
        // Optionally, redirect the user to the bills page or show a success message
      })
      .catch(error => {
        console.error('Error updating bill:', error);
        // Handle error, show error message to the user
      });
  };

  const handleItemChange = (index, key, value) => {
    const updatedItems = [...items];
    updatedItems[index][key] = value;
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { product_id: '', quantity: 0, unit_price: 0 }]);
  };

  const removeItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  return (
    <div>
      <h2>Update Bill</h2>
      <Form>
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
              <Form.Control type="text" placeholder="Product ID" value={item.product_id} onChange={e => handleItemChange(index, 'product_id', e.target.value)} />
              <Form.Control type="number" placeholder="Quantity" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} />
              <Form.Control type="number" placeholder="Unit Price" value={item.unit_price} onChange={e => handleItemChange(index, 'unit_price', e.target.value)} />
              <Button variant="danger" onClick={() => removeItem(index)}>Remove Item</Button>
            </div>
          ))}
          <Button variant="success" onClick={addItem}>Add Item</Button>
        </Form.Group>
        <Form.Group controlId="totalAmount">
          <Form.Label>Total Amount</Form.Label>
          <Form.Control type="number" value={total_amount} onChange={e => setTotalAmount(e.target.value)} />
        </Form.Group>
        <Button variant="primary" onClick={handleUpdate}>Update Bill</Button>
      </Form>
    </div>
  );
}

export default UpdateBill;
