import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Modal, Button, Form } from 'react-bootstrap';
import Layout from '../Layout';

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [employeeData, setEmployeeData] = useState({
        employee_Id: '',
        name: { FirstName: '', LastName: '' },
        employee_NIC: '',
        employee_Contact: '',
        employee_Email: ''
    });
    const [selectAll, setSelectAll] = useState(false);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formError, setFormError] = useState({});

    useEffect(() => {
        // Fetch employees data when component mounts
        fetchEmployees();
    }, []);

    const fetchEmployees = () => {
        axios.get("http://localhost:8080/employees/")
            .then((res) => {
                setEmployees(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData({ ...employeeData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            axios.post("http://localhost:8080/employees/add", employeeData)
                .then(() => {
                    setShowModal(false);
                    fetchEmployees();
                    resetForm();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const validateForm = () => {
        let isValid = true;
        let errors = {};

        if (!employeeData.employee_Id) {
            isValid = false;
            errors.employee_Id = "Employee ID is required";
        }

        if (!employeeData.name.FirstName || !employeeData.name.LastName) {
            isValid = false;
            errors.name = "First Name and Last Name are required";
        }

        if (!employeeData.employee_NIC) {
            isValid = false;
            errors.employee_NIC = "NIC is required";
        }

        if (!employeeData.employee_Contact) {
            isValid = false;
            errors.employee_Contact = "Contact is required";
        }

        if (!employeeData.employee_Email) {
            isValid = false;
            errors.employee_Email = "Email is required";
        } else if (!isValidEmail(employeeData.employee_Email)) {
            isValid = false;
            errors.employee_Email = "Invalid email address";
        }

        setFormError(errors);
        return isValid;
    };

    const isValidEmail = (email) => {
        // Basic email validation regex
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const resetForm = () => {
        setEmployeeData({
            employee_Id: '',
            name: { FirstName: '', LastName: '' },
            employee_NIC: '',
            employee_Contact: '',
            employee_Email: ''
        });
        setFormError({});
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:8080/employees/delete/${id}`)
            .then(() => {
                fetchEmployees();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        const updatedEmployees = employees.map(emp => {
            if (!selectAll) {
                return { ...emp, selected: true };
            } else {
                return { ...emp, selected: false };
            }
        });
        setEmployees(updatedEmployees);
        setSelectedEmployees(!selectAll ? [...employees] : []);
    };

    const handleSelectEmployee = (id) => {
        const updatedEmployees = employees.map(emp => {
            if (emp._id === id) {
                return { ...emp, selected: !emp.selected };
            }
            return emp;
        });
        setEmployees(updatedEmployees);
        const selected = updatedEmployees.filter(emp => emp.selected);
        setSelectedEmployees(selected);
    };

    const handlePreview = (employee) => {
        console.log("Preview Employee:", employee);
        // Add your preview logic here
    };

    const handleDeleteSelected = () => {
        selectedEmployees.forEach(emp => {
            handleDelete(emp._id);
        });
    };

    const handleShowModal = () => {
        setShowModal(true);
        resetForm();
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    return (
        <Layout>
            <div className="container">
                <h2>All Employees</h2>
                <button onClick={handleShowModal} className="btn btn-success mb-3">Add Employee</button>
                <button onClick={handleSelectAll} className="btn btn-secondary mb-3 mx-2">{selectAll ? 'Unselect All' : 'Select All'}</button>
                <button onClick={handleDeleteSelected} className="btn btn-danger mb-3" disabled={selectedEmployees.length === 0}>Delete Selected</button>
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Employee ID</th>
                            <th>Name</th>
                            <th>NIC</th>
                            <th>Contact</th>
                            <th>Email</th>
                            <th>Action</th>
                            <th>Select</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee, index) => (
                            <tr key={employee._id}>
                                <td>{index + 1}</td>
                                <td>{employee.employee_Id}</td>
                                <td>{employee.name.FirstName} {employee.name.LastName}</td>
                                <td>{employee.employee_NIC}</td>
                                <td>{employee.employee_Contact}</td>
                                <td>{employee.employee_Email}</td>
                                <td>
                                    <button onClick={() => handleDelete(employee._id)} className="btn btn-danger">Delete</button>
                                    <button onClick={() => handlePreview(employee)} className="btn btn-dark mx-2">Preview</button>
                                </td>
                                <td>
                                    <input type="checkbox" checked={employee.selected || false} onChange={() => handleSelectEmployee(employee._id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Employee</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="employee_Id">
                                <Form.Label>Employee ID</Form.Label>
                                <Form.Control type="text" name="employee_Id" value={employeeData.employee_Id} onChange={handleChange} required />
                                {formError.employee_Id && <div className="text-danger">{formError.employee_Id}</div>}
                            </Form.Group>
                            <Form.Group controlId="FirstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control type="text" name="FirstName" value={employeeData.name.FirstName} onChange={(e) => setEmployeeData({ ...employeeData, name: { ...employeeData.name, FirstName: e.target.value } })} required />
                                {formError.name && <div className="text-danger">{formError.name}</div>}
                            </Form.Group>
                            <Form.Group controlId="LastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control type="text" name="LastName" value={employeeData.name.LastName} onChange={(e) => setEmployeeData({ ...employeeData, name: { ...employeeData.name, LastName: e.target.value } })} required />
                            </Form.Group>
                            <Form.Group controlId="employee_NIC">
                                <Form.Label>NIC</Form.Label>
                                <Form.Control type="number" name="employee_NIC" value={employeeData.employee_NIC} onChange={handleChange} required />
                                {formError.employee_NIC && <div className="text-danger">{formError.employee_NIC}</div>}
                            </Form.Group>
                            <Form.Group controlId="employee_Contact">
                                <Form.Label>Contact</Form.Label>
                                <Form.Control type="number" name="employee_Contact" value={employeeData.employee_Contact} onChange={handleChange} required />
                                {formError.employee_Contact && <div className="text-danger">{formError.employee_Contact}</div>}
                            </Form.Group>
                            <Form.Group controlId="employee_Email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" name="employee_Email" value={employeeData.employee_Email} onChange={handleChange} required />
                                {formError.employee_Email && <div className="text-danger">{formError.employee_Email}</div>}
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        </Layout>
    );
}
