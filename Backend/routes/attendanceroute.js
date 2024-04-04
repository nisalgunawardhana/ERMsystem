// attendanceRoutes.js

const router = require("express").Router();
const Attendance = require("../models/attendancemodel");
const employees = require("../models/employeemodel"); // Import employee model

// Route to add attendance
router.route("/add").post(async (req, res) => {
    const  employee_Id = req.body.employee_Id;

    try {
        // Check if employee with given ID exists
        const employee = await employees.findOne({employee_Id :employee_Id});
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        // Create new attendance record
        const newAttendance = new Attendance({ employee_Id });

        // Save attendance record
        await newAttendance.save();
        res.json("Attendance added successfully");
    } catch (error) {
        console.error("Error adding attendance:", error);
        res.status(500).json({ error: "Failed to add attendance" });
    }
});


module.exports = router;
