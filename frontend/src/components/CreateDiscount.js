import React, { useState } from 'react';
import axios from 'axios';

export default function AddDiscountModal({ show, handleClose }) {
    const [ruleName, setRuleName] = useState('');
    const [createDate, setCreateDate] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState('');
    const [ruleCon, setRuleCon] = useState('');
    const [error, setError] = useState('');

    const handleAddDiscount = (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        // Reset error state
        setError('');

        // Validate form fields
        if (!ruleName || !createDate || !discountPercentage || !ruleCon) {
            setError('All fields are required.');
            return;
        }

        // Make API call to add discount rule
        axios.post('http://localhost:8080/discounts/add', {
            Rule_name: ruleName,
            Create_date: createDate,
            Discount_percentage: discountPercentage,
            rule_con: ruleCon
        })
        .then(() => {
            // Reload the page after adding the discount rule
            window.location.reload();
        })
        .catch((err) => {
            setError(err.response.data.error || 'An error occurred.');
        });
    };

    return (
        <div className="modal" style={{ display: show ? 'block' : 'none' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add New Discount Rule</h5>
                        <button type="button" className="close" onClick={handleClose}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleAddDiscount}>
                            {error && <div className="alert alert-danger" role="alert">{error}</div>}
                            <div className="form-group">
                                <label>Rule Name</label>
                                <input type="text" className="form-control" value={ruleName} onChange={(e) => setRuleName(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Create Date</label>
                                <input type="date" className="form-control" value={createDate} onChange={(e) => setCreateDate(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Discount Percentage</label>
                                <input type="number" className="form-control" value={discountPercentage} onChange={(e) => setDiscountPercentage(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Rule Con</label>
                                <input type="number" className="form-control" value={ruleCon} onChange={(e) => setRuleCon(e.target.value)} />
                            </div>
                            <button type="submit" className="btn btn-primary">Add Discount</button>
                            <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
