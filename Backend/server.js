const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cors = require("cors");
const app = express();
//app.use(express.json())
const PORT = process.env.PORT || 8080;

const http = require("http");
const socketIo = require("socket.io");

const server = http.createServer(app);
const io = socketIo(server);

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

//employee func
const employeeRouter = require("./routes/employeeroutes.js");
app.use("/employee", employeeRouter);

//attendance func
const attendance = require("./routes/attendanceroute.js");
app.use("/attendance", attendance);

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
const userModel = require("./models/userModel.js");
app.use("/toys", toys);

io.on('connection', (socket) => {
    console.log(`Socket ${socket.id} connected`);

    // Event listener for heartbeat
    socket.on('heartbeat', async (data) => {
        const token = socket.handshake.query.token;

        // Verify the token and extract user ID
        let userId = "";
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error("Error verifying token:", err);
                return;
            }
            userId = decoded.id;
        });

        // Store the mapping of socket ID to user ID
        socket.userId = userId;
        
        try {
            // Fetch the user by ID
            const user = await userModel.findById(userId);

            if (!user) {
                console.log("User not found");
                return;
            }

            // Update isActive field of the user
            user.isActive = true;
            const updatedUser = await user.save();

            console.log('Heartbeat received from user:', userId);
        } catch (error) {
            console.error("Error updating user:", error);
        }
    });

    // Event listener for disconnect
    socket.on('disconnect', async () => {
        // Get the user ID corresponding to the socket
        const userId = socket.userId;

        if (!userId) {
            console.log("User ID not found for disconnected socket:", socket.id);
            return;
        }

        try {
            // Fetch the user by ID
            const user = await userModel.findById(userId);

            if (!user) {
                console.log("User not found");
                return;
            }

            // Update isActive field of the user to false when connection is lost
            user.isActive = false;
            const updatedUser = await user.save();

            console.log(`User ${userId} connection lost, marked as logged out`);
        } catch (error) {
            console.error("Error updating user:", error);
        }
    });
});


server.listen(PORT, () => {
    console.log(`Server is up and running on: ${PORT}`);
});