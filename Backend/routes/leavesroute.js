const router = require("express").Router();
let Leaves = require("../models/leavesmodel");


router.post("/leaverequest", async (req, res) => {
    const { employee_Id, fromdate, todate, desription } = req.body; 

    try {
        const newrequest = new Leaves({ 
            employee_Id,
            fromdate,
            todate,
            desription 
        });

        const request = await newrequest.save(); 

        res.send("Requested Successfully!");
    } catch (error) {
        return res.status(400).json({ error });
    }
});

//get all leaves
router.get("/getallleaves",async(req,res)=>{

    try {
        const leaves = await Leaves.find()
        return res.json(leaves);
    } catch (error) {
        return res.status(400).json({massage : error})
    }
});

//cancel leaves
router.post("/cancelrequest",async (req,res)=>{

    const {requestid }=req.body

    try {
        
        const leaverequest=await Leaves.findOne({_id : requestid})
        leaverequest.status='Dissapproved'
        await leaverequest.save()

        res.send("Leave request dissaproved successfully")

    } catch (error) {
        
        return res.status(400).json({error});
    }
})

//approve leaves
router.post("/approverequest",async (req,res)=>{

    const {requestid }=req.body

    try {
        
        const leaverequest=await Leaves.findOne({_id : requestid})
        leaverequest.status='Approved'
        await leaverequest.save()

        res.send("Leave request approved successfully")

    } catch (error) {
        
        return res.status(400).json({error});
    }
})

router.post("/getleaverequestedbyuserid", async (req, res) => {
    const { employee_Id } = req.body;
    try {
        const leaves = await Leaves.find({ userid: employee_Id });
        res.json(leaves);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//Get counts of different statuses
router.get("/statuscounts", async (req, res) => {
    try {
        const pendingCount = await Leaves.countDocuments({ status: 'Pending' });
        const approvedCount = await Leaves.countDocuments({ status: 'Approved' });
        const disapprovedCount = await Leaves.countDocuments({ status: 'Dissapproved' });

        const totalCount = pendingCount + approvedCount + disapprovedCount;

        const pendingPercentage = (pendingCount / totalCount) * 100;
        const approvedPercentage = (approvedCount / totalCount) * 100;
        const disapprovedPercentage = (disapprovedCount / totalCount) * 100;

        res.json({
            pending: {
                count: pendingCount,
                percentage: pendingPercentage.toFixed(2),
            },
            approved: {
                count: approvedCount,
                percentage: approvedPercentage.toFixed(2),
            },
            disapproved: {
                count: disapprovedCount,
                percentage: disapprovedPercentage.toFixed(2),
            },
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


//Backend API - Get counts of pending and approved requests for a specific user
router.get("/leaverequestcounts/:userid", async (req, res) => {
    const { employee_Id } = req.params;

    try {
        const pendingCount = await Leaves.countDocuments({employee_Id, status: 'Pending' });
        const approvedCount = await Leaves.countDocuments({employee_Id, status: 'Approved' });

        res.json({
            employee_Id,
            pending: pendingCount,
            approved: approvedCount,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



module.exports = router;