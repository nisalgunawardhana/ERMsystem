import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container" style={{ marginTop: '150px', width: '1200px' }}>
      <div className="row">
        <div className="col-md-3">
          <a href="/bill" style={{ textDecoration: 'none' }}>
            <div className="function-box" style={{ backgroundColor: '#f8f9fa', border: '1px solid #ced4da', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
              <i className="bi bi-file-earmark-text function-icon" style={{ fontSize: '40px' }}></i>
              <h4 className="text-center mt-3">Billing</h4>
            </div>
          </a>
        </div>
        <div className="col-md-3">
          <a href="/finance" style={{ textDecoration: 'none' }}>
            <div className="function-box" style={{ backgroundColor: '#f8f9fa', border: '1px solid #ced4da', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
              <i className="bi bi-currency-dollar function-icon" style={{ fontSize: '40px' }}></i>
              <h4 className="text-center mt-3">Finance</h4>
            </div>
          </a>
        </div>
        <div className="col-md-3">
          <a href="/trainee" style={{ textDecoration: 'none' }}>
            <div className="function-box" style={{ backgroundColor: '#f8f9fa', border: '1px solid #ced4da', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
              <i className="bi bi-lightbulb function-icon" style={{ fontSize: '40px' }}></i>
              <h4 className="text-center mt-3">Staff Training</h4>
            </div>
          </a>
        </div>
        <div className="col-md-3">
          <a href="/supplier" style={{ textDecoration: 'none' }}>
            <div className="function-box" style={{ backgroundColor: '#f8f9fa', border: '1px solid #ced4da', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
              <i className="bi bi-truck function-icon" style={{ fontSize: '40px' }}></i>
              <h4 className="text-center mt-3">Supplier</h4>
            </div>
          </a>
        </div>
        <div className="col-md-3">
          <a href="/users" style={{ textDecoration: 'none' }}>
            <div className="function-box" style={{ backgroundColor: '#f8f9fa', border: '1px solid #ced4da', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
              <i className="bi bi-person-lines-fill function-icon" style={{ fontSize: '40px' }}></i>
              <h4 className="text-center mt-3">User</h4>
            </div>
          </a>
        </div>
        <div className="col-md-3">
          <a href="/employee" style={{ textDecoration: 'none' }}>
            <div className="function-box" style={{ backgroundColor: '#f8f9fa', border: '1px solid #ced4da', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
              <i className="bi bi-people-fill function-icon" style={{ fontSize: '40px' }}></i>
              <h4 className="text-center mt-3">Employee</h4>
            </div>
          </a>
        </div>
        <div className="col-md-3">
          <a href="/customer" style={{ textDecoration: 'none' }}>
            <div className="function-box" style={{ backgroundColor: '#f8f9fa', border: '1px solid #ced4da', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
              <i className="bi bi-person-check function-icon" style={{ fontSize: '40px' }}></i>
              <h4 className="text-center mt-3">Customer</h4>
            </div>
          </a>
        </div>
        <div className="col-md-3">
          <a href="/stock" style={{ textDecoration: 'none' }}>
            <div className="function-box" style={{ backgroundColor: '#f8f9fa', border: '1px solid #ced4da', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
              <i className="bi bi-archive-fill function-icon" style={{ fontSize: '40px' }}></i>
              <h4 className="text-center mt-3">Stock</h4>
            </div>
          </a>
        </div>
      </div>
    </div>

  );
}

export default Home;
