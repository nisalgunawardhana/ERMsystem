import React from "react";
import { Card, Button } from "react-bootstrap";
import Layout from '../Layout';
import { Link } from "react-router-dom";

const StockManagement = () => {
    const handleAddClothes = () => {
        // Handle adding clothes logic
    };

    const handleAddToys = () => {
        // Handle adding toys logic
    };

    return (
        <Layout>
            <div className="container">

            <div className="row">
                    {/* Breadcrumb navigation */}
                    <nav className="col-md-6" aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li class="breadcrumb-item active" aria-current="page">Stock Dashboard</li>
                        </ol>
                    </nav>
                    {/* Current Date and Time */}
                    <div className="col-md-6 text-md-end mb-3">
                        
                    </div>
                </div>
                <h1>Stock Management</h1>
                <div className="row">
                    <div className="col-md-6">
                        <Card>
                            <Card.Body>
                                <Card.Title>Clothes</Card.Title>
                                <Card.Text>
                                    Add new clothes items to the stock.
                                    
                                </Card.Text>
                                <Link to={`/dashboard/logistics/stock/clothes`} className="btn btn-dark" style={{ margin: '0 5px' }}>Go To Clothes</Link>
                                <div className="progress mt-1" data-height="8" style={{ height: '8px' }}>
                                        <div className="progress-bar bg-orange" role="progressbar" data-width="25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{ width: '75%', backgroundColor: 'orange' }}></div>
                                    </div>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className="col-md-6">
                        <Card>
                            <Card.Body>
                                <Card.Title>Toys</Card.Title>
                                <Card.Text>
                                    Add new toy items to the stock.
                                </Card.Text>
                                <Link to={`/dashboard/logistics/stock/toys`} className="btn btn-dark" style={{ margin: '0 5px' }}>Go To Toys</Link>
                                <div className="progress mt-1" data-height="8" style={{ height: '8px' }}>
                                        <div className="progress-bar bg-orange" role="progressbar" data-width="25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{ width: '75%', backgroundColor: 'orange' }}></div>
                                    </div>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default StockManagement;
