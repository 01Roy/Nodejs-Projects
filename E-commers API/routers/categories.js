const express = require('express')
const router = express.Router()
const { Category } = require('../models/category')

// GET LIST OF CATEGORIES
router.get('/', async (req, res) => {
    const categoryList = await Category.find();

    if (!categoryList) {
        res.status(500).json({ succes: false })
    }

    res.status(200).send(categoryList)
})
// GET THE SPECIFIC CATEGORY BY ID
router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return res.status(500).json({ messsage: "The given Id id not prensent in the category list" });
    }

    res.status(200).send(category)
})

// POST THE CATEGORY
router.post('/', async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })
    category = await category.save();

    if (!category) {
        return res.status(404).send('the category is not created')
    }

    res.send(category)
})

// UPDATE THE CATEGORY
router.put('/:id', async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        },
        { new: true }
    )
    if (!category) {
        return res.status(404).send('the category is not created')
    }

    res.send(category)
})

//DELETE
router.delete('/:id', async (req, res) => {
    try {
        let category = await Category.findByIdAndDelete(req.params.id)
        if (category) {
            return res.status(200).json({ success: true, message: 'the Category is deleted succesfully' })
        }
        else {
            return res.status(404).json({ succes: false, message: 'the category is not found' })
        }
    } catch (err) {
        return res.status(400).json({ success: false, error: err.message })
    }
})



module.exports = router