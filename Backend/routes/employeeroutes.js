const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
let employees = require("../models/employeemodel");
const { 
    sanitizeReqBody, 
    sanitizeParams, 
    sanitizeObjectId,
    sanitizeInput,
    sanitizeMiddleware,
    strictSanitize 
} = require("../middlewares/inputSanitizer");

// Apply sanitization middleware to all routes
router.use(sanitizeMiddleware);

router.route("/add").post((req,res)=>{
    try {
        // Sanitize request body to prevent NoSQL injection
        const sanitizedBody = sanitizeReqBody(req.body);
        
        const employee_Id = sanitizedBody.employee_Id;
        const name = sanitizedBody.name;
        const employee_NIC = sanitizedBody.employee_NIC;
        const employee_Contact = sanitizedBody.employee_Contact;
        const employee_Email = sanitizedBody.employee_Email;

        // Validate required fields
        if (!employee_Id || !name || !employee_NIC || !employee_Contact || !employee_Email) {
            return res.status(400).json({error: "All fields are required"});
        }

        const newEmployee = new employees({
            employee_Id,
            name,
            employee_NIC,
            employee_Contact,
            employee_Email
        })
        
        newEmployee.save().then(()=>{
            res.json("New employee Added")
        }).catch((err)=>{
            console.log(err);
            res.status(500).json({error: "Error adding employee"});
        })
    } catch (error) {
        console.error("Error in add employee route:", error);
        res.status(500).json({error: "Server error"});
    }
})

router.route("/").get((req,res)=>{
    employees.find().then((employeemodel)=>{
        res.json(employeemodel)
    }).catch((err)=>{
        console.log(err)
    })
})

router.route("/update/:employee_Id").put(async (req,res)=>{
    try {
        // Sanitize URL parameters
        const sanitizedParams = sanitizeParams(req.params);
        const empid = sanitizeObjectId(sanitizedParams.employee_Id);
        
        if (!empid) {
            return res.status(400).json({status: "Invalid employee ID"});
        }

        // Sanitize request body to prevent NoSQL injection
        const sanitizedBody = sanitizeReqBody(req.body);
        const {employee_Id, name, employee_NIC, employee_Contact, employee_Email} = sanitizedBody;

        // Validate required fields
        if (!employee_Id || !name || !employee_NIC || !employee_Contact || !employee_Email) {
            return res.status(400).json({status: "All fields are required"});
        }

        const updateEmployee = {
            employee_Id,
            name,
            employee_NIC,
            employee_Contact,
            employee_Email
        }

        const update = await employees.findByIdAndUpdate(empid, updateEmployee).then(() => {
            res.status(200).send({status: "Employee updated"})
        }).catch((errr) => {
            console.log(errr);
            res.status(500).send({status: "Error with updating Employee"});
        })
    } catch (error) {
        console.error("Error in update employee route:", error);
        res.status(500).json({status: "Server error"});
    }
})

router.route("/delete/:id").delete(async (req, res) => {
    try {
        // Sanitize URL parameters
        const sanitizedParams = sanitizeParams(req.params);
        const empId = sanitizeObjectId(sanitizedParams.id);

        // Check if the provided ID is valid after sanitization
        if (!empId) {
            return res.status(400).json({ status: "Invalid employee ID" });
        }

        // Delete the employee document by its ObjectId
        await employees.findByIdAndDelete(empId);
        
        res.status(200).json({ status: "Employee deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "Error deleting employee" });
    }
});

router.delete('/deleteMultiple', async (req, res) => {
    try {
        // Sanitize request body to prevent NoSQL injection
        const sanitizedBody = sanitizeReqBody(req.body);
        const { employeeId } = sanitizedBody;

        // Validate that employeeId is an array
        if (!Array.isArray(employeeId) || employeeId.length === 0) {
            return res.status(400).json({ error: 'Invalid employee ID array' });
        }

        // Sanitize each employee ID in the array
        const sanitizedEmployeeIds = employeeId.map(id => sanitizeInput(id)).filter(id => id);

        if (sanitizedEmployeeIds.length === 0) {
            return res.status(400).json({ error: 'No valid employee IDs provided' });
        }

        // Use $in operator with sanitized IDs to find and delete multiple employees
        await employees.deleteMany({ employee_Id: { $in: sanitizedEmployeeIds } });
        res.status(200).json({ message: 'Employees deleted successfully.' });
    } catch (error) {
        console.error("Error in deleteMultiple route:", error);
        res.status(500).json({ error: 'An error occurred while deleting employees.' });
    }
});

// Example routes with enhanced protection
router.get('/search', async (req, res) => {
    try {
        // Query is already sanitized by middleware
        const employees = await Employee.find(req.query);
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const sanitizedId = sanitizeObjectId(req.params.id);
        if (!sanitizedId) {
            return res.status(400).json({ error: 'Invalid employee ID' });
        }
        
        const employee = await Employee.findById(sanitizedId);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        
        res.json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// For authentication routes, use strict sanitization
router.post('/login', async (req, res) => {
    try {
        const sanitizedBody = strictSanitize(req.body);
        // Process login with sanitized data
        // ...existing login logic...
    } catch (error) {
        res.status(400).json({ error: 'Invalid login data' });
    }
});

module.exports = router;

