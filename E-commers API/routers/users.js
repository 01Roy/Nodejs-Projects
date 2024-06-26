const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../models/user')

// GET LIST OF USERS
router.get('/', async (req, res) => {
    const userList = await User.find().select('-passwordHash');

    if (!userList) {
        res.status(500).json({ success: false })
    }

    res.send(userList)
})

// GET  SPECIFIC USER
router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');

    if (!user) {
        return res.send('the user with this given ID is Invaild');
    }

    res.send(user)
})


// POST USER
router.post('/register', async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })

    user == await user.save()
    if (!user) {
        return res.send('Enable to create a User')
    }

    res.status(200).send(user)
})

// POST USING LOGIN
router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    const secret = process.env.SECRET;

    if (!user) {
        return res.send('the user is not found')
    }

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        let token = jwt.sign(
            {
                user: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            { expiresIn: "1d" }
        )
        return res.status(200).send({ user: user.email, token: token })
    } else {
        return res.send('Password is wrong')
    }
    res.send(user)
})

// GET FEATURED USER COUNT
router.get('/get/user/count', async (req, res) => {
    let user = await User.countDocuments();

    if (!user) {
        return res.send('No Featured User is listed')
    }

    res.send({ users: user })
})

// DELETE USER
router.delete('/:id', async (req, res) => {
    try {
        let user = await User.findByIdAndDelete(req.params.id)
        if (user) {
            return res.status(200).json({ success: true, message: 'the user is deleted succesfully' })
        }
        else {
            return res.status(404).json({ succes: false, message: 'the user is not found' })
        }
    } catch (err) {
        return res.status(400).json({ success: false, error: err.message })
    }


})



module.exports = router