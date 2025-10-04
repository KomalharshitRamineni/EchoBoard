import express from "express"
import noteRoutes from "./routes/noteRoutes.js"
import {connectDB} from "./config/db.js"
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config(); // Needed to hide stuff like db connection details, api keys etc...

// setting the type to module in package removes the error on running
// But semantically the same as importing
// const express = require("express");


// If we want to run with a script, npm run dev, add to package
// What is npm? - 


const app = express();
const PORT = process.env.PORT || 5001;


// Middle ware

app.use(express.json());
app.use(rateLimiter)
// // Simple custom middle ware
// app.use((req,re,next) => {
//     console.log(`Req method is ${req.method} & Req URL is ${req.url}`);
//     next();
// })




app.use("/api/notes", noteRoutes);


connectDB().then(() => {
    app.listen(5001, () => {
        console.log("Server started on PORT: 5001")
    });
});


// slightly changed such taht only listen after connecting to database