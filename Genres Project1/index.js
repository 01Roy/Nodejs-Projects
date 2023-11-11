const express = require('express')
const Joi = require('joi');
const app = express();
app.use(express.json())

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
app.get('/api/genres', (req, res) => {
    // send the categories of the movies genres
    res.send(Genres)

})

// GETING SPECIFIC DATA ABOUT A GENRE
app.get('/api/genre/:id', (req, res) => {
    const genre = Genres.find(genre => genre.id === parseInt(req.params.id))
    res.send(genre)
})


// CREATE || POST THE DATA 
app.post('/api/genre', (req, res) => {

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
app.put('/api/genre/:id', (req, res) => {
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
app.delete("/api/genre/:id", (req, res) => {
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


app.listen(3000, () => console.log(`Server is running on port 3000`))