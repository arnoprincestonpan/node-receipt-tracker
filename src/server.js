// import packages using CommonJS Modules (i.e. const jam = require('jam'))
// ES Modules might not be supported by default (i.e. import ... from ...)

const express = require('express');
const bodyParser = require('body-parser');
const { v4 : uuidv4} = require('uuid');

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

// let's use the package express()
const app = express();

// make a port to listen to requests
const port = 3000;

