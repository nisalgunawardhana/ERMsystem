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
    const Date_modified = req.body.Date_modified;
    const Status = req.body.Status;
    const Final_profit = Number(req.body.Final_profit);

    const newTax = new Tax({
        Tax_ID,
        Taxable_income,
        Rate,
        Income_tax,
        Due_date,
        Date_modified,
        Status,
        Final_profit
    })
    
    newTax.save().then(()=>{
        res.json("Tax Details Added")
    }).catch((err)=>{
        console.log(err);
    })
});

router.route("/add/check").post(async (req, res) => {
    const submittedDate = req.body.Date_modified; // Assuming Date contains the date in the format 2024-01-25T00:00:00.000+00:00
  
    // Extract the year from the submitted date
    const submittedYear = new Date(submittedDate).getFullYear();
  
    try {
      // Check if profit log already exists for the submitted month and current year
      const existingTax = await Tax.findOne({
        $expr: {
          $and: [
            { $eq: [{ $year: "$Date_modified" }, submittedYear] } // Check year
          ]
        }
      });
  
      if (existingTax) {
        // If profit log already exists, return a response indicating that it exists
        return res.status(200).json({ exists: true, message: "Tax Doc already exists", existingTax });
      } else {
        // If profit log doesn't exist, return a response indicating that it doesn't exist
        return res.status(200).json({ exists: false, message: "Tax Doc doesn't exist" });
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle database errors
      return res.status(500).json({ error: "Internal Server Error" });
    }
  
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
    const { Tax_ID, Taxable_income,Rate,Income_tax,Due_date,Date_modified, Status,Final_profit} = req.body;

    const updateTax = {
        Tax_ID,
        Taxable_income,
        Rate,
        Income_tax,
        Due_date,
        Date_modified,
        Status,
        Final_profit
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
        const currentMonth = (new Date()).getMonth() + 1; // Months are zero-based
        const startMonth = 4; // April is the 4th month
        const endMonth = 3; // March is the 3rd month
        let startYear, endYear;

        // Determine the start and end years based on the current date
        if (currentMonth >= startMonth) {
            // Current month is April or later, so the start year is the current year
            startYear = currentYear;
            endYear = currentYear + 1;
        } else {
            // Current month is before April, so the start year is the previous year
            startYear = currentYear - 1;
            endYear = currentYear;
        }

        // Adjust the start and end dates accordingly
        const startDate = new Date(startYear, startMonth - 1, 1); // Months are zero-based
        const endDate = new Date(endYear, endMonth, 0); // Last day of March

        // Fetch profits within the specified period
        const profits = await Profit.find({
            Date_modified: {
                $gte: startDate,
                $lte: endDate
            }
        });

        let totalProfit = 0;

        // Sum up the monthly profit for the fetched profits
        profits.forEach((profit) => {
            totalProfit += profit.Monthly_profit;
        });

        res.json({ totalProfit });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

/*
router.route('/profit/:year').get(async (req, res) => {
    try {
        const currentYear = parseInt(req.params.year);
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // Months are zero-based, so adding 1

        let startDate, endDate;

        // Determine the start and end dates based on the current month
        if (currentMonth >= 4 && currentMonth <= 6) {
            startDate = new Date(currentYear, 3, 1); // April 1st
            endDate = new Date(currentYear, 5, 30); // June 30th
        } else if (currentMonth >= 7 && currentMonth <= 9) {
            startDate = new Date(currentYear, 6, 1); // July 1st
            endDate = new Date(currentYear, 8, 30); // September 30th
        } else if (currentMonth >= 10 && currentMonth <= 12) {
            startDate = new Date(currentYear, 9, 1); // October 1st
            endDate = new Date(currentYear, 11, 31); // December 31st
        } else {
            // For January to March of the following year
            startDate = new Date(currentYear - 1, 0, 1); // January 1st of the previous year
            endDate = new Date(currentYear - 1, 2, 31); // March 31st of the previous year
        }

        // Fetch profits within the specified date range
        const profits = await Profit.find({
            Date_modified: { $gte: startDate, $lte: endDate }
        });

        let totalProfit = 0;

        // Sum up the monthly profit for the fetched profits
        profits.forEach((profit) => {
            totalProfit += profit.Monthly_profit;
        });

        res.json({ totalProfit });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});
*/

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
          year: { $year: "$Date_modified" } // Extract year from Date_created
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

  router.route("/getId/latest").get(async (req, res) => {
    try {
        // Find the latest document in the collection
        const latestTax = await Tax.findOne().sort({ Tax_ID: -1 });
        // Extract the numeric part of the latest Tax ID and increment it by one
        let nextNumericPart = 1;
        if (latestTax) {
            const numericPart = parseInt(latestTax.Tax_ID.substring(1)); // Extract numeric part after 'OE'
            nextNumericPart = numericPart + 1;
        }
        // Format the next ID
        const nextId = `T${nextNumericPart.toString().padStart(2, '0')}`; // Ensure the numeric part has leading zeros if necessary
        res.json({ nextId });
    } catch (error) {
        console.error("Error fetching next Tax ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;