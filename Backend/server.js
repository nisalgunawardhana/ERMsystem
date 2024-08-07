const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require('dotenv').config();
const cors = require("cors");
const app = express();
//app.use(express.json())
const PORT = process.env.PORT || 8080;
const nodemailer = require('nodemailer');

app.use(cors(
    {
        origin: ["https://deploy-mern-1whq.vercel.app"],
        methods: ["POST", "GET"], 
        credentials: true
    }
));
app.use(bodyParser.json());

const URL = process.env.MONGODB_URL;

// Connect to MongoDB without deprecated options:
mongoose.connect(URL, {
    useNewUrlParser: true,
    
});

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB connection successful");
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'diyanafashionerm@gmail.com',
    pass: 'pcgm mxfb jsro qcwi'
  }
});

app.post("/send-email", (req, res) => {
  const mailOptions = req.body;

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent:", info.response);
      res.status(200).send("Email sent successfully");
    }
  });
});


//other expenses
const expenseRouter = require("./routes/expenseroutes.js");
app.use("/otherExpense", expenseRouter);

//Billing func
const billsRouter = require("./routes/billingroutes.js");
app.use("/bills", billsRouter);

//Trainee func
const traineesRouter = require("./routes/traineeroutes.js");
app.use("/trainees", traineesRouter);

//Meeting func
const MeetingsRouter = require("./routes/meetingroutes.js");
app.use("/meetings", MeetingsRouter);

//tax func
const taxRouter = require("./routes/tax.js");
app.use("/tax", taxRouter);

//testitem
const itemR = require("./routes/itemrouts.js");
app.use("/item", itemR);

//profit func
const profitRouter = require("./routes/profit.js");
app.use("/profit", profitRouter);

//employee management

//employee func
const employeeRouter = require("./routes/employeeroutes.js");
app.use("/employee", employeeRouter);

//attendance func
const attendance = require("./routes/attendanceroute.js");
app.use("/attendance", attendance);

//leave fun
const leavesRoute = require("./routes/leavesroute.js");
app.use("/leave", leavesRoute);

//salary fun
const SalaryRoute = require("./routes/salary.js");
app.use("/salary",SalaryRoute);



//supplier func
const supplierRouter = require("./routes/supplierroutes.js");
app.use("/supplier", supplierRouter);

//purchase order func
const purchaseOrderRouter = require("./routes/purchaseOrderroutes.js");
app.use("/purchaseOrder", purchaseOrderRouter);

//supplier performance func
// const SupPerformanceRouter = require("./routes/superformanceroutes.js");
// app.use("/supPerformance", SupPerformanceRouter);

//Requests For Quotations(RFQ) func
const requestForQuotationRouter = require("./routes/rfqroutes.js");
app.use("/rfq", requestForQuotationRouter);

//customer
const customer = require("./routes/customerroute.js");
app.use("/customer", customer);

const discounts = require("./routes/discounttoute.js");
app.use("/discounts", discounts);


//user management
const userRoute = require("./routes/userRoute.js");
app.use("/api/user", userRoute);    //fetch user
app.use("/api/users", userRoute);   //fetch user details
app.use("/users/notes", userRoute);  

const clothes = require("./routes/clothesRoutes.js");
app.use("/clothes", clothes);

const toys = require("./routes/toysRoutes.js");
const Leaves = require("./models/leavesmodel.js");
app.use("/toys", toys);



app.listen(PORT, () => {
    console.log(`Server is up and running on: ${PORT}`);
});
