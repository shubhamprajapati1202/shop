const express = require("express")
const app = express()
const routes = require("./routes/index")
const middleware = require("./middleware/error")
const helmet = require("helmet")
const cookieParser = require("cookie-parser")

app.disabled("x-powered-by")
app.use(helmet());
app.set('json spaces', 3)
app.use(cookieParser())

app.use(express.json())
app.use(express.urlencoded({extended: false}))
// console.log(routes)

app.use(process.env.API_VERSION, routes)


app.use(middleware.requestNotFound) //404 Rquest not found
app.use(middleware.internalServerError) //500 Internal Server Error

module.exports = app
