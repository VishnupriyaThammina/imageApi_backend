const express = require("express");
require("./src/db/mongoose")
const cors = require("cors")
const app = express()
app.use(cors())
const userRouter = require("./src/router/user")
const port = process.env.PORT || 3000
app.use(express.json())
app.use(userRouter)
app.listen(port,()=>{
console.log(`Server is running on ${port}`)
})