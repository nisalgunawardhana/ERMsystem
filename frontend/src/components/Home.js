import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import { useSelector } from "react-redux";
import Layout from "./Layout";
import "../User.css";

function Home() {
    const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [departmentComponents, setDepartmentComponents] = useState("");

  const getData = async () => {
    try {
      const response = await axios.post("/api/user/get-user-info-by-id", {}, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem('token'),
        },
      });

      const userData = response.data.data;

      if (userData.isAdmin) {
        setDepartmentComponents("system users");
      } else if (userData.isCashier) {
        setDepartmentComponents("billing and customer");
      } else if (userData.isFinanceManager) {
        setDepartmentComponents("finance");
      } else if (userData.isStaffManager) {
        setDepartmentComponents("employees");
      } else if (userData.isLogisticManager) {
        setDepartmentComponents("stock and suppliers");
      } else if (userData.isTrainingCoordinator) {
        setDepartmentComponents("trainees");
      } else {
        setDepartmentComponents("you are here to mark the attendance");
      }
    } catch (error) {
      console.error("Error getting user info:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  let adminComponent = null;
  let cashierComponent = null;
  let financeComponent = null;
  let logisticComponent = null;
  let staffComponent = null;
  let traineesComponent = null;

if (user) {
  switch (true) {
    case user.isAdmin:
      adminComponent = (
        <div className="row">

          {/*billing*/}
            <div className="container">
              <div className="row">
                <div className="col-md-3">
                  <a href="/dashboard/cashier/billing" style={{ textDecoration: 'none' }}>
                    <div className="function-box" style={{ background: 'white', border: '1px solid #ced4da', borderRadius: '20px', padding: '30px', marginBottom: '30px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', color: '#fff' }}>
                      <div className="text-center mb-4">
                        <i className="bi bi-file-earmark-text-fill function-icon" style={{ fontSize: '40px', color: '#080a3c' }}></i>
                      </div>
                      <div>
                        <h2 className="text-center mb-3" style={{ fontSize: '24px', color: '#080a3c' }}>Billing</h2>
                      </div>
                    </div>
                  </a>
                </div>

                {/*finance*/}
                <div className="col-md-3">
                  <a href="/finance" style={{ textDecoration: 'none' }}>
                    <div className="function-box" style={{ backgroundColor: 'white', border: '1px solid #ced4da', borderRadius: '20px', padding: '30px', marginBottom: '20px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', color: '#080a3c' }}>
                      <div className="text-center mb-4">
                        <i className="ri-money-dollar-circle-fill function-icon" style={{ fontSize: '40px', color: '#080a3c' }}></i>
                      </div>
                      <div>
                        <h2 className="text-center mb-3" style={{ fontSize: '24px', color: '#080a3c' }}>Finance</h2>
                      </div>
                    </div>
                  </a>
                </div>

                {/*staff training*/}
                <div className="col-md-3">
                  <a href="/trainee" style={{ textDecoration: 'none' }}>
                    <div className="function-box" style={{ backgroundColor: 'white', border: '1px solid #ced4da', borderRadius: '20px', padding: '30px', marginBottom: '20px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', color: '#080a3c' }}>
                      <div className="text-center mb-4">
                        <i className="bi bi-lightbulb-fill function-icon" style={{ fontSize: '40px', color: '#080a3c' }}></i>
                      </div>
                      <div>
                        <h2 className="text-center mb-3" style={{ fontSize: '24px', color: '#080a3c' }}>Staff Training</h2>
                      </div>
                    </div>
                  </a>
                </div>

                {/*supplier*/}
                <div className="col-md-3">
                  <a href="/supplier" style={{ textDecoration: 'none' }}>
                    <div className="function-box" style={{ backgroundColor: 'white', border: '1px solid #ced4da', borderRadius: '20px', padding: '30px', marginBottom: '20px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', color: '#080a3c' }}>
                      <div className="text-center mb-4">
                        <i className="ri-store-3-fill function-icon" style={{ fontSize: '40px', color: '#080a3c' }}></i>
                      </div>
                      <div>
                        <h2 className="text-center mb-3" style={{ fontSize: '24px', color: '#080a3c' }}>Suppliers</h2>
                      </div>
                    </div>
                  </a>
                </div>

                {/*users*/}
                <div className="col-md-3">
                  <a href="/users" style={{ textDecoration: 'none' }}>
                    <div className="function-box" style={{ backgroundColor: 'white', border: '1px solid #ced4da', borderRadius: '20px', padding: '30px', marginBottom: '20px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', color: '#080a3c' }}>
                      <div className="text-center mb-4">
                        <i className="bi bi-person-lines-fill function-icon" style={{ fontSize: '40px', color: '#080a3c' }}></i>
                      </div>
                      <div>
                        <h2 className="text-center mb-3" style={{ fontSize: '24px', color: '#080a3c' }}>Users</h2>
                      </div>
                    </div>
                  </a>
                </div>

                {/*employees*/}
                <div className="col-md-3">
                  <a href="/employee" style={{ textDecoration: 'none' }}>
                    <div className="function-box" style={{ backgroundColor: 'white', border: '1px solid #ced4da', borderRadius: '20px', padding: '30px', marginBottom: '20px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', color: '#080a3c' }}>
                      <div className="text-center mb-4">
                        <i className="bi bi-people-fill function-icon" style={{ fontSize: '40px', color: '#080a3c' }}></i>
                      </div>
                      <div>
                        <h2 className="text-center mb-3" style={{ fontSize: '24px', color: '#080a3c' }}>Employees</h2>
                      </div>
                    </div>
                  </a>
                </div>

                {/*customers*/}
                <div className="col-md-3">
                  <a href="/dashboard/cashier/customer" style={{ textDecoration: 'none' }}>
                    <div className="function-box" style={{ backgroundColor: 'white', border: '1px solid #ced4da', borderRadius: '20px', padding: '30px', marginBottom: '20px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', color: '#080a3c' }}>
                      <div className="text-center mb-4">
                        <i className="bi bi-person-check-fill function-icon" style={{ fontSize: '40px', color: '#080a3c' }}></i>
                      </div>
                      <div>
                        <h2 className="text-center mb-3" style={{ fontSize: '24px', color: '#080a3c' }}>Customers</h2>
                      </div>
                    </div>
                  </a>
                </div>

                {/*stock*/}
                <div className="col-md-3">
                  <a href="/stock" style={{ textDecoration: 'none' }}>
                    <div className="function-box" style={{ backgroundColor: 'white', border: '1px solid #ced4da', borderRadius: '20px', padding: '30px', marginBottom: '20px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', color: '#080a3c' }}>
                      <div className="text-center mb-4">
                        <i className="bi bi-archive-fill function-icon" style={{ fontSize: '40px', color: '#080a3c' }}></i>
                      </div>
                      <div>
                        <h2 className="text-center mb-3" style={{ fontSize: '24px', color: '#080a3c' }}>Stock</h2>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        
      );
      break;

      
      case user.isCashier:
      cashierComponent = (
        navigate('/dashboard/cashier')
      );
      break;


      case user.isFinanceManager:
      financeComponent = (
        navigate('/finance')
      );
      break;


      case user.isLogisticManager:
      break;


      case user.isStaffManager:
      staffComponent = (
        navigate('/employee')
      );
      break;


      case user.isTrainingCoordinator:
      traineesComponent = (
        <div className="row">

            {/* billing */}
            <div className="col-md-4">
              <div className="card mb-3" 
                  style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, 
                  color: 'white', 
                  borderRadius: '20px',
                  filter: 'blur(3px)',
                   }}>
                <div className="card-body">
                  <h5 className="card-title">Billing</h5>
                  <Link to={``} className="btn btn-primary" style={{ color: '#fff' }}>Go to Billing</Link>
                </div>
              </div>
            </div>

            {/* finance */}
            <div className="col-md-4">
              <div className="card mb-3" 
                  style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, 
                  color: 'white', 
                  borderRadius: '20px',
                  filter: 'blur(3px)' 
                  }}>
                <div className="card-body">
                  <h5 className="card-title">Finance</h5>
                  <Link to={``} className="btn btn-primary" style={{ color: '#fff' }}>Go to Finance</Link>
                </div>
              </div>
            </div>

            {/* customer */}
            <div className="col-md-4">
              <div className="card mb-3" 
                  style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, 
                  color: 'white', 
                  borderRadius: '20px',
                  filter: 'blur(3px)' 
                  }}>
                <div className="card-body">
                  <h5 className="card-title">Customer</h5>
                  <Link to={``} className="btn btn-primary" style={{ color: '#fff' }}>Go to Customer</Link>
                </div>
              </div>
            </div>

            {/* employee */}
            <div className="col-md-4">
              <div className="card mb-3" 
                  style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, 
                  color: 'white', 
                  borderRadius: '20px',
                  filter: 'blur(3px)' 
                  }}>
                <div className="card-body">
                  <h5 className="card-title">Employee</h5>
                  <Link to={``} className="btn btn-primary" style={{ color: '#fff' }}>Go to Employee</Link>
                </div>
              </div>
            </div>

            {/* users */}
            <div className="col-md-4">
              <div className="card mb-3" 
                  style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, 
                  color: 'white', 
                  borderRadius: '20px',
                  filter: 'blur(3px)' 
                  }}>
                <div className="card-body">
                  <h5 className="card-title">Users</h5>
                  <Link to={``} className="btn btn-primary" style={{ color: '#fff' }}>Go to Users</Link>
                </div>
              </div>
            </div>

            {/* supplier */}
            <div className="col-md-4">
              <div className="card mb-3" 
                  style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, 
                  color: 'white', 
                  borderRadius: '20px',
                  filter: 'blur(3px)' 
                  }}>
                <div className="card-body">
                  <h5 className="card-title">Supplier</h5>
                  <Link to={``} className="btn btn-primary" style={{ color: '#fff' }}>Go to Supplier</Link>
                </div>
              </div>
            </div>

            {/* stock */}
            <div className="col-md-4">
              <div className="card mb-3"    
                  style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, 
                  color: 'white', 
                  borderRadius: '20px',
                  filter: 'blur(3px)' 
                  }}>
                <div className="card-body">
                  <h5 className="card-title">Stock</h5>
                  <Link to={``} className="btn btn-primary" style={{ color: '#fff' }}>Go to Stock</Link>
                </div>
              </div>
            </div>

            {/* trainee */}
            <div className="col-md-4">
              <div className="card mb-3" 
                  style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, 
                  color: 'white', 
                  borderRadius: '20px',
                  }}>
                <div className="card-body">
                  <h5 className="card-title">Staff Training</h5>
                  <Link to={`/Trainee`} className="btn btn-primary" style={{ color: '#fff' }}>Go to Staff Training</Link>
                </div>
              </div>
            </div>

        </div>
      );
      break;


    default:
      // Handle default case or do nothing
      break;
  }
}

  return (
      <Layout>
        <div className="departments" style={{ padding: '20px' }}>
          <div className="card-body">
            <h3 className="card-title" style={{ textAlign: "center" }}>All Departments</h3>
            <br></br>
            <br></br>
            <div className="row">
              {adminComponent}
              {cashierComponent}
              {financeComponent}
              {logisticComponent}
              {staffComponent}
              {traineesComponent}
            </div>
          </div>
        </div>
      </Layout>
    );
}

export default Home;