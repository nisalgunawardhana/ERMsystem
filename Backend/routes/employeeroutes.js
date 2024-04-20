const router = require("express").Router();
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

router.route("/delete/:id").delete(async (req,res) => {
    let empid = req.params.id;

    await employees.findByIdAndDelete(empid).then(() => {
        res.status(200).send({status: "Employee deleted"});
    }).catch((errr) => {
        console.log(errr);
        res.status(500).send({status: "Error with deleting employee"});
    })
})

module.exports = router;

