const router = require("express").Router();
let Tax = require("../models/tax");

router.route("/add").post((req,res)=>{
    const Tax_ID = req.body.Tax_ID;
    const Taxable_income = Number(req.body.Taxable_income);
    const Rate = Number(req.body.Rate);
    const Income_tax = Number(req.body.Income_tax);
    const Due_date = req.body.Due_date;
    const Date_created = req.body.Date_created;
    const Status = req.body.Status;
    const EPF_ETF = Number(req.body.EPF_ETF);
    const Total_tax = Number(req.body.Total_tax);

    const newTax = new Tax({
        Tax_ID,
        Taxable_income,
        Rate,
        Income_tax,
        Due_date,
        Date_created,
        Status,
        EPF_ETF,
        Total_tax
    })
    
    newTax.save().then(()=>{
        res.json("Tax Details Added")
    }).catch((err)=>{
        console.log(err);
    })
});

router.route("/").get((req,res)=>{
    Tax.find().then((tax)=>{
        res.json(tax)
    }).catch((err)=>{
        console.log(err)
    })
});

router.route("/update/:id").put(async (req,res)=>{
    let taxId = req.params.id;
    const { Tax_ID, Taxable_income,Rate,Income_tax,Due_date,Date_created, Status,EPF_ETF,Total_tax} = req.body;

    const updateTax = {
        Tax_ID,
        Taxable_income,
        Rate,
        Income_tax,
        Due_date,
        Date_created,
        Status,
        EPF_ETF,
        Total_tax
    }

    const update = await Tax.findByIdAndUpdate(taxId, updateTax).then(() => {
        res.status(200).send({status: "Tax report updated"})
    }).catch((errr) => {
        console.log(errr);
        res.status(500).send({status: "Error with updating data"});
    })
});

router.route("/get/:id").get(async (req, res) => {
    let taxId = req.params.id;
    try {
        const tax = await Tax.findOne({ Tax_ID: taxId });
        if (tax) {
            res.status(200).send({ status: "Tax details fetched", tax });
        } else {
            res.status(404).send({ status: "Tax not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "Error with getting tax details" });
    }
  });

  router.route("/searchtax/:month").get((req, res) => {
    const { month } = req.params;
    const query = month ? { Month: month } : {};
  
    Tax.find(query)
        .then((tax) => {
            res.json(tax);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Error fetching profit details" });
        });
  });

  //search route for tax doc
router.route("/search/:year").get((req, res) => {
    const { year } = req.params;
    
    // Construct aggregation pipeline to filter by month and year
    const pipeline = [
      {
        $addFields: {
          year: { $year: "$Date_created" } // Extract year from Date_created
        }
      },
      {
        $match: {
          year: parseInt(year) // Convert year to integer for comparison
        }
      }
    ];
  
    Tax.aggregate(pipeline)
      .then((profit) => {
        res.json(profit);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: "Error fetching tax details" });
      });
  });  

module.exports = router;