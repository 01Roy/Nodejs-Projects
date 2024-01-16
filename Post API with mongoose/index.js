const express = require('express');
require('./config');
const Product = require('./model/product');
const product = require('./model/product');

const app = express();
app.use(express.json())

app.get('/list', async (req, res) => {
    let data = await Product.find({});
    res.send(data)
})

app.post('/create', async (req, res) => {
    const data = new Product(req.body);
    const result = await data.save();
    console.log(result)
    res.send(result)

})

app.put('/update/:_id', async (req, res) => {
    let result = await product.updateOne({ _id: req.params }, { $set: req.body })
    console.log(result)
    res.send(result)
})

app.delete('/delete/:_id', async (req, res) => {
    let result = await Product.deleteOne(req.params)
    console.log(result)
    res.send(result)
})

app.listen(5500, () => { console.log('server is running on port 5500') })