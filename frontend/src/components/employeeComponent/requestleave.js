import React, { useState } from "react";
import axios from "axios";
import { Layout } from "antd";

const LeaveRequestForm = () => {
  const [employee_Id, setEmployeeId] = useState("");
  const [fromdate, setFromDate] = useState("");
  const [todate, setToDate] = useState("");
  const [desription, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/leave/leaverequest", {
        employee_Id,
        fromdate,
        todate,
        desription,
      });
      
      
      setMessage("Leave requested successfully!");

      setEmployeeId('');
      setFromDate('');
      setToDate('');
      setDescription('');
      
      setTimeout(() => {
        setMessage("");
      }, 5000);

    } catch (error) {
      console.error(error);
      setMessage("Failed to request leave");
    }
  };

  return (
    <Layout>
      <div className="container mt-5">
        <h2>Leave Request Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="employeeId" className="form-label">
              Employee ID
            </label>
            <input
              type="text"
              className="form-control"
              id="employeeId"
              value={employee_Id}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="fromDate" className="form-label">
              From Date
            </label>
            <input
              type="date"
              className="form-control"
              id="fromDate"
              value={fromdate}
              onChange={(e) => setFromDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="toDate" className="form-label">
              To Date
            </label>
            <input
              type="date"
              className="form-control"
              id="toDate"
              value={todate}
              onChange={(e) => setToDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description"
              value={desription}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          {message && <div className="mt-3">{message}</div>}
        </form>
      </div>
    </Layout>
  );
};

export default LeaveRequestForm;
