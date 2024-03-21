const router = require("express").Router();
let Tax = require("../models/tax");
const Profit = require("../models/profit");

//route to add tax details
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

//route to update tax doc
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

//route to get desired tax doc
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

  //get total profit for current year
  router.route('/profit/:year').get(async (req, res) => {
    try {
        const currentYear = parseInt(req.params.year);
        const profits = await Profit.find();

        let totalProfit = 0;

        // Iterate through profits and sum up the monthly profit for the current year
        profits.forEach((profit) => {
            // Extract the year from the Date_created field
            const dateCreated = new Date(profit.Date_created);
            const profitYear = dateCreated.getFullYear();

            // Check if the profit was created in the current year
            if (profitYear === currentYear) {
                totalProfit += profit.Monthly_profit;
            }
        });

        res.json({ totalProfit });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Function to obtain total monthly salaries
router.route("/salaries/:month").get(async (req, res) => {
    try {
        const { month } = req.params;
  
        // Convert the month name to a numeric representation (e.g., January -> 01)
        const monthNumeric = monthToNumeric(month);
  
        // Check if the month name is valid
        if (!monthNumeric) {
            return res.status(400).json({ message: "Invalid month name" });
        }
  
        // Get the current year
        const currentYear = new Date().getFullYear();
  
        // Determine the number of days in the given month
        const daysInMonth = new Date(currentYear, monthNumeric, 0).getDate();
  
        // Construct the start and end dates for the month
        const startDate = new Date(`${currentYear}-${monthNumeric}-01`);
        const endDate = new Date(`${currentYear}-${monthNumeric}-${daysInMonth}`);
  
        // Aggregate to calculate the total amount for the given month and year
        const totalSalary = await bills.aggregate([
            {
                $match: {
                    billing_date: { $gte: startDate, $lte: endDate } // Match documents with Date_created within the given month and year
                }
            },
            {
                $group: {
                    _id: null,
                    totalSalary: { $sum: "$total_amount" }
                }
            }
        ]);
  
        // Check if totalAmount array is not empty
        if (totalSalary && totalSalary.length > 0 && totalSalary[0].totalSalary !== undefined) {
            res.json({ totalSalary: totalSalary[0].totalSalary });
        } else {
            // Return a message indicating no data found for the given month
            res.status(404).json({ message: "No data found for the given month" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
  });

  //route to search for tax doc
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