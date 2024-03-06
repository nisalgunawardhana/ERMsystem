const router = require("express").Router();
let purchaseOrder = require("../models/purchaseOrdermodel");

//CREATE
router.route("/add").post((req,res)=>{
    const purchaseOrder_id = req.body.purchaseOrder_id;
    const supplier_id =  req.body.supplier_id;
    const supplier_name = req.body.supplier_name;
    const order_date = req.body.order_date;
    const deliver_date = req.body.deliver_date;
    const order_items = req.body.order_items;
    const order_amount = req.body.order_amount;
    const delivery_information = req.body.delivery_information;
    const payment_information = req.body.payment_information;
    const additional_infomation = req.body.additional_infomation;
    const invoice_no = req.body.invoice_no;
    const total_order_amount = req.body.total_order_amount;
    const order_status = req.body.order_status;
    const payment_status = req.body.payment_status;

    const newPurchaseOrder = new purchaseOrder({
        purchaseOrder_id,
        supplier_id,
        supplier_name,
        order_date,
        deliver_date,
        order_items,
        order_amount,
        delivery_information,
        payment_information,
        additional_infomation,
        invoice_no,
        total_order_amount,
        order_status,
        payment_status
    })
    
    newPurchaseOrder.save().then(()=>{
        res.json("New Purchase Order (PO) Added");
    }).catch((err)=>{
        console.log(err);
    })
})


//READ
router.route("/").get((req,res)=>{
    purchaseOrder.find().then((purchaseOrdermodel)=>{
        res.json(purchaseOrdermodel)
    }).catch((err)=>{
        console.log(err)
    })
})


//UPDATE
router.route("/update/:id").put(async (req,res)=>{
    let poID = req.params.id;
    const {purchaseOrder_id, supplier_id, supplier_name, order_date, deliver_date, order_items, order_amount, delivery_information, payment_information, additional_infomation, invoice_no, total_order_amount, order_status, payment_status} = req.body;

    const updatePO = {
        purchaseOrder_id,
        supplier_id,
        supplier_name,
        order_date,
        deliver_date,
        order_items,
        order_amount,
        delivery_information,
        payment_information,
        additional_infomation,
        invoice_no,
        total_order_amount,
        order_status,
        payment_status
    }

    const update = await purchaseOrder.findByIdAndUpdate(poID, updatePO).then(() => {
        res.status(200).send({status: "Purchase Order (PO) updated"})
    }).catch((errr) => {
        console.log(errr);
        res.status(500).send({status: "Error with updating Purchase Order"});
    })
})


//DELETE
router.route("/delete/:id").delete(async (req,res) => {
    let poID = req.params.id;

    await purchaseOrder.findByIdAndDelete(poID).then(() => {
        res.status(200).send({status: "Purchase Order deleted"});
    }).catch((errr) => {
        console.log(errr);
        res.status(500).send({status: "Error with deleting Purchase Order"});
    })
})

module.exports = router;
