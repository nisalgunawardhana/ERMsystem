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

            {/* billing */}
            <div className="col-md-4">
              <div className="card mb-3" 
                  style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, 
                  color: 'white', 
                  borderRadius: '20px',
                  }}>
                <div className="card-body">
                  <h5 className="card-title">Billing</h5>
                  <Link to={`/bill`} className="btn btn-primary" style={{ color: '#fff' }}>Go to Billing</Link>
                </div>
              </div>
            </div>

            {/* finance */}
            <div className="col-md-4">
              <div className="card mb-3" 
                  style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, 
                  color: 'white', 
                  borderRadius: '20px',
                  }}>
                <div className="card-body">
                  <h5 className="card-title">Finance</h5>
                  <Link to={`/finance`} className="btn btn-primary" style={{ color: '#fff' }}>Go to Finance</Link>
                </div>
              </div>
            </div>

            {/* customer */}
            <div className="col-md-4">
              <div className="card mb-3" 
                  style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, 
                  color: 'white', 
                  borderRadius: '20px',
                  }}>
                <div className="card-body">
                  <h5 className="card-title">Customer</h5>
                  <Link to={`/customer`} className="btn btn-primary" style={{ color: '#fff' }}>Go to Customer</Link>
                </div>
              </div>
            </div>

            {/* employee */}
            <div className="col-md-4">
              <div className="card mb-3" 
                  style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, 
                  color: 'white', 
                  borderRadius: '20px',
                  }}>
                <div className="card-body">
                  <h5 className="card-title">Employee</h5>
                  <Link to={`/employee`} className="btn btn-primary" style={{ color: '#fff' }}>Go to Employee</Link>
                </div>
              </div>
            </div>

            {/* users */}
            <div className="col-md-4">
              <div className="card mb-3" 
                  style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, 
                  color: 'white', 
                  borderRadius: '20px',
                  }}>
                <div className="card-body">
                  <h5 className="card-title">Users</h5>
                  <Link to={`/users`} className="btn btn-primary" style={{ color: '#fff' }}>Go to Users</Link>
                </div>
              </div>
            </div>

            {/* supplier */}
            <div className="col-md-4">
              <div className="card mb-3" 
                  style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, 
                  color: 'white', 
                  borderRadius: '20px',
                  }}>
                <div className="card-body">
                  <h5 className="card-title">Supplier</h5>
                  <Link to={`/supplier`} className="btn btn-primary" style={{ color: '#fff' }}>Go to Supplier</Link>
                </div>
              </div>
            </div>

            {/* stock */}
            <div className="col-md-4">
              <div className="card mb-3"    
                  style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, 
                  color: 'white', 
                  borderRadius: '20px',
                  }}>
                <div className="card-body">
                  <h5 className="card-title">Stock</h5>
                  <Link to={`/stock`} className="btn btn-primary" style={{ color: '#fff' }}>Go to Stock</Link>
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
                  }}>
                <div className="card-body">
                  <h5 className="card-title">Employee</h5>
                  <Link to={`/employee`} className="btn btn-primary" style={{ color: '#fff' }}>Go to Employee</Link>
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
                  filter: 'blur(3px)' 
                  }}>
                <div className="card-body">
                  <h5 className="card-title">Staff Training</h5>
                  <Link to={``} className="btn btn-primary" style={{ color: '#fff' }}>Go to Staff Training</Link>
                </div>
              </div>
            </div>

        </div>
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