import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../Layout';
import { Modal, Button, Form } from 'react-bootstrap';

export default function Employees() {
    
    const [employees, setEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
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
    const [selectAll, setSelectAll] = useState(false);
    const [currentDateTime, setCurrentDateTime] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8080/employee/')
            .then((res) => {
                setEmployees(res.data);
            })
            .catch((err) => {
                alert(err.message);
            });

            const intervalId = setInterval(() => {
                const now = new Date();
                setCurrentDateTime(now.toLocaleString());
            }, 1000);
    
            // Cleanup interval
            return () => clearInterval(intervalId);
        }, []);

    const handleDeleteEmployee = (id) => {
        console.log("Deleting employee with ID:", id); // Add this line
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

            // Check if the Employee ID already exists
            const existingEmployee = employees.find(emp => emp.employee_Id === employeeId);
            if (existingEmployee && existingEmployee._id !== selectedEmployee?._id) {
                setError('Employee ID already exists. Please choose a unique Employee ID.');
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

            setEmployeeId('');
            setFirstName('');
            setLastName('');
            setNic('');
            setContact('');
            setEmail('');

            // Fetch the updated list of employees from the server
            const res = await axios.get('http://localhost:8080/employee/');
            setEmployees(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred.');
        }
    };

    const filteredEmployees = employees.filter(employee =>
        employee.employee_Id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEmployeeSelect = (employeeId) => {
        const index = selectedEmployees.indexOf(employeeId);
        if (index === -1) {
            setSelectedEmployees([...selectedEmployees, employeeId]);
        } else {
            const updatedSelectedEmployees = [...selectedEmployees];
            updatedSelectedEmployees.splice(index, 1);
            setSelectedEmployees(updatedSelectedEmployees);
        }
    };

    const isEmployeeSelected = (employeeId) => {
        return selectedEmployees.includes(employeeId);
    };

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
                    
                
                </body>
            </html>
        `);
    
        // Close the HTML document
        printWindow.document.close();
    
        // Print the report
        printWindow.print();
    };

     // Function to handle selecting all employees
     const handleSelectAll = () => {
        if (selectAll) {
            setSelectedEmployees([]);
        } else {
            const allEmployeeIds = employees.map(employee => employee.employee_Id);
            setSelectedEmployees(allEmployeeIds);
        }
        setSelectAll(prevState => !prevState);
    };

    // Function to delete all selected employees
    const handleDeleteAll = async () => {
        try {
            // Send a request to delete multiple employees
            const response = await axios.delete('http://localhost:8080/employee/deleteMultiple', {
                data: { employeeId: selectedEmployees }
            });
            // Clear selected employees after deletion
            setSelectedEmployees([]);
            // Reset Select All checkbox state
            setSelectAll(false);
            console.log(response.data.message); // Log success message
        } catch (err) {
            console.error("Error deleting employees:", err);
        }
    };

   

    

    

    return (
        <Layout>
            <div className="container">
            <div className="row">
        {/* Breadcrumb navigation */}
        <nav className="col-md-6" aria-label="breadcrumb">
            <ol className="breadcrumb">
                <li className="breadcrumb-item active" aria-current="page">Employee Dashboard</li>
            </ol>
        </nav>
        {/* Current Date and Time */}
        <div className="col-md-6 text-md-end mb-3">
                        <div className="date-time">
                            <span className="date">{currentDateTime.split(',')[0]}</span>
                            <span className="time"> | {currentDateTime.split(',')[1]}</span>
                        </div>
                    </div>
    </div>
         {/* Page title */}
         <h2 className="text-left mb-4">Employee Dashboard</h2>
    <div className="col-lg-6 col-md-6 mb-3">
        <div className="card shadow" style={{ backgroundColor: 'white' }}>
                <div className="card-statistic-3 p-4">
                    <div className="d-flex justify-content-between align-items-center">
                    <div className="col-8">
                        <h1 className="d-flex align-items-center mb-5" style={{ color: 'black' }}>
                            {employees.length}
                        </h1>  
                        <h5 className="card-title" style={{ color: 'black', marginTop: '25px' }}>Total Employee</h5>
                    </div> 
                    <i className="bi bi-person fs-1 mb-3" style={{ color: 'black' }}></i>
                </div>
                <div className="progress mt-1" data-height="8" style={{ height: '8px' }}>
                    <div className="progress-bar bg-orange" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{ width: '75%', backgroundColor: 'orange' }}></div>
                        </div>         
                            <button onClick={handleOpenAddModal} className="btn btn-outline-success"><i class="bi bi-plus-circle-fill me-2"></i>Add New Employee</button>
                        </div>
                        
            </div>
        </div>
        
        <div className="col-lg-6 col-md-6 mb-3">
        <div className="card shadow" style={{ backgroundColor: 'white' }}>
                <div className="card-statistic-3 p-4">
                    <div className="d-flex justify-content-between align-items-center">
                    <div className="col-8">
                            <h5 className="card-title">Generate Report</h5>
                            <p className="card-text">Here's the comprehensive report summarizing all Employee,</p>
                            <button onClick={generateReport} className="btn btn-outline-danger">Generate Report</button>
                        </div>
                    </div>
                </div>
            </div>
         </div>
          
                <div className="col-md-6 mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="flex-grow-1">
                            <input type="text" className="form-control" placeholder="Search by Employee ID" value={searchQuery} onChange={handleSearch} />
                        </div>
                        <div>
                            <button className="btn btn-primary" onClick={handleDeleteAll} style={{ margin: '0 5px' }}>Delete Selected</button>
                            <button className="btn btn-secondary ml-2" onClick={handleSelectAll}>
                                {selectAll ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>
                    </div>
                </div>

            {/* Employees table */}
    <div className="card">
        <div className="card-body">        
            <table className="table">
                <thead className="table"  text-align ="center">
                    <tr>
                        <th>Select</th>
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
                            <td>
                                <input
                                    type="checkbox"
                                    checked={isEmployeeSelected(employee.employee_Id)}
                                    onChange={() => handleEmployeeSelect(employee.employee_Id)}
                                />
                            </td>
                            <td>{employee.employee_Id}</td>
                            <td>{employee.name[0].FirstName}</td>
                            <td>{employee.name[0].LastName}</td>
                            <td>{employee.employee_NIC}</td>
                            <td>{employee.employee_Contact}</td>
                            <td>{employee.employee_Email}</td>
                            <td>
                                <button onClick={() => handleOpenUpdateModal(employee)} className="btn btn-outline-primary" style={{ margin: '0 5px' }} >Update</button>
                                <button onClick={() => handleDeleteEmployee(employee._id)} className="btn btn-outline-danger" style={{ margin: '0 5px'}}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>

            <div className="modal-backdrop" style={{ display: showAddModal || showUpdateModal ? 'block' : 'none' }}></div>
</div>
</div>
            
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
        <input type="text" className="form-control" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} pattern="^EMP\d+$" title="EMPXXXX" required />
        <small className="form-text text-muted">EMPXXXX</small>
    </div>
    <div className="form-group">
        <label>First Name</label>
        <input type="text" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
    </div>
    <div className="form-group">
        <label>Last Name</label>
        <input type="text" className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
    </div>
    <div className="form-group">
        <label>NIC</label>
        <input type="text" className="form-control" value={nic} onChange={(e) => setNic(e.target.value)} required />
    </div>
    <div className="form-group">
        <label>Contact</label>
        <input type="tel" className="form-control" value={contact} onChange={(e) => setContact(e.target.value)} pattern="[0-9]{10}" title="Contact must be a 10-digit number" required />
    </div>
    <div className="form-group">
        <label>Email</label>
        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
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
                        <input type="text" className="form-control" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} pattern="^EMP\d+$" title="EMPXXXX" required/>
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
                        <input type="tel" className="form-control" value={contact} onChange={(e) => setContact(e.target.value)} pattern="[0-9]{10}" title="Contact must be a 10-digit number" required/>                                </div>
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
        


        </Layout>   
    );
}
