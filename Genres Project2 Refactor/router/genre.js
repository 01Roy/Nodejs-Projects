const express = require('express');
const router = express.Router();

const Genres = [
    {
        id: 1,
        name: "Action"
    },
    {
        id: 2,
        name: "Comedy"
    },
    {
        id: 3,
        name: "Horror"
    },
]

// GETTNG ALLL DATA FOR GENRES
router.get('/', (req, res) => {
    // send the categories of the movies genres
    res.send(Genres)

})

// GETING SPECIFIC DATA ABOUT A GENRE
router.get('/:id', (req, res) => {
    const genre = Genres.find(genre => genre.id === parseInt(req.params.id))
    res.send(genre)
})


// CREATE || POST THE DATA 
router.post('/', (req, res) => {

    // Validation
    if (!req.body.name || req.body.name.length < 3) {
        res.status(400).send('Please send the name field with more than 3 leters');
        return;
    }
    const genre = {
        id: Genres.length + 1,
        name: req.body.name
    }

    Genres.push(genre)
    res.send(genre)
})


// PUT REQUEST
router.put('/:id', (req, res) => {
    // Lookup the course
    // If not exist reture 404 not fount
    const genre = Genres.find(genre => genre.id === parseInt(req.params.id))
    if (!genre) return res.status(404).send(`the given ID is not vaild`);

    // Validatio
    // if invaild 400 bad request
    if (!req.body.name || req.body.name.length < 3) {
        res.status(400).send('Please send the name field with more than 3 leters');
        return;
    }

    // Update the value
    genre.name = req.body.name;
    res.send(genre)

})

// DELETING THE GENRE
router.delete("/:id", (req, res) => {
    // Look up thte genre
    // not fount send status 404
    const genre = Genres.find(genre => genre.id === parseInt(req.params.id))
    if (!genre) return res.status(404).send(`the given ID is not vaild`);

    // Delete
    const index = Genres.indexOf(genre);
    Genres.splice(index, 1);

    // send response
    res.send(genre)
})

module.exports = router;
