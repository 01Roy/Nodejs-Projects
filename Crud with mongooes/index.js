const mongoose = require('mongoose')

const main = async () => {
    await mongoose.connect('mongodb://localhost:27017/crud')
    let productSchema = new mongoose.Schema({
        name: String,
        email: String
    })

    let productModel = mongoose.model('student', productSchema);

    let data = new productModel({
        name: "Simran shrama",
        email: "sanjanashrama12@gmail.com"
    })

    // Find Data
    // let result = await productModel.find();
    // console.log(result)

    // Post data
    // let result = await data.save();
    // console.log(result)

    // Upate data
    // let result = await productModel.updateOne({ name: "Simi" },
    //     { $set: { name: "Simi", email: "simishrama12@gmail.com" } })
    // console.log(result)

    // Delete data
    // let result = await productModel.deleteOne({ name: "Simi" })
    // console.log(result)
}


main()