const express = require('express')
const userRouter = require('./routers/user')
const testRouter = require('./routers/test')
require("dotenv").config();
require('./db/db')

const app = express()

app.use(express.json())
app.use(userRouter);
app.use(testRouter);

app.listen(process.env.PORT || 8080, ()=>{
    console.log("Server is running...")
})
