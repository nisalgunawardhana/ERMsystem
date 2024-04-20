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
                <h1>Stock Management</h1>
                <div className="row">
                    <div className="col-md-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>Clothes</Card.Title>
                                <Card.Text>
                                    Add new clothes items to the stock.
                                    
                                </Card.Text>
                                <Link to={`/dashboard/stock/clothes`} className="btn btn-outline-primary" style={{ margin: '0 5px' }}>Go To Clothes</Link>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className="col-md-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>Toys</Card.Title>
                                <Card.Text>
                                    Add new toy items to the stock.
                                </Card.Text>
                                <Link to={`/dashboard/stock/toys`} className="btn btn-outline-primary" style={{ margin: '0 5px' }}>Go To Toys</Link>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default StockManagement;
