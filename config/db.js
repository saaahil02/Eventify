const mongoose = require("mongoose")
const colors=require("colors")

const connectionDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDb connected ${mongoose.connection.host}`.bgGreen.white)
    } catch (error) {
        console.log(`MongoDb Issue${error}`.bgRed.white)
    }
};

module.exports=connectionDb;