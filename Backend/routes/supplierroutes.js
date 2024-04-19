const router = require("express").Router();
let suppliers = require("../models/suppliermodel");


//CREATE
router.route("/add").post((req,res)=>{
    const supplier_id = req.body.supplier_id;
    const supplier_name = req.body.supplier_name;
    const address = req.body.address;
    const contact = req.body.contact;
    const email = req.body.email;
    const product_types = req.body.product_types;
    const product_items = req.body.product_items;
    const bank_details = req.body.bank_details;
    const sup_performance = req.body.sup_performance;
    const contract = req.body.contract;


    const newSupplier = new suppliers({
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
    })
    
    newSupplier.save().then(()=>{
        res.json("A new Supplier added")
    }).catch((err)=>{
        console.log(err);
    })
});


//READ
router.route("/").get((req,res)=>{
    suppliers.find().then((suppliermodel)=>{
        res.json(suppliermodel)
    }).catch((err)=>{
        console.log(err)
    })
});


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
