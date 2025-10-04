import express from "express"
import noteRoutes from "./routes/noteRoutes.js"
// setting the type to module in package removes the error on running
// But semantically the same as importing
// const express = require("express");


// If we want to run with a script, npm run dev, add to package
// What is npm? - 


const app = express();
app.use("/api/notes", noteRoutes)


app.listen(5001, () => {
    console.log("Server started on PORT: 5001")
});
