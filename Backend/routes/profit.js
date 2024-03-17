const router = require("express").Router();
const bills = require("../models/billlingmodel");
let Profit = require("../models/profit");

router.route("/add").post((req,res)=>{
    const Month = req.body.Month;
    const Sales_income = Number(req.body.Sales_income);
    const Supplier_expenses = Number(req.body.Supplier_expenses);
    const Salaries= Number(req.body.Salaries);
    const Profit = Number(req.body.Profit);

    const newProfit = new Profit({
        Month,
        Sales_income,
        Supplier_expenses,
        Salaries,
        Profit
    })
    
    newProfit.save().then(()=>{
        res.json("Profit Details Added")
    }).catch((err)=>{
        console.log(err);
    })
})

router.route("/get/:id").get(async (req,res) => {
    let profitId = req.params.id;
    const profit = await Profit.findById(profitId).then((tax) => {
        res.status(200).send({status: "Profit details fetched", tax})
    }).catch((errr) => {
        console.log(errr);
        res.status(500).send({status: "Error with getting Profit details"});
    })
})

router.route("/get/").get(async (req,res) => {
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