const router = require("express").Router();
let supPerformance = require("../models/superformancemodel");


//CREATE
router.route("/add/:id").post((req,res)=>{
    const po_id = req.body.po_id;
    const purchaseOrder_id = req.body.purchaseOrder_id;
    const sup_id =  req.body.sup_id;
    const sup_deliver_date = req.body.sup_deliver_date;
    const leadTime = req.body.leadTime;
    const qualityOfGoods = req.body.qualityOfGoods;
    const quantityAccuracy = req.body.quantityAccuracy;
    const responsiveness = req.body.responsiveness;
    const costEffectiveness = req.body.costEffectiveness;

    const newSupPerformance = new supPerformance({
        po_id,
        purchaseOrder_id,
        sup_id,
        sup_deliver_date,
        leadTime,
        qualityOfGoods,
        quantityAccuracy,
        responsiveness,
        costEffectiveness
    })
    
    newSupPerformance.save().then(()=>{
        res.json("New supplier performance data Added");
    }).catch((err)=>{
        console.log(err);
    })
})



//READ
router.route("/").get((req,res)=>{
    suppliers.find().then((suppliermodel)=>{
        res.json(suppliermodel)
    }).catch((err)=>{
        console.log(err)
    })
})


//UPDATE
router.route("/update/:id").put(async (req,res)=>{
    let supID = req.params.id;
    const {supplier_id, supplier_name, address, contact, email, product_types, product_items, bank_details, sup_performance, contract} = req.body;

    const updateSupplier = {
        supplier_id,
        supplier_name,
        address,
        contact,
        email,
        product_types,
        product_items,
        bank_details,
        sup_performance,
        contract
    }

    const update = await suppliers.findByIdAndUpdate(supID, updateSupplier).then(() => {
        res.status(200).send({status: "Supplier details updated"})
    }).catch((errr) => {
        console.log(errr);
        res.status(500).send({status: "Error with updating Supplier details"});
    })
})


//DELETE
router.route("/delete/:id").delete(async (req,res) => {
    let supID = req.params.id;

    await suppliers.findByIdAndDelete(supID).then(() => {
        res.status(200).send({status: "Supplier deleted"});
    }).catch((errr) => {
        console.log(errr);
        res.status(500).send({status: "Error with deleting supplier details"});
    })
})


//GET ONE SUPPLIER
router.route("/get/:id").get(async (req,res) => {
    let supID = req.params.id;
    const sup = await suppliers.findById(supID)
    .then((supplier) => {
        res.status(200).send({status: "Supplier fetched", supplier})
    }).catch((err) => {
        console.log(err.message);
        res.status(500).send({status: "Error with getting supplier detials", error: err.message});
    })
})


//GET ALL SUPPLIER NAMES DROPDOWN
router.route("/names").get((req, res) => {
    suppliers.find({}, 'supplier_name').then((supplierNames) => {
        res.json(supplierNames);
    }).catch((err) => {
        console.log(err);
        res.status(500).json({ error: "Error fetching supplier names" });
    });
});


//GET SUPPLIER BY NAME
router.route("/getByName/:name").get(async (req,res)=>{
    const supplierName = req.params.name;
    const supplier = await suppliers.findOne({supplier_name: supplierName});
    res.json({supplier});
});


module.exports = router;
