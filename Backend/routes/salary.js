const router = require("express").Router();
let salary = require("../models/salary");

router.route("/add").post((req,res)=>{
    const Emp_id = req.body.Emp_id;
    const Salary = req.body.Salary;
    const Date = req.body.Date;

    const newSalary = new salary({
        Emp_id,
        Salary,
        Date
    })
    
    newSalary.save().then(()=>{
        res.json("Salary Added")
    }).catch((err)=>{
        console.log(err);
    })
});

module.exports = router;