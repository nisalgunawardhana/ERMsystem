import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Discount.css';
import Layout from '../Layout';
import { Toaster, toast } from 'react-hot-toast';



export default function Discounts() {
    const [discounts, setDiscounts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [ruleName, setRuleName] = useState('');
    const [createDate, setCreateDate] = useState(new Date().toISOString().split('T')[0]);
    const [discountPercentage, setDiscountPercentage] = useState('');
    const [ruleCon, setRuleCon] = useState('');
    const [error, setError] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [selectAll, setSelectAll] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);



    useEffect(() => {
        // Fetch discounts
        axios.get('http://localhost:8080/discounts/')
            .then((res) => {
                setDiscounts(res.data);
            })
            .catch((err) => {
                setError(err.message);
            });

        // Fetch total amount
        axios.get("http://localhost:8080/profit/get/bills/total")
            .then((res) => {
                setTotalAmount(res.data.totalAmount);
            })
            .catch((err) => {
                setError(err.message);
            });
    }, []);

    // Function to handle delete discount
    const handleDeleteDiscount = async (id) => {
        setDeleteItemId(id);
        setShowDeleteConfirmation(true);
    };

    const handleConfirmDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/discounts/delete/${id}`);
            setDiscounts(discounts.filter(discount => discount._id !== id));
            setShowDeleteConfirmation(false);
            toast.success("Discount rule deleted successfully!", {
                duration: 3000
            });
        } catch (err) {
            setError(err.message);
        }
    };

    // Function to handle search
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
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
                setRuleName('');
                setCreateDate(new Date().toISOString().split('T')[0]);
                setDiscountPercentage('');
                setRuleCon('');
                setShowUpdateModal(false);
                setSelectedDiscount(null);
            } else {
                // Create new discount
                await axios.post('http://localhost:8080/discounts/add', {
                    Rule_name: ruleName,
                    Create_date: createDate,
                    Discount_presentage: discountPercentage,
                    rule_con: ruleCon
                });
                setRuleName('');
                setCreateDate(new Date().toISOString().split('T')[0]);
                setDiscountPercentage('');
                setRuleCon('');
                setShowAddModal(false);
                setSelectedDiscount(null);
            }

            // Refresh discounts after create/update
            const res = await axios.get('http://localhost:8080/discounts/');
            setDiscounts(res.data);
        } catch (err) {
            setError(err.message);
        }
    };

    // Function to handle selecting all discounts
    const handleSelectAll = () => {
        const updatedDiscounts = discounts.map(d => ({ ...d, selected: !selectAll }));
        setDiscounts(updatedDiscounts);
        setSelectAll(!selectAll);
    };

    // Function to handle selecting a discount
    const handleSelectDiscount = (discountId) => {
        const updatedDiscounts = discounts.map(d => {
            if (d._id === discountId) {
                return { ...d, selected: !d.selected };
            }
            return d;
        });
        setDiscounts(updatedDiscounts);
    };

    // Function to handle deleting selected discounts
    const handleDeleteSelected = async () => {
        const selectedDiscounts = discounts.filter(d => d.selected).map(d => d._id);
        try {
            await Promise.all(selectedDiscounts.map(async id => {
                await axios.delete(`http://localhost:8080/discounts/delete/${id}`);
            }));
            setDiscounts(discounts.filter(d => !selectedDiscounts.includes(d._id)));
        } catch (err) {
            setError(err.message);
        }
    };

    // Filter discounts based on search query
    const filteredDiscounts = discounts.filter(discount =>
        discount.Rule_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout>
            <Toaster />


            <div className="container">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/">Home</a></li>
                        <li class="breadcrumb-item"><a href="/bill">Bills</a></li>
                        <li class="breadcrumb-item active" aria-current="page">Discount Rule</li>
                    </ol>
                </nav>
                <h4>Manage Discount Rules</h4>

                <div class="container">
                    <div class="row">
                        <div class="col-lg-6 col-md-6 mb-3">
                            <div class="card l-bg-cherry">
                                <div class="card-statistic-3 p-4">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div class="col-8">
                                            <h2 class="d-flex align-items-center mb-5">
                                                Rs.{totalAmount.toFixed(2)}
                                            </h2>
                                            <h5 class="card-title" style={{ marginTop: '25px', marginBottom: '18px' }}>Total sales</h5>
                                        </div>
                                        <i className="bi bi-cash-coin h1"></i>
                                    </div>
                                    <div class="progress mt-1 " data-height="8" style={{ height: '8px' }}>
                                        <div class="progress-bar l-bg-cyan" role="progressbar" data-width="25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{ width: '25%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6 col-md-6 mb-3">
                            <div class="card l-bg-green-dark">
                                <div class="card-statistic-3 p-4">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div class="col-8">
                                            <h3 class="d-flex align-items-center mb-5">
                                                Discount Rules
                                            </h3>
                                            <h5 class="card-title" style={{ marginTop: '25px' }}><button onClick={handleOpenAddModal} className="btn btn-dark"><i class="bi bi-plus-circle-fill me-2"></i>Add New Discount Rule</button></h5>
                                        </div>
                                        <i className="bi bi-percent h1"></i>
                                    </div>
                                    <div class="progress mt-1 " data-height="8" style={{ height: '8px' }}>
                                        <div class="progress-bar l-bg-orange" role="progressbar" data-width="25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{ width: '25%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <h4>All Discount Rules</h4>

                {/* Search input */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="flex-grow-1">
                        <input type="text" className="form-control" placeholder="Search by Customer ID" value={searchQuery} onChange={handleSearch} />
                    </div>
                    <div>
                        <button onClick={handleSelectAll} className="btn btn-secondary" style={{ margin: '0 5px' }}>
                            {selectAll ? 'Unselect All' : 'Select All'}
                        </button>
                        <button className="btn btn-dark" onClick={handleDeleteSelected} style={{ margin: '0 5px' }}>Delete Selected</button>
                    </div>
                </div>

                <div className="modal-backdrop" style={{ display: showAddModal || showUpdateModal ? 'block' : 'none' }}></div>


                {/* Modal for adding new discount rule */}
                <div className="modal" style={{ display: showAddModal ? 'block' : 'none' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i class="bi bi-plus-circle-fill me-2"></i> Add New Discount Rule
                                </h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={() => {
                                    setShowAddModal(false); setSelectedDiscount(null); setRuleName('');
                                    setCreateDate(new Date().toISOString().split('T')[0]);
                                    setDiscountPercentage('');
                                    setRuleCon('');
                                    setShowAddModal(false);
                                }}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleFormSubmit}>
                                    {error && <div className="alert alert-danger" role="alert">{error}</div>}
                                    <div className="mb-3">
                                        <label htmlFor="ruleName" className="form-label"> Discount Rule Name</label>
                                        <input type="text" className="form-control" id="ruleName" value={ruleName} onChange={(e) => setRuleName(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="createDate" className="form-label"> Create Date</label>
                                        <input type="date" className="form-control" id="createDate" value={createDate} onChange={(e) => setCreateDate(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="discountPercentage" className="form-label"> Discount Percentage</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" id="discountPercentage" value={discountPercentage} onChange={(e) => setDiscountPercentage(e.target.value)} />
                                            <span className="input-group-text">%</span>
                                        </div>
                                        {discountPercentage && isNaN(discountPercentage) && <div className="text-danger mt-2"><i class="bi bi-exclamation-triangle-fill me-2"></i> Discount percentage must be a number</div>}
                                        {discountPercentage && !isNaN(discountPercentage) && (discountPercentage < 1 || discountPercentage > 44) && <div className="text-danger mt-2"><i class="bi bi-exclamation-triangle-fill me-2"></i> Discount percentage must be between 1 and 40</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="ruleCon" className="form-label"> Minimum Spend Amount</label>
                                        <input type="number" className="form-control" id="ruleCon" value={ruleCon} onChange={(e) => setRuleCon(e.target.value)} min="10000" step="1" />
                                        {ruleCon && ruleCon < 10000 && <div className="text-danger mt-2"><i class="bi bi-exclamation-triangle-fill me-2"></i> Minimum spend amount must be at least 10000</div>}
                                    </div>
                                    <button type="submit" className="btn btn-primary"><i class="bi bi-plus me-2"></i> Add Discount</button>
                                    <button type="button" className="btn btn-secondary ms-2" onClick={() => {
                                        setShowAddModal(false); setSelectedDiscount(null); setRuleName('');
                                        setCreateDate(new Date().toISOString().split('T')[0]);
                                        setDiscountPercentage('');
                                        setRuleCon('');
                                        setShowAddModal(false);
                                    }}><i class="bi bi-x me-2"></i> Close</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>




                {/* Modal for updating discount rule */}
                {/* Modal for updating discount rule */}
                <div className="modal" style={{ display: showUpdateModal ? 'block' : 'none' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title"><i className="bi bi-pencil-fill me-2"></i>Update Discount Rule</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={() => {
                                    setShowUpdateModal(false); setSelectedDiscount(null); setRuleName('');
                                    setCreateDate(new Date().toISOString().split('T')[0]);
                                    setDiscountPercentage('');
                                    setRuleCon('');
                                    setShowAddModal(false);
                                }}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleFormSubmit}>
                                    {error && <div className="alert alert-danger" role="alert">{error}</div>}
                                    <div className="mb-3">
                                        <label htmlFor="ruleName" className="form-label">Rule Name</label>
                                        <input type="text" className="form-control" id="ruleName" value={ruleName} onChange={(e) => setRuleName(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="createDate" className="form-label">Create Date</label>
                                        <input type="date" className="form-control" id="createDate" value={createDate} onChange={(e) => setCreateDate(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="discountPercentage" className="form-label">Discount Percentage</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" id="discountPercentage" value={discountPercentage} onChange={(e) => setDiscountPercentage(e.target.value)} />
                                            <span className="input-group-text">%</span>
                                        </div>
                                        {discountPercentage && isNaN(discountPercentage) && <div className="text-danger mt-2">Discount percentage must be a number</div>}
                                        {discountPercentage && !isNaN(discountPercentage) && (discountPercentage < 1 || discountPercentage > 44) && <div className="text-danger mt-2">Discount percentage must be between 1 and 40</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="ruleCon" className="form-label">Minimum Spend Amount</label>
                                        <input type="number" className="form-control" id="ruleCon" value={ruleCon} onChange={(e) => setRuleCon(e.target.value)} min="10000" step="1" />
                                        {ruleCon && ruleCon < 10000 && <div className="text-danger mt-2">Minimum spend amount must be at least 10000</div>}
                                    </div>
                                    <button type="submit" className="btn btn-primary"><i className="bi bi-pencil-fill me-2"></i> Update Discount</button>
                                    <button type="button" className="btn btn-secondary ms-2" onClick={() => {
                                        setShowUpdateModal(false); setSelectedDiscount(null); setRuleName('');
                                        setCreateDate(new Date().toISOString().split('T')[0]);
                                        setDiscountPercentage('');
                                        setRuleCon('');
                                        setShowAddModal(false);
                                    }}><i className="bi bi-x me-2"></i> Close</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Delete confirmation modal */}
                <div className="modal" style={{ display: showDeleteConfirmation ? 'block' : 'none' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button type="button" className="close" onClick={() => setShowDeleteConfirmation(false)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this discount rule?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
                                <button type="button" className="btn btn-danger" onClick={() => handleConfirmDelete(deleteItemId)}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Discounts table */}
                <table className="table">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th style={{ textAlign: 'center' }}>Rule Name</th>
                            <th style={{ textAlign: 'center' }}>Create Date</th>
                            <th style={{ textAlign: 'center' }}>Discount Percentage</th>
                            <th style={{ textAlign: 'center' }}>Rule Condition</th>
                            <th style={{ textAlign: 'center' }}>Action</th>
                            <th style={{ textAlign: 'center' }}>Select</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDiscounts.map((discount, index) => (
                            <tr key={discount._id}>
                                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                <td style={{ textAlign: 'center' }}>{discount.Rule_name}</td>
                                <td style={{ textAlign: 'center' }}>{discount.Create_date}</td>
                                <td style={{ textAlign: 'center' }}>{discount.Discount_presentage}</td>
                                <td style={{ textAlign: 'center' }}>{discount.rule_con}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <button className="btn btn-primary" onClick={() => handleOpenUpdateModal(discount)} style={{ margin: '0 5px' }}>Update</button>
                                    <button onClick={() => handleDeleteDiscount(discount._id)} className="btn btn-danger ml-2" style={{ margin: '0 5px' }}>Delete</button>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <input type="checkbox" checked={discount.selected || false} onChange={() => handleSelectDiscount(discount._id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </Layout>
    );
}
