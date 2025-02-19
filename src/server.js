// import packages using CommonJS Modules (i.e. const jam = require('jam'))
// ES Modules might not be supported by default (i.e. import ... from ...)

const express = require('express');
const bodyParser = require('body-parser');
const { v4 : uuidv4} = require('uuid');

// let's use the package express()
const app = express();

// make a port to listen to requests
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true})); // using body-parser to parse data
app.use(express.static('public')); // server static files from 'public' folder (i.e. CSS, JS, etc/)

// create an array of Objects for receipts

const receipts = [];

// const receipts = [
//     {
//         id: uuidv4(), // unique ID
//         name: "Groceries",
//         date: new Date(), // latest date and time
//         categories: ['food'],
//         overallCost: 55.75
//     },
//     {
//         id: uuidv4(),
//         name: "Gas",
//         date: new Date(),
//         categories: ["transporation"],
//         overallCost: 40.00
//     }
// ];

/* API v1 Routes */

// Read (GET)
app.get('/api/v1/', (req, res) => {
    res.json(receipts);
});

// Create (POST)
app.post('/api/v1/', (req, res) => {
    const { name, date, categories, overallCost } = req.body;

    if(!name || !date || !categories || !overallCost){
        return res.status(400).json({
            error: `Missing Required Fields
            name: ${name}
            date: ${date}
            categories: ${categories}
            overallCost: ${overallCost}`
        });
    }

    const newReceipt = {
        id: uuidv4(),
        name: name,
        date: new Date(date),
        categories: categories || [], 
        overallCost: parseFloat(overallCost),
    };
    receipts.push(newReceipt);
    res.status(201).json(newReceipt); 
});

// Update (PUT)
app.put('/api/v1/:id', (req, res) => {
    const id = req.params.id;
    const receiptIndex = receipts.findIndex(receipt => receipt.id === id);
    // IF CANNOT find the id
    if (receiptIndex === -1){
        return res.status(404).json({
            error: "Receipt not found"
        })
    };

    receipts[receiptIndex] = {
        ...receipts[receiptIndex],
        ...req.body
    };
    res.json(receipts[receiptIndex]);
});

// Delete (DELETE)
app.delete('/api/v1/:id', (req, res) => {
    const id = req.params.id;
    const receiptIndex = receipts.findIndex(receipt => receipt.id === id);
    // If CANNOT find the id
    if(receiptIndex === -1){
        return res.status(404).json({
            error: "Receipt not found"
        });
    };

    receipts.pop(receiptIndex);
    res.status(200).json({ message: "Receipt deleted successfully."});
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})