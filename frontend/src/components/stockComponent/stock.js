import React from "react";
import { Card, Button } from "react-bootstrap";

const StockManagement = () => {
    const handleAddClothes = () => {
        // Handle adding clothes logic
    };

    const handleAddToys = () => {
        // Handle adding toys logic
    };

    return (
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
                            <Button variant="primary" onClick={handleAddClothes}>Go to Clothes</Button>
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
                            <Button variant="primary" onClick={handleAddToys}>Go to Toys</Button>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default StockManagement;
