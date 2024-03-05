const router = require("express").Router();
let meetings = require("../models/meetingmodel");

router.route("/add").post((req,res)=>{
    const meeting_id = req.body.meeting_id;
    const meeting_name = req.body.meeting_name;
    const meeting_start = req.body.meeting_start;
    const meeting_end = req.body.meeting_end;
    const meeting_date = req.body.meeting_date;
    const meeting_location = req.body.meeting_location;


    const newMeeting = new meetings({
        meeting_id,
        meeting_name,
        meeting_start,
        meeting_end,
        meeting_date,
        meeting_location
    })
    
    newMeeting.save().then(()=>{
        res.json("New Meetings Added")
    }).catch((err)=>{
        console.log(err);
    })
})

router.route("/").get((req,res)=>{
    meetings.find().then((meetingmodel)=>{
        res.json(meetingmodel)
    }).catch((err)=>{
        console.log(err)
    })
})

router.route("/update/:id").put(async (req,res)=>{
    let meetId = req.params.id;
    const {meeting_id, meeting_name, meeting_start, meeting_end, meeting_date, meeting_location} = req.body;

    const updateMeetings = {
        meeting_id,
        meeting_name,
        meeting_start,
        meeting_end,
        meeting_date,
        meeting_location
    }

    const update = await meetings.findByIdAndUpdate(meetId, updateMeetings).then(() => {
        res.status(200).send({status: "Meetings updated"})
    }).catch((errr) => {
        console.log(errr);
        res.status(500).send({status: "Error with updating Meetings"});
    })
})

router.route("/delete/:id").delete(async (req,res) => {
    let meetId = req.params.id;

    await meetings.findByIdAndDelete(meetId).then(() => {
        res.status(200).send({status: "Meeting deleted"});
    }).catch((errr) => {
        console.log(errr);
        res.status(500).send({status: "Error with deleting Meeting"});
    })
})

module.exports = router;
