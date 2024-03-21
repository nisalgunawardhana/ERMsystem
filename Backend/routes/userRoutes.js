const router = require("express").Router();
let SystemUser = require("../models/usermodel");

//create
//arrow function in js?
router.route("/add").post((req,res)=>{
    
    const empId = Number(req.body.empId);
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const nic = req.body.nic;
    const username = req.body.username;
    const password = req.body.password;
    const userRole = req.body.userRole;
    const isActive = req.body.isActive;
    const createdDate = req.body.createdDate;

    const newUser = new SystemUser({
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
        res.json("New System User Added")
    }).catch((err)=>{
        console.log(err);   //error handling
    })
})

//read
router.route("/").get((req,res)=>{
    SystemUser.find().then((usermodel)=>{
        res.json(usermodel)
    }).catch((err)=>{   //error handling
        console.log(err)
    })
})

//update
//async await -- increase responsiveness
router.route("/update/:id").put(async (req,res)=>{
    let sysuserId = req.params.id;  

    //destructure
    const {empId,first_name,last_name,nic,username,password,userRole,isActive,createdDate} = req.body;

    const updateUser = {
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

    const update = await SystemUser.findByIdAndUpdate(sysuserId, updateUser).then(() => {
        res.status(200).send({status: "User updated"})
    }).catch((errr) => {    //error handling
        console.log(errr);
        res.status(500).send({status: "Error with updating users"});
        //500 -- server error
    })
})

//delete
router.route("/delete/:id").delete(async (req,res) => {
    let sysuserId = req.params.id;

    await SystemUser.findByIdAndDelete(sysuserId).then(() => {
        res.status(200).send({status: "User deleted"});
    }).catch((errr) => {    //error handling
        console.log(errr);
        res.status(500).send({status: "Error with deleting user"});
    })
})


//viewing one user -- user profile
router.route("/get/:id").get(async(req,res) => {
    let sysuserId = req.params.id;
    await SystemUser.findById(sysuserId).then((user) => {
        res.status(200).send({status : "User fetched", user})
    }).catch(() => {
        console.log(err.message);
        res.status(500).send({status: "Error with get user", error: err.message});
    })
})


module.exports = router;
