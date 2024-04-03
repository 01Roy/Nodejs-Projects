const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')
const { Product } = require('../models/product')
const { Category } = require('../models/category')

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype]
        let uploadError = new Error('invalid image type')
        if (isValid) {
            uploadError = null
        }
        cb(uploadError, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-')
        const extension = FILE_TYPE_MAP[file.mimetype]
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})

const uploadOptions = multer({ storage: storage })


// GET PRODUCT LIST AND USING QUERY PARMAS WE CAN GET SPECIFIC CATEROGY OR ARRAY OF CATEGORIES
router.get('/', async (req, res) => {

    let filter = {}
    if (req.query.caterogies) {

        filter = { category: req.query.caterogies.split(',') }
    }

    const productList = await Product.find(filter).select('name image category images')
    if (!productList) {
        return res.send('NO Product is found')
    }

    res.send(productList)

})


// GET THE SPECIFC PRODUCT
router.get('/:id', async (req, res) => {
    let product = await Product.findById({ _id: req.params.id }).populate('category')

    if (!product) {
        return res.send('NO Product is found')
    }

    res.send(product)

})

// POST THE PRODUCT
router.post(`/`, uploadOptions.single('image'), async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invaild category')

    const file = req.file
    if (!file) return res.status(400).send('Please Provide the Image File')
    const fileName = file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basePath}${fileName}`,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })

    product = await product.save()

    if (!product) {
        return res.status(500).send('Product is not created')
    }

    return res.send(product)

})

// UPDATE THE PRODUCT
router.put('/:id', uploadOptions.single('image'), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('invaild product ID')
    }
    let category = await Category.findById(req.body.category)
    if (!category) return res.status(400).send('invaild category')

    let product = await Product.findById(req.params.id)
    if (!product) { return res.status(400).send('Invalid Product') }

    const file = req.file;
    let imagePath;
    if (file) {
        const fileName = file.filename
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
        imagePath = `${basePath}${fileName}`
    } else {
        imagePath = product.image
    }

    let updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: imagePath,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    }, { new: true })

    if (!updatedProduct) {
        return res.status(404).send('the product is not created')
    }

    res.send(updatedProduct)
})

// DELETE THE PRODUCT   
router.delete('/:id', async (req, res) => {
    try {
        let product = await Product.findByIdAndDelete(req.params.id)
        if (product) {
            return res.status(200).json({ success: true, message: 'the product is deleted succesfully' })
        }
        else {
            return res.status(404).json({ succes: false, message: 'the product is not found' })
        }
    } catch (err) {
        return res.status(400).json({ success: false, error: err.message })
    }
})

// GET PRODUCT COUNT
router.get('/get/count', async (req, res) => {
    let productCount = await Product.countDocuments();

    if (!productCount) {
        return res.send('No Product Listed')
    }

    res.send({ productCount: productCount })
})

// GET FEATURED PRODUCTS COUNT
router.get('/get/featured/count', async (req, res) => {
    let productFeatured = await Product.find({ isFeatured: true }).countDocuments();

    if (!productFeatured) {
        return res.send('No Featured Product is listed')
    }

    res.send({ productFeatured: productFeatured })
})

// GET FEATURED PRODUCTS
router.get('/get/featured/:count?', async (req, res) => {
    let count = req.params.count ? req.params.count : 0;
    let productFeatured = await Product.find({ isFeatured: true }).limit(+count)

    if (!productFeatured) {
        return res.send('No Featured Product is listed')
    }

    res.send(productFeatured)
})

// UPDATE ARAAY OF IMAGE GALLARY
router.put('/gallery-images/:id', uploadOptions.array('images', 10), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('invaild product ID')
    }
    let imagesPaths = [];
    const files = req.files
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
    if (files) {
        files.map(file => {
            imagesPaths.push(`${basePath}${file.filename}`)
        })
    }

    let product = await Product.findByIdAndUpdate(req.params.id, {
        images: imagesPaths
    }, { new: true })

    if (!product) {
        return res.status(404).send('the product is not updated')
    }

    res.send(product)

})
module.exports = router