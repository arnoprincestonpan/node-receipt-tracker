// import packages using CommonJS Modules (i.e. const jam = require('jam'))
// ES Modules might not be supported by default (i.e. import ... from ...)

const express = require('express');
const bodyParser = require('body-parser');
const { v4 : uuidv4} = require('uuid');

// let's use the package express()
const app = express();

// make a port to listen to requests
const port = 3000;

app.set('view engine', 'ejs'); // using EJS for views (templates)
app.use(bodyParser.urlencoded({ extended: true})); // using body-parser to parse data
app.use(express.static('public')); // server static files from 'public' folder (i.e. CSS, JS, etc/)

// create an array of Objects for receipts

const receipts = [
    {
        id: uuidv4(), // unique ID
        name: "Groceries",
        date: new Date(), // latest date and time
        categories: ['food'],
        overallCost: 55.75
    },
    {
        id: uuidv4(),
        name: "Gas",
        date: new Date(),
        categories: ["transporation"],
        overallCost: 40.00
    }
];

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})