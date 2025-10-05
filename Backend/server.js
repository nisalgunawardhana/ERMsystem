const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require('dotenv').config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT || 8080;
const nodemailer = require('nodemailer');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const { getUserRole } = require('./utils/userRole');

const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || 'http://localhost:3000';
const jwtSecret = process.env.JWT_SECRET || 'your-jwt-secret-key-change-in-production';

// Define allowed origins
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

// Middleware setup (order is important)
// 1. Basic middleware
app.use(bodyParser.json());
app.use(cookieParser());

// 2. Restrictive CORS policy
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// 3. Session middleware - MUST be before passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'change-this-secret-in-production',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// 4. Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
const URL = process.env.MONGODB_URL;

mongoose.connect(URL, {
    useNewUrlParser: true,
});

// Define allowed origins
const allowedOrigins = ['http://localhost:3000'];

// Restrictive CORS policy
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.listen(PORT, () => {
    console.log(`Server is up and running on: ${PORT}`);
});

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB connection successful");
});

// Serialize/deserialize user for passport
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Configure Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:8080/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // Here, you can save/find the user in your DB if needed
    return done(null, profile);
  }
));

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'diyanafashionerm@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'pcgm mxfb jsro qcwi'
  }
});

// Route for sending email
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

// Google OAuth routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

const User = require("./models/userModel");

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: `${FRONTEND_BASE_URL}/login?error=authentication_failed` }),
  async function(req, res) {
    try {
      const googleEmail = req.user?.emails?.[0]?.value || req.user?._json?.email;
      if (!googleEmail) {
        return res.redirect(`${FRONTEND_BASE_URL}/login?error=authentication_failed`);
      }
      const user = await User.findOne({ email: googleEmail });

      if (!user) {
        // Optionally, create the user here or reject
        return res.redirect(`${FRONTEND_BASE_URL}/login?error=not_registered`);
      }

      // Generate JWT with DB user info
      const role = getUserRole(user);
      const token = jwt.sign(
        { id: user._id, role }, // used role flags
        jwtSecret,
        { expiresIn: '1h' }
      );

      const params = new URLSearchParams({
        token,
        role,
      });

      res.redirect(`${FRONTEND_BASE_URL}/login?${params.toString()}`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect(`${FRONTEND_BASE_URL}/login?error=authentication_failed`);
    }
  }
);

app.get('/logout', (req, res) => {
  req.logout(() => {
    // log out from Google
    res.redirect(`https://accounts.google.com/Logout?continue=https://appengine.google.com/_ah/logout?continue=${encodeURIComponent(`${FRONTEND_BASE_URL}/login`)}`);
  });
});

// Test endpoint for testing environment
if (process.env.NODE_ENV === 'test') {
  app.get('/otherExpense/', (req, res) => {
    res.json({ test: 'ok' });
  });
}

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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is up and running on: ${PORT}`);
});

module.exports = app;
