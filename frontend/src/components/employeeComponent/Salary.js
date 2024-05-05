import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../Layout';

const AddSalaryForm = () => {
    const [formData, setFormData] = useState({
        Emp_id: '',
        attendance: '',
        Salary: '',
        Date: ''
    });
    const [salaries, setSalaries] = useState([]);

    useEffect(() => {
        fetchSalaries();
    }, []);

    const fetchSalaries = async () => {
        try {
            const response = await axios.get('http://localhost:8080/salary/getAllSalaries');
            setSalaries(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/salary/createSalary', formData);
            alert('New Salary Added');
            setFormData({
                Emp_id: '',
                attendance: '',
                Salary: '',
                Date: ''
            });
            fetchSalaries();
        } catch (error) {
            console.error('Error:', error);
            alert('Error adding salary. Please try again.');
        }
        if (formData.Salary < 0) {
            alert('Salary cannot be negative. Please enter a valid salary amount.');
            return;
        }

    };

    

    return (
        <Layout>
            <div className="container">
                <div className="card">
                    <div className="card-body">
                        <h2 className="card-title">Add New Salary</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Employee ID:</label>
                                <input type="text" name="Emp_id" value={formData.Emp_id} onChange={handleChange} className="form-control" required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Attendance:</label>
                                <input type="number" name="attendance" value={formData.attendance} onChange={handleChange} className="form-control" required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Salary:</label>
                                <input type="number" name="Salary" value={formData.Salary} onChange={handleChange} className="form-control" required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Date:</label>
                                <input type="date" name="Date" value={formData.Date} onChange={handleChange} className="form-control" required />
                            </div>

                            <button type="submit" className="btn btn-primary">Add Salary</button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="container mt-4">
                <h2>Added Salaries</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>Attendance</th>
                            <th>Salary</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salaries.map((salary) => (
                            <tr key={salary._id}>
                                <td>{salary.Emp_id}</td>
                                <td>{salary.attendance}</td>
                                <td>{salary.Salary}</td>
                                <td>{new Date(salary.Date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default AddSalaryForm;
