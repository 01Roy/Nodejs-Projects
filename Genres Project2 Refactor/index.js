const express = require('express')
const Joi = require('joi');
const genre = require('./router/genre');
const app = express();
app.use(express.json())

// router
app.use('/api/genres', genre)




app.listen(3000, () => console.log(`Server is running on port 3000`))