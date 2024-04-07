//this is where express app is registered

require('dotenv').config();

const express = require("express");
const mongoose = require('mongoose')
//express app
const app = express();  
const cors = require('cors');

//middleware
app.use(express.json())
app.use(cors());
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//routes -- gets the routes and uses them on the app
const userRoutes = require('./routes/userRoutes')
app.use('/userRoutes', userRoutes)

const user = require('./routes/user')
app.use('/user', user)

//connect to DB
mongoose.connect(process.env.MONGODB_URL)
    .then(() => {   
        //listen for requests
        app.listen(PORT, () => {
            console.log(`Server is up and running on: ${PORT}`);
            console.log(`Mongodb is connected`);
        })
    })
    .catch((error) => {
        console.log({error})
    })

const PORT = process.env.PORT || 8080;
