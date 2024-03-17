import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BillPreview = ({ billId }) => {
  const [bill, setBill] = useState(null);

  useEffect(() => {
    fetchBill();
  }, []);

  const fetchBill = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/bills/${billId}`); // Adjust URL according to your backend routes
      setBill(response.data);
    } catch (error) {
      console.error('Error fetching bill:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/bills/delete/${billId}`); // Adjust URL according to your backend routes
      // Handle deletion success
    } catch (error) {
      console.error('Error deleting bill:', error);
    }
  };

  const handlePrint = () => {
    // Implement print functionality using window.print() or any other method you prefer
  };

  const handleUpdate = () => {
    // Implement update functionality
  };

  return (
    <div>
      {bill && (
        <div>
          <h2>Bill Preview</h2>
          {/* Display bill details */}
          <p>Customer ID: {bill.customer_id}</p>
          <p>Billing Date: {bill.billing_date}</p>
          {/* Iterate over bill items and display them */}
          <ul>
            {bill.items.map((item, index) => (
              <li key={index}>
                Product ID: {item.product_id}, Quantity: {item.quantity}, Unit Price: {item.unit_price}
              </li>
            ))}
          </ul>
          <p>Total Amount: {bill.total_amount}</p>
          {/* Buttons for actions */}
          <button onClick={handleDelete}>Delete</button>
          <button onClick={handlePrint}>Print</button>
          <button onClick={handleUpdate}>Update</button>
        </div>
      )}
    </div>
  );
};

export default BillPreview;
