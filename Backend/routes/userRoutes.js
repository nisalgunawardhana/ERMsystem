const router = require("express").Router();
let SystemUser = require("../models/usermodel");

router.route("/add").post((req,res)=>{
    const userId = req.body.userId;
    const empId = req.body.empId;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const nic = req.body.nic;
    const username = req.body.username;
    const password = req.body.password;
    const userRole = req.body.userRole;
    const isActive = req.body.isActive;
    const createdDate = req.body.createdDate;

    const newUser = new SystemUser({
        userId,
        empId,
        first_name,
        last_name,
        nic,
        username,
        password,
        userRole,
        isActive,
        createdDate
    })
    
    newUser.save().then(()=>{
        res.json("New User Added")
    }).catch((err)=>{
        console.log(err);
    })
})

router.route("/").get((req,res)=>{
    SystemUser.find().then((usermodel)=>{
        res.json(usermodel)
    }).catch((err)=>{
        console.log(err)
    })
})

router.route("/update/:id").put(async (req,res)=>{
    let sysuserId = req.params.id;  //check*****
    const {userId,empId,first_name,last_name,nic,username,password,userRole,isActive,createdDate} = req.body;

    const updateUsers = {
        userId,
        empId,
        first_name,
        last_name,
        nic,
        username,
        password,
        userRole,
        isActive,
        createdDate
    }

    const update = await SystemUser.findByIdAndUpdate(sysuserId, updateUsers).then(() => {
        res.status(200).send({status: "User updated"})
    }).catch((errr) => {
        console.log(errr);
        res.status(500).send({status: "Error with updating users"});
    })
})

router.route("/delete/:id").delete(async (req,res) => {
    let sysuserId = req.params.id;

    await SystemUser.findByIdAndDelete(sysuserId).then(() => {
        res.status(200).send({status: "User deleted"});
    }).catch((errr) => {
        console.log(errr);
        res.status(500).send({status: "Error with deleting user"});
    })
})

module.exports = router;
