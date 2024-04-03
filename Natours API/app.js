const express = require('express')
const app = express();
const PORT = 3000;
const fs = require('fs')

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

app.use(express.json())

// GET ALL TOURS
app.get('/api/v1/tours', async (req, res) => {
    res.status(200).json(
        {
            status: "success",
            results: tours.length,
            data: {
                tours: tours
            }
        }
    )
})

// GET SPECFIC TOUR BY ID
app.get('/api/v1/tours/:id', async (req, res) => {
    const id = req.params.id * 1;
    console.log(id)

    const tour = tours.find(el => el.id === id)

    // if (id > tours.length) { //FIRST APPROCH 
    if (!tour) {                  // SECOND APPROCH
        res.status(404).json({
            status: "fail",
            message: "Invaild ID"
        })
    }

    res.status(200).json(
        {
            status: "success",
            data: {
                tour
            }
        }
    )
})

// UPDATE THE TOUR
app.patch("/api/v1/tours/:id", (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(400).json({
            status: "Fail",
            message: "Invaild ID"
        })
    }

    res.status(200).json({
        status: "success",
        message: "Updated Successfully"
    })

})


// CREATE A TOUR
app.post('/api/v1/tours', (req, res) => {
    const newId = tours.length;
    const newTour = Object.assign({ id: newId }, req.body)



    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), 'utf8',
        err => {
            if (err) {
                res.status(500).json({
                    status: 'error',
                    message: 'Failed to write to file'
                });
            } else {
                res.status(201).json({
                    status: "success",
                    data: {
                        tour: newTour
                    }
                })
            }

        })
})

// DELETE THE TOUR
app.delete("/api/v1/tours/:id", (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(400).json({
            status: "Fail",
            message: "Invaild ID"
        })
    }

    res.status(204).json({
        status: "success",
        message: null
    })

})



app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`)
})