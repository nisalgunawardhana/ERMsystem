const router = require("express").Router();
const bills = require("../models/billlingmodel");
const otherexpenses = require("../models/expensemodel");
let Profit = require("../models/profit");

router.route("/add").post((req, res) => {
  const Profit_ID = req.body.Profit_ID;
  const Month = req.body.Month;
  const Sales_income = req.body.Sales_income;
  const Supplier_expenses = req.body.Supplier_expenses;
  const Salaries = req.body.Salaries;
  const Other_expenses = req.body.Other_expenses;
  const Monthly_profit = req.body.Monthly_profit;
  const Date_created = req.body.Date_created;
  const Description = req.body.Description;

  const newProfit = new Profit({
    Profit_ID,
    Month,
    Sales_income,
    Supplier_expenses,
    Salaries,
    Other_expenses,
    Monthly_profit,
    Date_created,
    Description
  })

  newProfit.save().then(() => {
    res.json("Profit Details Added")
  }).catch((err) => {
    console.log(err);
  })
})

router.route("/").get((req,res)=>{
  Profit.find().then((profit)=>{
      res.json(profit)
  }).catch((err)=>{
      console.log(err)
  })
})

router.route("/search/:month").get((req, res) => {
  const { month } = req.params;
  const query = month ? { Month: month } : {};

  Profit.find(query)
      .then((profit) => {
          res.json(profit);
      })
      .catch((err) => {
          console.log(err);
          res.status(500).json({ error: "Error fetching profit details" });
      });
});

router.route("/year").get((req, res) => {
  const currentYear = new Date().getFullYear();

  Profit.aggregate([
      {
          $addFields: {
              year: { $year: "$Date_created" }
          }
      },
      {
          $match: { year: currentYear }
      }
  ]).then((profit) => {
      res.json(profit);
  }).catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
  });
});

router.route("/lastyear").get((req, res) => {
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  Profit.aggregate([
      {
          $addFields: {
              year: { $year: "$Date_created" }
          }
      },
      {
          $match: { year: lastYear }
      }
  ]).then((profit) => {
      res.json(profit);
  }).catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
  });
});

router.route("/update/:id").put(async (req, res) => {
  let profitId = req.params.id;
  const { Profit_ID, Month, Sales_income, Supplier_expenses, Salaries, Other_expenses, Monthly_profit, Date_created, Description } = req.body;

  const updateProfit = {
    Profit_ID,
    Month,
    Sales_income,
    Supplier_expenses,
    Salaries,
    Other_expenses,
    Monthly_profit,
    Date_created,
    Description
  }

  const update = await Profit.findByIdAndUpdate(profitId, updateProfit).then(() => {
    res.status(200).send({ status: "Profit details updated" })
  }).catch((errr) => {
    console.log(errr);
    res.status(500).send({ status: "Error with updating data" });
  })
})


router.route("/get/:id").get(async (req, res) => {
  let profitId = req.params.id;
  try {
      const profit = await Profit.findOne({ Profit_ID: profitId });
      if (profit) {
          res.status(200).send({ status: "Profit details fetched", profit });
      } else {
          res.status(404).send({ status: "Profit not found" });
      }
  } catch (error) {
      console.error(error);
      res.status(500).send({ status: "Error with getting Profit details" });
  }
});


router.route("/:month").get(async (req, res) => {
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
      const totalAmount = await bills.aggregate([
          {
              $match: {
                  billing_date: { $gte: startDate, $lte: endDate } // Match documents with Date_created within the given month and year
              }
          },
          {
              $group: {
                  _id: null,
                  totalAmount: { $sum: "$total_amount" }
              }
          }
      ]);

      // Check if totalAmount array is not empty
      if (totalAmount && totalAmount.length > 0 && totalAmount[0].totalAmount !== undefined) {
          res.json({ totalAmount: totalAmount[0].totalAmount });
      } else {
          // Return a message indicating no data found for the given month
          res.status(404).json({ message: "No data found for the given month" });
      }
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
  }
});

// Function to convert month name to numeric representation
function monthToNumeric(month) {
  const monthMap = {
      "January": "01",
      "February": "02",
      "March": "03",
      "April": "04",
      "May": "05",
      "June": "06",
      "July": "07",
      "August": "08",
      "September": "09",
      "October": "10",
      "November": "11",
      "December": "12"
  };
  return monthMap[month];
}

router.route("/other/:month").get(async (req, res) => {
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
      const totalOther = await otherexpenses.aggregate([
          {
              $match: {
                  Date: { $gte: startDate, $lte: endDate } // Match documents with Date_created within the given month and year
              }
          },
          {
              $group: {
                  _id: null,
                  totalOther: { $sum: "$Cost" }
              }
          }
      ]);

      // Check if totalAmount array is not empty
      if (totalOther && totalOther.length > 0 && totalOther[0].totalOther !== undefined) {
          res.json({ totalOther: totalOther[0].totalOther });
      } else {
          // Return a message indicating no data found for the given month
          res.status(404).json({ message: "No data found for the given month" });
      }
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
  }
});

// Function to convert month name to numeric representation
function monthToNumeric(month) {
  const monthMap = {
      "January": "01",
      "February": "02",
      "March": "03",
      "April": "04",
      "May": "05",
      "June": "06",
      "July": "07",
      "August": "08",
      "September": "09",
      "October": "10",
      "November": "11",
      "December": "12"
  };
  return monthMap[month];
}

router.route("/get/bills/total").get(async (req,res) => {
  try {
      const totalAmount = await bills.aggregate([
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$total_amount" }
          }
        }
      ]);
      res.json({ totalAmount: totalAmount[0].totalAmount });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
})


module.exports = router;