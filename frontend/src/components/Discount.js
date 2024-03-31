import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddDiscountModal from './CreateDiscount';

export default function Discounts() {
    const [discounts, setDiscounts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8080/discounts/')
            .then((res) => {
                setDiscounts(res.data);
            })
            .catch((err) => {
                alert(err.message);
            });
    }, []);

    // Function to handle delete discount
    const handleDeleteDiscount = (id) => {
        axios.delete(`http://localhost:8080/discounts/delete/${id}`)
            .then(() => {
                // Reload the page after deletion
                window.location.reload();
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    // Function to handle search
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
    };

    // Filter discounts based on search query
    const filteredDiscounts = discounts.filter(discount =>
        discount.Rule_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container">
            <h4>Manage Discount Rules</h4>

            {/* Search input */}
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by Rule Name"
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>

            {/* Button to open modal for adding new discount */}
            <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>Add New Discount Rule</button>

            {/* Modal for adding new discount rule */}
            <AddDiscountModal show={showModal} handleClose={() => setShowModal(false)} />

            {/* Discounts table */}
            <table className="table">
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Rule Name</th>
                        <th>Create Date</th>
                        <th>Discount Percentage</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDiscounts.map((discount, index) => (
                        <tr key={discount._id}>
                            <td>{index + 1}</td>
                            <td>{discount.Rule_name}</td>
                            <td>{discount.Create_date}</td>
                            <td>{discount.Discount_presentage}</td>
                            <td>
                                <button className="btn btn-primary">Update</button>
                                <button onClick={() => handleDeleteDiscount(discount._id)} className="btn btn-danger ml-2">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


