const router = require("express").Router();
const salary = require("../models/salary");

// Route to create a new salary entry
router.post("/createSalary", async (req, res) => {
    const { Emp_id, attendance, Salary, Date } = req.body;

    try {
        const newSalary = new salary({
            Emp_id,
            attendance,
            Salary,
            Date
        });

        newSalary.save().then(() => {
            res.json("New Salary Added");
        }).catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Internal Server Error" }); // Handle error
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route to get all salary entries
router.get("/getAllSalaries", async (req, res) => {
    try {
        const salaries = await salary.find();
        res.json(salaries);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route to get a specific salary entry by ID
router.get("/getSalaryById/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const salary = await salary.findById(id);
        if (!salary) {
            return res.status(404).json({ message: "Salary not found" });
        }
        res.json(salary);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route to update a salary entry by ID
router.put("/updateSalary/:id", async (req, res) => {
    const { id } = req.params;
    const { Emp_id, attendance, Salary, Date } = req.body;

    try {
        const updatedSalary = await salary.findByIdAndUpdate(
            id,
            { Emp_id, attendance, Salary, Date },
            { new: true }
        );
        if (!updatedSalary) {
            return res.status(404).json({ message: "Salary not found" });
        }
        res.json(updatedSalary);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route to delete a salary entry by ID
router.delete("/deleteSalary/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedSalary = await salary.findByIdAndDelete(id);
        if (!deletedSalary) {
            return res.status(404).json({ message: "Salary not found" });
        }
        res.json({ message: "Salary deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
