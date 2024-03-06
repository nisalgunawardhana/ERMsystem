import React, {useState, useEffect} from 'react';
import axios from "axios";
import {Link} from "react-router-dom";


export default function Bills(){

    const [bill, setbill] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(()=>{
        function getbill(){
            axios.get("http://localhost:8080/bills/").then((res) => {
                setbill(res.data);
            }).catch((err) => {
                alert(err.message);
            })
        }

        function getTotalAmount() {
            axios.get("http://localhost:8080/profit/get/")
                .then((res) => {
                    setTotalAmount(res.data.totalAmount);
                })
                .catch((err) => {
                    alert(err.message);
                })
        }

        getbill();
        getTotalAmount();
    },[])

    const handleDelete = (id) => {
        axios.delete(`http://localhost:8080/bills/delete/${id}`)
            .then(() => {
                // Reload the page after deletion
                window.location.reload();
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        const filteredBills = bill.filter(bills =>
            bills.customer_id.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filteredBills);
    };

    

    
    return(
        
        <div className="container">

            <h3>Bills</h3>

            <div className="mb-3">
                <input type="text" className="form-control" placeholder="Search by Customer ID" value={searchQuery} onChange={handleSearch} />
                <div className="dropdown">
                    {searchResults.length > 0 && (
                        <div className="dropdown-menu show">
                            {searchResults.map((bills, index) => (
                                <Link to={`/bill/${bills._id}`} key={index} className="dropdown-item">
                                    {bills.customer_id}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="row">
                <div className="col-md-4">
                <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Total Amount</h5>
                    <p className="card-text">{totalAmount}</p>
                    
                </div>
            </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Create Bill</h5>
                            <p className="card-text">Make New Bill</p>
                            <Link to="/create-bill" className="btn btn-primary">Create New Bill</Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Generate Reports</h5>
                            <p className="card-text">Generate and download sales reports.</p>
                            <Link to="#" className="btn btn-primary">Generate</Link>
                        </div>
                    </div>
                </div>
            </div>

                <table className="table">
                <thead>
                    <tr>
                        <th>Customer ID</th>
                        <th>Billing Date</th>
                        <th>Items</th>
                        <th>Total Amount</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {bill.map(bills => (
                        <tr key={bills._id}>
                            <td>{bills.customer_id}</td>
                            <td>{bills.billing_date}</td>
                            <td>
                                <ul>
                                    {bills.items.map(item => (
                                        <li key={item.product_id}>
                                            <div>Product ID: {item.product_id}</div>
                                            <div>Quantity: {item.quantity}</div>
                                            <div>Unit Price: {item.unit_price}</div>
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>{bills.total_amount}</td>
                            <td>
                            <Link to={`/update/${bills._id}`} className="btn btn-primary">Update</Link>
                            <button onClick={() => handleDelete(bills._id)} className="btn btn-danger">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}