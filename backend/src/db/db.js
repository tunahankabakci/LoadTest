const mongoose = require('mongoose')
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true
})
console.log("connected to db")
