const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require('dotenv').config();
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 8080;

app.use(cors());
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

//other ex func
const otherRouter = require("./routes/otherExpense.js");

app.use("/otherExpense", otherRouter);

//Billing func
const billsRouter = require("./routes/billingroutes.js");
app.use("/bills", billsRouter);

app.listen(PORT, () => {
    console.log(`Server is up and running on: ${PORT}`);
});