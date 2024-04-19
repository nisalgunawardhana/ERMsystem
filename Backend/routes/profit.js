const router = require("express").Router();
const bills = require("../models/billlingmodel");
const otherexpenses = require("../models/expensemodel");
const pos = require("../models/purchaseOrdermodel");
const salary = require("../models/salary");
const tax = require("../models/tax");
let Profit = require("../models/profit");

//route for adding profit log
router.route("/add").post((req, res) => {
  const Profit_ID = req.body.Profit_ID;
  const Month = req.body.Month;
  const Sales_income = req.body.Sales_income;
  const Supplier_expenses = req.body.Supplier_expenses;
  const Salaries = req.body.Salaries;
  const Other_expenses = req.body.Other_expenses;
  const EPF_ETF = req.body.EPF_ETF;
  const Monthly_profit = req.body.Monthly_profit;
  const Date_modified = req.body.Date_modified;
  const Description = req.body.Description;

  const newProfit = new Profit({
    Profit_ID,
    Month,
    Sales_income,
    Supplier_expenses,
    Salaries,
    EPF_ETF,
    Other_expenses,
    Monthly_profit,
    Date_modified,
    Description
  })

  newProfit.save().then(() => {
    res.json("Profit Details Added")
  }).catch((err) => {
    console.log(err);
  })
});

router.route("/add/check").post(async (req, res) => {
  const submittedDate = req.body.Date_modified; // Assuming Date contains the date in the format 2024-01-25T00:00:00.000+00:00

  // Extract the month and year from the submitted date
  const submittedMonth = new Date(submittedDate).getMonth() + 1; // Add 1 because getMonth() returns zero-based index
  const submittedYear = new Date(submittedDate).getFullYear();

  try {
    // Check if profit log already exists for the submitted month and current year
    const existingProfit = await Profit.findOne({
      $expr: {
        $and: [
          { $eq: [{ $month: "$Date_modified" }, submittedMonth] }, // Check month
          { $eq: [{ $year: "$Date_modified" }, submittedYear] } // Check year
        ]
      }
    });

    if (existingProfit) {
      // If profit log already exists, return a response indicating that it exists
      return res.status(200).json({ exists: true, message: "Profit Log already exists", existingProfit });
    } else {
      // If profit log doesn't exist, return a response indicating that it doesn't exist
      return res.status(200).json({ exists: false, message: "Profit Log doesn't exist" });
    }
  } catch (error) {
    console.error("Error:", error);
    // Handle database errors
    return res.status(500).json({ error: "Internal Server Error" });
  }

});

