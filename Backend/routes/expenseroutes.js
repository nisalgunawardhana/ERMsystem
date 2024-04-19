const router = require("express").Router();
let otherExpenses = require("../models/expensemodel");

//route to add expense
router.route("/add").post(async (req, res) => {
    const Expense_id = req.body.Expense_id;
    const Type = req.body.Type;
    const Date = req.body.Date;
    const Status = req.body.Status;
    const Cost = req.body.Cost;

    const newOther = new otherExpenses({
        Expense_id,
        Type,
        Date,
        Status,
        Cost
    })

    newOther.save().then(() => {
        res.json("Other Expense Added")
    }).catch((err) => {
        console.log(err);
    })
})

router.route("/add/check").post(async (req, res) => {
    const Type = req.body.Type;
    const submittedDate = req.body.Date;
    const Status = req.body.Status;
    const Cost = req.body.Cost;

    const submittedMonth = new Date(submittedDate).getMonth() + 1; // Add 1 because getMonth() returns zero-based index
    const submittedYear = new Date(submittedDate).getFullYear();

    try {
        const existingExpense = await otherExpenses.findOne({ Type, Status, Cost });
        const existingExpense2 = await otherExpenses.findOne({
            $expr: {
                $and: [
                    { $eq: [{ $month: "$Date" }, submittedMonth] }, // Check month
                    { $eq: [{ $year: "$Date" }, submittedYear] } // Check year
                ]
            }
        });

        if (existingExpense && existingExpense2) {
            // If expense already exists, return a message asking the user if they want to add it again
            return res.status(400).json({ message: "Expense already exists", existingExpense });
        } else {
            // If expense doesn't exist, return a response indicating that it doesn't exist
            return res.status(200).json({ message: "Expense doesn't exist" });
        }
    } catch (error) {
        console.error("Error:", error);
        // Handle database errors
        return res.status(500).json({ error: "Internal Server Error" });
    }
})

//route to get all expenses
router.route("/").get((req, res) => {
    otherExpenses.find().then((otherExpense) => {
        res.json(otherExpense)
    }).catch((err) => {
        console.log(err)
    })
})

//route to update expense
router.route("/update/:id").put(async (req, res) => {
    let expenseId = req.params.id;
    const { Expense_id, Type, Date, Status, Cost } = req.body;

    const updateOther = {
        Expense_id,
        Type,
        Date,
        Status,
        Cost
    }

    const update = await otherExpenses.findByIdAndUpdate(expenseId, updateOther).then(() => {
        res.status(200).send({ status: "Other Expense updated" })
    }).catch((errr) => {
        console.log(errr);
        res.status(500).send({ status: "Error with updating data" });
    })
})

//route to delete expense
router.route("/delete/:id").delete(async (req, res) => {
    let expenseId = req.params.id;

    await otherExpenses.findByIdAndDelete(expenseId).then(() => {
        res.status(200).send({ status: "Other Expense deleted" });
    }).catch((errr) => {
        console.log(errr);
        res.status(500).send({ status: "Error with deleting Other Expense" });
    })
})

//route to get specific expense
router.route("/get/:id").get(async (req, res) => {
    let expenseId = req.params.id;
    const other = await otherExpenses.findById(expenseId).then((otherExpense) => {
        res.status(200).send({ status: "Other Expense fetched", otherExpense })
    }).catch((errr) => {
        console.log(errr);
        res.status(500).send({ status: "Error with getting Other expense" });
    })
})

router.route("/:date").get((req, res) => {
    const { date } = req.params;
    const query = date ? { Date: date } : {};

    otherExpenses.find(query)
        .then((otherExpense) => {
            res.json(otherExpense);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Error fetching other expenses" });
        });
});

//route to get current year total expenses
router.route("/get/other/total").get(async (req, res) => {
    try {
        // Get the current date
        const currentDate = new Date();

        // Calculate the start and end dates of the current year
        const startDate = new Date(currentDate.getFullYear(), 0, 1); // January 1st of the current year
        const endDate = new Date(currentDate.getFullYear(), 11, 31); // December 31st of the current year

        const totalAmount = await otherExpenses.aggregate([
            {
                $match: {
                    // Filter expenses for the current year only
                    Date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$Cost" }
                }
            }
        ]);

        res.json({ totalAmount: totalAmount.length > 0 ? totalAmount[0].totalAmount : 0 }); // Return total expenses for the current year
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

//route to getcurrent month expense amount
router.route("/get/other/month").get(async (req, res) => {
    try {
        // Get the current date
        const currentDate = new Date();

        // Calculate the start and end dates of the current month
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const totalAmount = await otherExpenses.aggregate([
            {
                $match: {
                    // Filter expenses for the current month only
                    Date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$Cost" }
                }
            }
        ]);

        res.json({ totalAmount: totalAmount.length > 0 ? totalAmount[0].totalAmount : 0 }); // Return total expenses for the current month
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

//route to get average monthly expense amount
router.route("/get/other/average").get(async (req, res) => {
    try {
        // Get the current date
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();

        // Calculate the start and end dates of the current year
        const startDate = new Date(currentYear, 0, 1); // January 1st of the current year
        const endDate = new Date(currentYear, 11, 31); // December 31st of the current year

        const monthlyExpenses = await otherExpenses.aggregate([
            {
                $match: {
                    // Filter expenses for the current year only
                    Date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: { $month: "$Date" }, // Group by month
                    totalAmount: { $sum: "$Cost" }
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
        let totalExpense = 0;
        monthlyExpenses.forEach(month => {
            totalExpense += month.totalAmount;
        });
        const averageMonthlyExpense = totalExpense / totalMonths;

        res.json({ averageMonthlyExpense });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.route("/getId/latest").get(async (req, res) => {
    try {
        // Find the latest document in the collection
        const latestExpense = await otherExpenses.findOne().sort({ Expense_id: -1 });
        // Extract the numeric part of the latest expense ID and increment it by one
        let nextNumericPart = 1;
        if (latestExpense) {
            const numericPart = parseInt(latestExpense.Expense_id.substring(2)); // Extract numeric part after 'OE'
            nextNumericPart = numericPart + 1;
        }
        // Format the next ID
        const nextId = `OE${nextNumericPart.toString().padStart(2, '0')}`; // Ensure the numeric part has leading zeros if necessary
        res.json({ nextId });
    } catch (error) {
        console.error("Error fetching next Expense ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


module.exports = router;