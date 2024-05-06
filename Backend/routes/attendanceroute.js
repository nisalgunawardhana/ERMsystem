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

router.get("/employeeIds/:date", async (req, res) => {
    const { date } = req.params;

    try {
        // Parse the date string into a JavaScript Date object
        const queryDate = new Date(date);

        // Set the query date to start of day and end of day
        queryDate.setHours(0, 0, 0, 0);
        const endDate = new Date(queryDate);
        endDate.setHours(23, 59, 59, 999);

        // Query attendance records for the specified date
        const attendanceRecords = await Attendance.find({ date: { $gte: queryDate, $lte: endDate } });

        // Extract unique employee IDs from attendance records
        const employeeIds = Array.from(new Set(attendanceRecords.map(record => record.employee_Id)));

        res.json(employeeIds);
    } catch (error) {
        console.error("Error fetching employee IDs:", error);
        res.status(500).json({ error: "Failed to fetch employee IDs" });
    }
});

router.get("/employeeIds/:date", async (req, res) => {
    const { date } = req.params;

    try {
        // Parse the date string into a JavaScript Date object
        const queryDate = new Date(date);

        // Set the query date to start of day and end of day
        queryDate.setHours(0, 0, 0, 0);
        const endDate = new Date(queryDate);
        endDate.setHours(23, 59, 59, 999);

        // Query attendance records for the specified date
        const attendanceRecords = await Attendance.find({ date: { $gte: queryDate, $lte: endDate } });

        // Extract unique employee IDs and corresponding dates from attendance records
        const employeeData = attendanceRecords.map(record => ({ employeeId: record.employee_Id, date: record.date }));

        res.json(employeeData);
    } catch (error) {
        console.error("Error fetching employee IDs:", error);
        res.status(500).json({ error: "Failed to fetch employee IDs" });
    }
});




module.exports = router;
