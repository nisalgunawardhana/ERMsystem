import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Employee.css';

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [employeeId, setEmployeeId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [nic, setNic] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8080/employee/')
            .then((res) => {
                setEmployees(res.data);
            })
            .catch((err) => {
                alert(err.message);
            });
    }, []);

    const handleDeleteEmployee = (id) => {
        axios.delete(`http://localhost:8080/employee/delete/${id}`)
            .then(() => {
                // Fetch the updated list of employees from the server after deletion
                axios.get('http://localhost:8080/employee/')
                    .then((res) => {
                        setEmployees(res.data);
                    })
                    .catch((err) => {
                        alert(err.message);
                    });
            })
            .catch((err) => {
                alert(err.message);
            });
    };
   


    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
    };

    const handleOpenAddModal = () => {
        setShowAddModal(true);
    };

    const handleOpenUpdateModal = (employee) => {
        setSelectedEmployee(employee);
        setEmployeeId(employee.employee_Id);
        setFirstName(employee.name[0].FirstName);
        setLastName(employee.name[0].LastName);
        setNic(employee.employee_NIC);
        setContact(employee.employee_Contact);
        setEmail(employee.employee_Email);
        setShowUpdateModal(true);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        try {
            setError('');

            if (!employeeId || !firstName || !lastName || !nic || !contact || !email) {
                setError('All fields are required.');
                return;
            }

            if (selectedEmployee) {
                await axios.put(`http://localhost:8080/employee/update/${selectedEmployee._id}`, {
                    employee_Id: employeeId,
                    name: [{ FirstName: firstName, LastName: lastName }],
                    employee_NIC: nic,
                    employee_Contact: contact,
                    employee_Email: email
                });

                setShowUpdateModal(false);
            } else {
                await axios.post('http://localhost:8080/employee/add', {
                    employee_Id: employeeId,
                    name: [{ FirstName: firstName, LastName: lastName }],
                    employee_NIC: nic,
                    employee_Contact: contact,
                    employee_Email: email
                });

                setShowAddModal(false);
            }

            const res = await axios.get('http://localhost:8080/employee/');
            setEmployees(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred.');
        }
    };

    const filteredEmployees = employees.filter(employee =>
        employee.employee_Id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const generateReport = () => {
        // Open a new window
        const printWindow = window.open("", "_blank", "width=600,height=600");
    
        // Write HTML content to the new window
        printWindow.document.write(`
            <html>
                <head>
                    <title>Employees Report</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            padding: 20px;
                        }
                        h1 {
                            text-align: center;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 20px;
                        }
                        th, td {
                            border: 1px solid #ccc;
                            padding: 8px;
                            text-align: left;
                        }
                        th {
                            background-color: #f2f2f2;
                        }
                        .back-button {
                            text-align: center;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <h1>Employees Report</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Employee ID</th>
                                <th>Name</th>
                                <th>Contact</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${employees.map(employee => `
                                <tr>
                                    <td>${employee.employee_Id}</td>
                                    <td>${employee.name[0].FirstName,employee.name[0].LastName}</td>
                                    <td>${employee.employee_Contact}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    
                    <div class="back-button">
                        <button onclick="window.close()" class="btn btn-secondary">Back</button>
                    </div>
                </body>
            </html>
        `);
    
        // Close the HTML document
        printWindow.document.close();
    
        // Print the report
        printWindow.print();
    };



    

    return (
        <div className="container">
            <h3 fonrweight="blod">Employee Management</h3>

            <div className="row">
                <div className="col-md-4">
                <div className="card border-success mb-3">
                <div className="card-body">
                    <h5 className="card-title">Add New Employee</h5>
                    
                    <button onClick={handleOpenAddModal} className="btn btn-dark">Add New Employee</button>
                    
                </div>
            </div>
                </div>
                <div className="col-md-4">
                <div className="card mb-3" style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, color: 'white', borderRadius: '20px' }}>
                        <div className="card-body">
                            <h5 className="card-title"
                                fonrweight="bold">Total Employees</h5>
                            <br/>
                            <div className="text-center my-auto">
                                <h1 className="card-text">{employees.length}</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card mb-3" style={{ background: `linear-gradient(to right, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8))`, color: 'white', borderRadius: '20px' }}>
                        <div className="card-body">
                            <h5 className="card-title">Generate Reports</h5>
                            <p className="card-text">Generate and download employee reports.</p>
                            <button onClick={generateReport} className="btn btn-dark">Generate Report</button>
                            <div className="progress-bar bg-light" role="progressbar" style={{ width: '75%' }} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="flex-grow-1">
                    <input type="text" className="form-control" placeholder="Search by Employee ID" value={searchQuery} onChange={handleSearch} />
                </div>
                
            </div>

            <div className="modal-backdrop" style={{ display: showAddModal || showUpdateModal ? 'block' : 'none' }}></div>

            
            <div className="modal" style={{ display: showAddModal ? 'block' : 'none' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add New Employee</h5>
                            <button type="button" className="close" style={{ position: 'absolute', right: '10px', top: '10px' }} onClick={() => setShowAddModal(false)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleFormSubmit}>
                                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                                <div className="form-group">
                                <label>Employee ID</label>
                                <input type="text" className="form-control" onChange={(e) => setEmployeeId(e.target.value)} pattern="^EMP\d+$" title="EMPXXXX" required/>
                            <small className="form-text text-muted">EMPXXXX</small>
                            </div>
                        <div className="form-group">
                                <label>First Name</label>
                                <input type="text" className="form-control" onChange={(e) => setFirstName(e.target.value)} required/>
                            </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" className="form-control" onChange={(e) => setLastName(e.target.value)} required/>
                            </div>
                        <div className="form-group">
                            <label>NIC</label>
                            <input type="text" className="form-control" onChange={(e) => setNic(e.target.value)} required/>
                            </div>
                        <div className="form-group">
                            <label>Contact</label>
                            <input type="tel" className="form-control" onChange={(e) => setContact(e.target.value)} pattern="[0-9]{10}" title="Contact must be a 10-digit number" required/>
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" className="form-control" onChange={(e) => setEmail(e.target.value)} required/>
                        </div>
                        <button type="submit" className="btn btn-primary">Add Employee</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Close</button>
                        </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for updating employee */}
            <div className="modal" style={{ display: showUpdateModal ? 'block' : 'none' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Update Employee</h5>
                            <button type="button" className="close" style={{ position: 'absolute', right: '10px', top: '10px' }} onClick={() => setShowUpdateModal(false)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleFormSubmit}>
                                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                                <div className="form-group">
                                    <label>Employee ID</label>
                                    <input type="text" className="form-control" onChange={(e) => setEmployeeId(e.target.value)} pattern="^EMP\d+$" title="EMPXXXX" required/>
                            <small className="form-text text-muted">EMPXXXX</small>
                                </div>
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input type="text" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input type="text" className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>NIC</label>
                                    <input type="text" className="form-control" value={nic} onChange={(e) => setNic(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Contact</label>
                                    <input type="tel" className="form-control" onChange={(e) => setContact(e.target.value)} pattern="[0-9]{10}" title="Contact must be a 10-digit number" required/>                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <button type="submit" className="btn btn-primary">Update Employee</button>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>Close</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Employees table */}
            <table className="table">
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Employee ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>NIC</th>
                        <th>Contact</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEmployees.map((employee, index) => (
                        <tr key={employee._id}>
                            <td>{index + 1}</td>
                            <td>{employee.employee_Id}</td>
                            <td>{employee.name[0].FirstName}</td>
                            <td>{employee.name[0].LastName}</td>
                            <td>{employee.employee_NIC}</td>
                            <td>{employee.employee_Contact}</td>
                            <td>{employee.employee_Email}</td>
                            <td>
                                <button className="btn btn-primary" onClick={() => handleOpenUpdateModal(employee)} style={{ margin: '0 5px' }}>Update</button>
                                <button onClick={() => handleDeleteEmployee(employee._id)} className="btn btn-danger ml-2" style={{ margin: '0 5px' }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
