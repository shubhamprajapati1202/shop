const mongoose = require("mongoose");

module.exports.connectDB = (async()=>{
    try{
        const db = process.env.DB_URI
        const connect = await mongoose.connect(db)
        if(connect){
            console.log(`Database successfully connected: ${db}\n`,)
        }
    }catch(err){
        console.log(`Error in database connection`, err)
    }
})