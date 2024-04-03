const express = require('express');
const app = express()
const morgan = require('morgan')
const mongoose = require("mongoose")
require('dotenv/config')

// IMPORTING ROUTERS
const productRouter = require('./routers/products')
const categoryRouter = require('./routers/categories')
const userRouter = require('./routers/users')
const orderRouter = require('./routers/orders')
const { authJwt } = require('./helper/jwt')
const { errorHandler } = require('./helper/error-hander')

const api = process.env.API_URI;

// MIDDLE WARE
app.use(express.json())
app.use('/public/uploads/', express.static(__dirname + '/public/uploads/'))
console.log(__dirname)
app.use(morgan('tiny'))
app.use(authJwt())
app.use(errorHandler)

// ROUTERS
app.use(`${api}/product`, productRouter)
app.use(`${api}/category`, categoryRouter)
app.use(`${api}/user`, userRouter)
app.use(`${api}/order`, orderRouter)




// DATABASE CONNECTION
mongoose.connect(process.env.CONNECTION_STRING, { dbName: 'e-shop' }).then((res) => { console.log("db is ready") })
    .catch((err) => { console.log(err) })

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})