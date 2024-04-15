// attendanceRoutes.js

const router = require("express").Router();
const Attendance = require("../models/attendancemodel");
const employees = require("../models/employeemodel"); // Import employee model


router.get("/", async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find();
        res.json(attendanceRecords);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch attendance records" });
    }
});

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


// Route to update attendance
router.put("/update/:id", async (req, res) => {
    const { employee_Id } = req.body;

    try {
        const updatedAttendance = await Attendance.findByIdAndUpdate(req.params.id, { employee_Id }, { new: true });
        res.json(updatedAttendance);
    } catch (error) {
        res.status(500).json({ error: "Failed to update attendance record" });
    }
});

// Route to delete attendance
router.delete("/delete/:id", async (req, res) => {
    try {
        await Attendance.findByIdAndDelete(req.params.id);
        res.json({ message: "Attendance record deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete attendance record" });
    }
});





module.exports = router;
