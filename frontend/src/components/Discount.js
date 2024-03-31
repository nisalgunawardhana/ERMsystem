import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Discounts() {
    const [discounts, setDiscounts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState(null); // State variable to store selected discount for update
    const [ruleName, setRuleName] = useState('');
    const [createDate, setCreateDate] = useState(new Date().toISOString().split('T')[0]);
    const [discountPercentage, setDiscountPercentage] = useState('');
    const [ruleCon, setRuleCon] = useState('');
    const [error, setError] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        axios.get('http://localhost:8080/discounts/')
            .then((res) => {
                setDiscounts(res.data);
            })
            .catch((err) => {
                alert(err.message);
            });
    }, []);
    useEffect(()=>{
        function getTotalAmount() {
            axios.get("http://localhost:8080/profit/get/bills/total")
                .then((res) => {
                    setTotalAmount(res.data.totalAmount);
                })
                .catch((err) => {
                    alert(err.message);
                })
        }

        getTotalAmount();
    },[])

    // Function to handle delete discount
    const handleDeleteDiscount = (id) => {
        axios.delete(`http://localhost:8080/discounts/delete/${id}`)
            .then(() => {
                // Remove the deleted discount from the state
                setDiscounts(discounts.filter(discount => discount._id !== id));
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

    // Function to open add modal
    const handleOpenAddModal = () => {
        setShowAddModal(true);
    };

    // Function to open update modal and set selected discount
    const handleOpenUpdateModal = (discount) => {
        setSelectedDiscount(discount);
        setRuleName(discount.Rule_name);
        setCreateDate(discount.Create_date);
        setDiscountPercentage(discount.Discount_presentage);
        setRuleCon(discount.rule_con);
        setShowUpdateModal(true);
    };

    // Function to handle form submission for both create and update
    const handleFormSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        try {
            // Reset error state
            setError('');

            // Validate form fields
            if (!ruleName || !createDate || !discountPercentage || !ruleCon) {
                setError('All fields are required.');
                return;
            }

            if (selectedDiscount) {
                // Update existing discount
                await axios.put(`http://localhost:8080/discounts/update/${selectedDiscount._id}`, {
                    Rule_name: ruleName,
                    Create_date: createDate,
                    Discount_presentage: discountPercentage,
                    rule_con: ruleCon
                });

                setShowUpdateModal(false);
            } else {
                // Create new discount
                await axios.post('http://localhost:8080/discounts/add', {
                    Rule_name: ruleName,
                    Create_date: createDate,
                    Discount_presentage: discountPercentage,
                    rule_con: ruleCon
                });

                setShowAddModal(false);
            }

            // Refresh discounts after create/update
            const res = await axios.get('http://localhost:8080/discounts/');
            setDiscounts(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred.');
        }
    };

    // Filter discounts based on search query
    const filteredDiscounts = discounts.filter(discount =>
        discount.Rule_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container">
            <h4>Manage Discount Rules</h4>

            <div className="row">
                <div className="col-md-4">
                <div className="card border-success mb-3">
                <div className="card-body">
                    <h5 className="card-title">Total Amount</h5>
                    <p className="card-text">Rs.{totalAmount.toFixed(2)}</p>
                    <Link to="/bill/CreateBill" className="btn btn-success">Create New Bill</Link>
                    
                </div>
            </div>
                </div>
                <div className="col-md-4">
                <div className="card mb-3" style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, color: 'white', borderRadius: '20px' }}>
                        <div className="card-body">
                            <h5 className="card-title">Manage Bills </h5>
                            <p className="card-text">Manage your Bills </p>
                            <Link to="/bill" className="btn btn-dark">Manage Bills</Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card mb-3" style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, color: 'white', borderRadius: '20px' }}>
                        <div className="card-body">
                            <h5 className="card-title"> Add Discount Rule</h5>
                            <p className="card-text">Create New Discount rules and Get more sales</p>
                            <button onClick={handleOpenAddModal} className="btn btn-dark">Add New Discount Rule</button>
                            <div className="progress-bar bg-light" role="progressbar" style={{ width: '75%' }} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                </div>
            </div>

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
            



            {/* Modal for adding new discount rule */}
            <div className="modal" style={{ display: showAddModal ? 'block' : 'none' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add New Discount Rule</h5>
                            <button type="button" className="close" style={{ position: 'absolute', right: '10px', top: '10px' }} onClick={() => setShowUpdateModal(false)}>
                                <span aria-hidden="true">&times;</span>
                             </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleFormSubmit}>
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
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Close</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for updating discount rule */}
            <div className="modal" style={{ display: showUpdateModal ? 'block' : 'none' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Update Discount Rule</h5>
                            <button type="button" className="close" style={{ position: 'absolute', right: '10px', top: '10px' }} onClick={() => setShowUpdateModal(false)}>
                                <span aria-hidden="true">&times;</span>
                             </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleFormSubmit}>
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
                                <button type="submit" className="btn btn-primary">Update Discount</button>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>Close</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Discounts table */}
            <table className="table">
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Rule Name</th>
                        <th>Create Date</th>
                        <th>Discount Percentage</th>
                        <th>Rule Condition</th>
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
                            <td>{discount.rule_con}</td>
                            <td>
                                <button className="btn btn-primary" onClick={() => handleOpenUpdateModal(discount)} style={{ margin: '0 5px' }}>Update</button>
                                <button onClick={() => handleDeleteDiscount(discount._id)} className="btn btn-danger ml-2" style={{ margin: '0 5px' }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
