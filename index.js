//import statements
const express=require('express');
const morgan=require('morgan');
const colors=require('colors');
const dotenv=require('dotenv');
const connectionDb = require('./config/db');
const path=require("path");

//dotenv config
dotenv.config();

//mongodb connection
connectionDb();

//rest object
const app=express();

//middlewares
app.use(express.json());
app.use(morgan('dev'));

//port
const port=process.env.PORT || 8080;

//routes
app.use("/api/v1/user",require("./routes/userRoutes"));

app.use("/api/v1/admin",require("./routes/adminRoutes"));

app.use("/api/v1/organizer",require("./routes/organizerRoutes"));

//listen
app.listen(port,() => {
    console.log(`Server running in ${process.env.NODE_MODE} on port ${process.env.PORT}`.bgBlue.black);
});