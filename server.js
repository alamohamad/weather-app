// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware */
const bodyParser = require('body-parser');
// Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// Setup Server
const port = 8000;
const server = app.listen(port, listening);
function listening() {
    console.log(`Server is running on localhost:${port}`);
}

// for testing
app.get("/", function(req, res) {
    res.send("Hello world!");
});

// GET route that returns the projectData object
app.get('/all', function(req, res) {
    console.log('GET request /all');
    res.send(projectData);
});

// POST route that adds incoming data to projectData
app.post('/add', function(req, res) {
    const { temperature, date, userResponse } = req.body;
    console.log('POST request /add with data:', req.body);
    projectData = {
        temperature: temperature,
        date: date,
        userResponse: userResponse
    };
    console.log('Updated projectData:', projectData);
    res.send(projectData);
});
