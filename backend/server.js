import express from "express"
// setting the type to module in package removes the error on running
// But semantically the same as importing
// const express = require("express");


// If we want to run with a script, npm run dev, add to package
// What is npm? - 


const app = express();

app.get("/api/notes", (req,res)=> {
    //api end point, e.g might do something delete a not
    // can create another endpoint, create something
    res.status(200).send("you got 4 notes")
})

// app.post("/api/notes", (req,res)=> {
//     //api end point, e.g might do something delete a not
//     // can create another endpoint, create something
//     res.send("you got 5 notes")
// })

//There we go basiically api

app.listen(5001, () => {
    console.log("Server started on PORT: 5001")
});
