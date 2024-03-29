import React from "react";
import { Link } from "react-router-dom";

function Home() {

  return (
    <div style={{ marginTop: '150px', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Link to={`/bill`} className="btn btn-primary me-5" style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px 20px', fontSize: '18px', borderRadius: '8px', marginBottom: '10px' }}>Billing</Link>
        <Link to={`/finance`} className="btn btn-primary me-5" style={{ backgroundColor: '#6c757d', color: '#fff', padding: '10px 20px', fontSize: '18px', borderRadius: '8px', marginBottom: '10px' }}>Finance</Link>
        <Link to={`/customer`} className="btn btn-primary me-5" style={{ backgroundColor: '#28a745', color: '#fff', padding: '10px 20px', fontSize: '18px', borderRadius: '8px', marginBottom: '10px' }}>Customer</Link>
        <Link to={`/employee`} className="btn btn-primary me-5" style={{ backgroundColor: '#ffc107', color: '#000', padding: '10px 20px', fontSize: '18px', borderRadius: '8px', marginBottom: '10px' }}>Employee</Link>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
        <Link to={`/users`} className="btn btn-primary me-5" style={{ backgroundColor: '#6610f2', color: '#fff', padding: '10px 20px', fontSize: '18px', borderRadius: '8px', marginBottom: '10px' }}>Users</Link>
        <Link to={`/supplier`} className="btn btn-primary me-5" style={{ backgroundColor: '#17a2b8', color: '#fff', padding: '10px 20px', fontSize: '18px', borderRadius: '8px', marginBottom: '10px' }}>Supplier</Link>
        <Link to={`/stock`} className="btn btn-primary me-5" style={{ backgroundColor: '#dc3545', color: '#fff', padding: '10px 20px', fontSize: '18px', borderRadius: '8px', marginBottom: '10px' }}>Stock</Link>
        <Link to={`/Trainee`} className="btn btn-primary me-5" style={{ backgroundColor: '#20c997', color: '#fff', padding: '10px 20px', fontSize: '18px', borderRadius: '8px', marginBottom: '10px' }}>Staff Training</Link>
      </div>
    </div>

  );
}

export default Home;