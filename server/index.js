//initializing
const express = require('express')
const cors = require('cors')
const pool = require("./config/db")
const app = express()



//dotenv config
require('dotenv').config()

app.use(
    cors({
        origin:
        "http://localhost:5173"
    })
);
app.use(express.json())

//routers
const rideRoutes = require('./routes/rideRouter')
app.use("/api",rideRoutes)

//database 
pool.connect((err)=>{
    if(err){
        console.log(`${err}`)
    }else[
        console.log('Connection to DB Success!')
    ]
})

//backend core logic
app.get("/",(req,res)=>{
    res.send("Backend Running")
})

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})