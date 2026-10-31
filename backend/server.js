const dotenv = require("dotenv");
const { API_HOST, API_PORT, API_VERSION } = dotenv.config({ path: './backend/config/.env'}).parsed
const { connectDB } = require("./config/dbConnec")
const app = require("./app")

process.on("uncaughtException", (error) =>{
    console.log(`Error: ${error.message}`)
    console.error(`Server shutting down due to uncaught exception error...`)
    process.exit(1)
})


const server = app.listen(API_PORT, async (err) => {
    if(err){
        console.log(err)
        throw new Error(err)
    }
    const URL = `http://${API_HOST}:${API_PORT}`
    console.log(`\nServer running on: ${URL}`)
    console.log(`API URL: ${URL}${API_VERSION}`)
    await connectDB();
})


process.on("unhandledRejection", (error) => {
    console.log(`\nError: ${error.message}`)
    console.log(`Shutting down the server due to unhandle promise rejection......`)
    server.close(()=>{
        process.exit(1)
    })
})