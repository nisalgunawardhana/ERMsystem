const router = require("express").Router();
let trainees = require("../models/traineemodel");

router.route("/add").post((req,res)=>{
    const trainee_id = req.body.trainee_id;
    const trainee_name = req.body.trainee_name;
    const trainee_gender = req.body.trainee_gender;
    const trainee_contact = req.body.trainee_contact;
    const trainee_rating = req.body.trainee_rating;

    const newTrainee = new trainees({
        trainee_id,
        trainee_name,
        trainee_gender,
        trainee_contact,
        trainee_rating
    })
    
    newTrainee.save().then(()=>{
        res.json("New trainees Added")
    }).catch((err)=>{
        console.log(err);
    })
})

router.route("/").get((req,res)=>{
    trainees.find().then((traineemodel)=>{
        res.json(traineemodel)
    }).catch((err)=>{
        console.log(err)
    })
})

router.route("/update/:id").put(async (req,res)=>{
    let traineeId = req.params.id;
    const {trainee_id, trainee_name, trainee_gender, trainee_contact, trainee_rating} = req.body;

    const updateTrainees = {
        trainee_id,
        trainee_name,
        trainee_gender,
        trainee_contact,
        trainee_rating
    }

    const update = await trainees.findByIdAndUpdate(traineeId, updateTrainees).then(() => {
        res.status(200).send({status: "Trainees updated"})
    }).catch((errr) => {
        console.log(errr);
        res.status(500).send({status: "Error with updating Trainees"});
    })
})

router.route("/delete/:id").delete(async (req,res) => {
    let traineeId = req.params.id;

    await trainees.findByIdAndDelete(traineeId).then(() => {
        res.status(200).send({status: "Trainee deleted"});
    }).catch((errr) => {
        console.log(errr);
        res.status(500).send({status: "Error with deleting Trainee"});
    })
})

module.exports = router;
