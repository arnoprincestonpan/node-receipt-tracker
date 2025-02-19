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
app.get('/api/v1/', async (req, res) => {
    res.json(receipts);
});

// Create (POST)
app.post('/api/v1/', async (req, res, next) => {
    try {
        const { name, date, categories, overallCost } = req.body;

        const errors = [];
    
        if(!name || name.trim() === ""){
            errors.push(`Name is required. Name: ${name}`);
        }
    
        if(!date){
            errors.push(`Date is required. Date: ${date}`);
        } else if(isNaN(new Date(date))){
            errors.push(`Invalid date format. Date: ${date}`);
        }
    
        if(!categories || !Array.isArray(categories) || categories.length === 0){
            errors.push(`Categories are required. Categories Array must not be empty. Categories: ${categories}`)
        }else if (categories.some(category => typeof category !== "string" || category.trim() === "")){
            errors.push(`All categories must be non-empty strings. Categories: ${categories}`);
        }
        
        if(overallCost === undefined || overallCost === null || isNaN(parseFloat(overallCost))){
            errors.push(`OverallCost is required and must be a number. OverallCost: ${overallCost}`);
        }
    
        if(errors.length > 0){
            const validationError = new Error("Validation Failed.");
            validationError.status = 400;
            validationError.errors = errors;
            throw validationError;
        }
    
        const newReceipt = {
            id: uuidv4(),
            name: name,
            date: new Date(date),
            categories: categories.map(category => category.trim()), 
            overallCost: parseFloat(overallCost),
        };
        receipts.push(newReceipt);
        res.status(201).json(newReceipt); 
    } catch (error) {
        next(error);
    }
});

// Update (PUT)
app.put('/api/v1/:id', async (req, res) => {
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
app.delete('/api/v1/:id', async (req, res) => {
    try {
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
    } catch (error){
        next(error);
    }
});

// Error Handler
const errorHandler = (err, req, res, next) =>{
    console.error(err.stack);
    
    if(err.status === 400 && err.errors){
        return res.status(400).json({
            errors: err.errors
        })
    }

    res.status(err.status || 500).json({
        error: err.message || `Internal Server Error.`
    })
}

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})