const router = require("express").Router();
const mongoose = require('mongoose');
let employees = require("../models/employeemodel");

router.route("/add").post((req,res)=>{
    const employee_Id = req.body.employee_Id;
    const name = req.body.name;
    const employee_NIC = req.body.employee_NIC;
    const employee_Contact = req.body.employee_Contact;
    const employee_Email = req.body.employee_Email;


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
    })
})

router.route("/").get((req,res)=>{
    employees.find().then((employeemodel)=>{
        res.json(employeemodel)
    }).catch((err)=>{
        console.log(err)
    })
})

router.route("/update/:employee_Id").put(async (req,res)=>{
    let empid = req.params.employee_Id;
    const {employee_Id, name, employee_NIC, employee_Contact,employee_Email} = req.body;

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
})

router.route("/delete/:id").delete(async (req, res) => {
    const empId = req.params.id;

    try {
        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(empId)) {
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
    const { employeeId } = req.body;

    try {
        // Use $in operator to find and delete multiple employees by their IDs
        await Employee.deleteMany({ employee_Id: { $in: employeeId } });
        res.status(200).json({ message: 'Employees deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting employees.' });
    }
});


module.exports = router;

