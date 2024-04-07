import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    
      <div className="card mb-1" style={{ margin: '50px'}}>
        <div className="card-body">
          <h5 className="card-title">All Departments</h5>
          <div className="row">
            <div className="col-md-4">
              <div className="card mb-3" style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, color: 'white', borderRadius: '20px' }}>
                <div className="card-body">
                  <h5 className="card-title">Billing</h5>
                  <Link to={`/bill`} className="btn btn-primary" style={{ color: '#fff' }}>Go to Billing</Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card mb-3" style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, color: 'white', borderRadius: '20px' }}>
                <div className="card-body">
                  <h5 className="card-title">Finance</h5>
                  <Link to={`/finance`} className="btn btn-primary" style={{ color: '#fff' }}>Go to Finance</Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card mb-3" style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, color: 'white', borderRadius: '20px' }}>
                <div className="card-body">
                  <h5 className="card-title">Customer</h5>
                  <Link to={`/customer`} className="btn btn-primary" style={{ color: '#fff' }}>Go to Customer</Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card mb-3" style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, color: 'white', borderRadius: '20px' }}>
                <div className="card-body">
                  <h5 className="card-title">Employee</h5>
                  <Link to={`/employee`} className="btn btn-primary" style={{ color: '#fff' }}>Go to Employee</Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card mb-3" style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, color: 'white', borderRadius: '20px' }}>
                <div className="card-body">
                  <h5 className="card-title">Users</h5>
                  <Link to={`/users`} className="btn btn-primary" style={{ color: '#fff' }}>Go to Users</Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card mb-3" style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, color: 'white', borderRadius: '20px' }}>
                <div className="card-body">
                  <h5 className="card-title">Supplier</h5>
                  <Link to={`/supplier`} className="btn btn-primary" style={{ color: '#fff' }}>Go to Supplier</Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card mb-3" style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, color: 'white', borderRadius: '20px' }}>
                <div className="card-body">
                  <h5 className="card-title">Stock</h5>
                  <Link to={`/stock`} className="btn btn-primary" style={{ color: '#fff' }}>Go to Stock</Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card mb-3" style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, color: 'white', borderRadius: '20px' }}>
                <div className="card-body">
                  <h5 className="card-title">Staff Training</h5>
                  <Link to={`/Trainee`} className="btn btn-primary" style={{ color: '#fff' }}>Go to Staff Training</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
}

export default Home;
