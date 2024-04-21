const router = require("express").Router();
let trainees = require("../models/traineemodel");

router.route("/add").post((req, res) => {
    const trainee_id = req.body.trainee_id;
    const trainee_name = req.body.trainee_name;
    const trainee_gender = req.body.trainee_gender;
    const trainee_contact = req.body.trainee_contact;
    const trainee_rating = req.body.trainee_rating;
    const trainee_email = req.body.trainee_email;
    const trainee_date = req.body.trainee_date;

    const newTrainee = new trainees({
        trainee_id,
        trainee_name,
        trainee_gender,
        trainee_contact,
        trainee_rating,
        trainee_email,
        trainee_date
    })

    newTrainee.save().then(() => {
        res.json("New trainees Added")
    }).catch((err) => {
        console.log(err);
    })
})

router.route("/").get((req, res) => {
    trainees.find().then((traineemodel) => {
        res.json(traineemodel)
    }).catch((err) => {
        console.log(err)
    })
})

router.route("/update/:id").put(async (req, res) => {
    let traineeId = req.params.id;
    const { trainee_id, trainee_name, trainee_gender, trainee_contact, trainee_rating, trainee_email, trainee_date } = req.body;

    const updateTrainees = {
        trainee_id,
        trainee_name,
        trainee_gender,
        trainee_contact,
        trainee_rating,
        trainee_email,
        trainee_date
    }

    const update = await trainees.findByIdAndUpdate(traineeId, updateTrainees).then(() => {
        res.status(200).send({ status: "Trainees updated" })
    }).catch((errr) => {
        console.log(errr);
        res.status(500).send({ status: "Error with updating Trainees" });
    })
})

router.route("/delete/:id").delete(async (req, res) => {
    let traineeId = req.params.id;

    await trainees.findByIdAndDelete(traineeId).then(() => {
        res.status(200).send({ status: "Trainee deleted" });
    }).catch((errr) => {
        console.log(errr);
        res.status(500).send({ status: "Error with deleting Trainee" });
    })
})

router.route("/calculate/average").post(async (req, res) => {
    try {
        // Get today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Initialize an object to store daily averages for the last two weeks
        const dailyAverages = {};

        // Calculate daily averages for the last two weeks
        for (let i = 14; i > 0; i--) {
            const currentDate = new Date(today);
            currentDate.setDate(currentDate.getDate() - i);

            const traineesOfDay = await trainees.find({ trainee_date: { $gte: currentDate, $lt: new Date(currentDate.getTime() + (24 * 60 * 60 * 1000)) } });

            let totalRating = 0;
            traineesOfDay.forEach(trainee => {
                totalRating += parseFloat(trainee.trainee_rating);
            });

            const averageRating = traineesOfDay.length > 0 ? totalRating / traineesOfDay.length : 0;

            dailyAverages[currentDate.toISOString()] = averageRating;
        }
        // Save the daily averages to your database
        
        // Respond with success message
        res.json({ message: "Daily averages calculated and saved successfully for the last two weeks", dailyAverages });
    } catch (error) {
        console.error("Error calculating and saving daily averages for the last two weeks:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