router.route("/").get((req, res) => {
  Profit.find().then((profit) => {
    res.json(profit)
  }).catch((err) => {
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

//search route for profit log
router.route("/search/:month/:year").get((req, res) => {
  const { month, year } = req.params;

  // Construct aggregation pipeline to filter by month and year
  const pipeline = [
    {
      $addFields: {
        year: { $year: "$Date_modified" } // Extract year from Date_created
      }
    },
    {
      $match: {
        Month: month,
        year: parseInt(year) // Convert year to integer for comparison
      }
    }
  ];

  Profit.aggregate(pipeline)
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
        year: { $year: "$Date_modified" }
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
        year: { $year: "$Date_modified" }
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
  const { Profit_ID, Month, Sales_income, Supplier_expenses, Salaries, Other_expenses, EPF_ETF, Monthly_profit, Date_modified, Description } = req.body;

  const updateProfit = {
    Profit_ID,
    Month,
    Sales_income,
    Supplier_expenses,
    Salaries,
    Other_expenses,
    EPF_ETF,
    Monthly_profit,
    Date_modified,
    Description
  }

  const update = await Profit.findByIdAndUpdate(profitId, updateProfit).then(() => {
    res.status(200).send({ status: "Profit details updated" })
  }).catch((errr) => {
    console.log(errr);
    res.status(500).send({ status: "Error with updating data" });
  })
})

//route to get profit log for latest month
router.route("/get/profitlog").get(async (req, res) => {
  const currentDate = new Date();
  let currentMonth = currentDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based index
  let currentYear = currentDate.getFullYear();

  try {
    // Try to find profit details for the current month and year
    let profit = await Profit.aggregate([
      {
        $project: {
          month: { $month: "$Date_modified" },
          year: { $year: "$Date_modified" },
          profit: "$$ROOT"
        }
      },
      {
        $match: {
          month: currentMonth,
          year: currentYear
        }
      },
      { $sort: { "profit.Date_modified": -1 } },
      { $limit: 1 }
    ]);

    // If profit details for the current month and year are not found, try the previous month
    if (profit.length === 0 && currentMonth > 1) {
      currentMonth--; // Decrement month
    } else if (profit.length === 0 && currentMonth === 1) {
      currentMonth = 12; // Set month to December
      currentYear--; // Decrement year
    }

    // Try to find profit details for the previous month
    profit = await Profit.aggregate([
      {
        $project: {
          month: { $month: "$Date_modified" },
          year: { $year: "$Date_modified" },
          profit: "$$ROOT"
        }
      },
      {
        $match: {
          month: currentMonth,
          year: currentYear
        }
      },
      { $sort: { "profit.Date_modified": -1 } },
      { $limit: 1 }
    ]);

    if (profit.length > 0) {
      res.status(200).send({ status: "Profit details fetched", profit: profit[0].profit });
    } else {
      res.status(404).send({ status: "Profit not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "Error with getting Profit details" });
  }
});

//route to fetch newly added profit log
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

router.route("/gett/:id").get(async (req, res) => {
  let profitId = req.params.id;
  const profit = await Profit.findById(profitId).then((profit) => {
    res.status(200).send({ status: "Profit log fetched", profit })
  }).catch((errr) => {
    console.log(errr);
    res.status(500).send({ status: "Error with getting Profit log" });
  })
})

//Function to obtain total monthly sales
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

//Function to obtain total monthly supplier expenses
router.route("/supplier/:month").get(async (req, res) => {
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
    const totalSupp = await pos.aggregate([
      {
        $match: {
          order_date: { $gte: startDate, $lte: endDate } // Match documents with Date_created within the given month and year
        }
      },
      {
        $group: {
          _id: null,
          totalSupp: { $sum: "$total_order_amount" }
        }
      }
    ]);

    // Check if totalAmount array is not empty
    if (totalSupp && totalSupp.length > 0 && totalSupp[0].totalSupp !== undefined) {
      res.json({ totalSupp: totalSupp[0].totalSupp });
    } else {
      // Return a message indicating no data found for the given month
      res.status(404).json({ message: "No data found for the given month" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

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
};

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
    const totalSalary = await salary.aggregate([
      {
        $match: {
          Date: { $gte: startDate, $lte: endDate } // Match documents with Date_created within the given month and year
        }
      },
      {
        $group: {
          _id: null,
          totalSalary: { $sum: "$Salary" }
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

// Function to convert month name to numeric and obtain total monthly other expenses
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

router.route("/get/bills/total").get(async (req, res) => {
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
});

router.route('/epfetf/:month').post(async (req, res) => {
  try {
    const { month } = req.params;

    // Map month names to month numbers
    const monthMap = {
      'January': 1,
      'February': 2,
      'March': 3,
      'April': 4,
      'May': 5,
      'June': 6,
      'July': 7,
      'August': 8,
      'September': 9,
      'October': 10,
      'November': 11,
      'December': 12
    };

    // Get the corresponding month number from the month name
    const monthNumber = monthMap[month];

    if (!monthNumber) {
      return res.status(400).json({ message: 'Invalid month' });
    }

    // Get the current year
    const currentYear = new Date().getFullYear();

    // Find employees for the specified month and current year
    const employees = await salary.aggregate([
      {
        $addFields: {
          month: { $month: { $toDate: '$Date' } },
          year: { $year: { $toDate: '$Date' } }
        }
      },
      {
        $match: {
          month: monthNumber,
          year: currentYear
        }
      }
    ]);

    let totalEPF = 0;
    let totalETF = 0;
    let total = 0;

    for (const employee of employees) {
      const employeeId = employee._id;
      // Calculate EPF and ETF
      const epf = employee.Salary * 0.08; // 8% EPF
      const epf2 = employee.Salary * 0.12; //12% from employer
      const etf = employee.Salary * 0.03; // 3% ETF

      totalEPF += epf + epf2;
      totalETF += etf;

      // Deduct EPF from salary
      const updatedSalary = employee.Salary - epf;

      // Update Salary
      await salary.updateOne(
        { _id: employeeId },
        { $set: { Salary: updatedSalary } },
        { upsert: true }
      );
    }

    total = totalEPF + totalETF;
    res.status(200).json({ message: 'Salary updated successfully', totalEPF, totalETF, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.route("/get/profit/average").get(async (req, res) => {
  try {
    // Get the current date
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // Calculate the start and end dates of the current year
    const startDate = new Date(currentYear, 0, 1); // January 1st of the current year
    const endDate = new Date(currentYear, 11, 31); // December 31st of the current year

    const monthlyProfit = await Profit.aggregate([
      {
        $match: {
          // Filter profit for the current year only
          Date_modified: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $month: "$Date_modified" }, // Group by month
          totalAmount: { $sum: "$Monthly_profit" }
        }
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          totalAmount: 1
        }
      },
      {
        $sort: { month: 1 } // Sort by month
      }
    ]);

    // Calculate average monthly expenses
    const totalMonths = currentDate.getMonth() + 1; // Get the current month (zero-based index)
    let totalProfit = 0;
    monthlyProfit.forEach(month => {
      totalProfit += month.totalAmount;
    });
    const averageMonthlyProfit = totalProfit / totalMonths;

    res.json({ averageMonthlyProfit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.route("/getId/latest").get(async (req, res) => {
  try {
    // Find the latest document in the collection
    const latestProfit = await Profit.findOne().sort({ Profit_ID: -1 });
    // Extract the numeric part of the latest Profit ID and increment it by one
    let nextNumericPart = 1;
    if (latestProfit) {
      const numericPart = parseInt(latestProfit.Profit_ID.substring(2)); // Extract numeric part after 'OE'
      nextNumericPart = numericPart + 1;
    }
    // Format the next ID
    const nextId = `PL${nextNumericPart.toString().padStart(2, '0')}`; // Ensure the numeric part has leading zeros if necessary
    res.json({ nextId });
  } catch (error) {
    console.error("Error fetching next Profit ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/fetch/taxRate', async (req, res) => {
  try {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth(); // Month is zero-based
      
      // Determine the start and end years based on the current date
      const startYear = currentMonth >= 3 ? currentYear : currentYear - 1;

      // Get the start and end dates for the period from April 1st to March 31st
      const startDate = new Date(startYear, 3, 1); // April 1st
      const endDate = new Date(startYear + 1, 2, 31, 23, 59, 59); // March 31st of the next year

      // Fetch tax collection data for the specified period
      const Tax = await tax.find({
          Date_modified: {
              $gte: startDate,
              $lte: endDate
          }
      });

      // Extract the tax rate from the first tax collection entry (assuming there's only one rate for the period)
      const taxRate = Tax.length > 0 ? Tax[0].Rate : null;

      res.json({ taxRate });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;