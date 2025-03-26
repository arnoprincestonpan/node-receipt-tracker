// import packages using CommonJS Modules (i.e. const jam = require('jam'))
// ES Modules might not be supported by default (i.e. import ... from ...)

const express = require('express');
const bodyParser = require('body-parser');
const { v4 : uuidv4} = require('uuid');
const methodOverride = require('method-override');
const sampleReceipts = require('./data/sample-receipts.json');

// let's use the package express()
const app = express();

// make a port to listen to requests
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true})); // using body-parser to parse data
app.use(methodOverride('_method'));
app.use(express.static('public')); // server static files from 'public' folder (i.e. CSS, JS, etc/)

// use View Engine
const path = require('path'); // use path package from node.js
const { listen } = require('express/lib/application');
app.set('view engine', 'ejs'); // set view engine as ejs
app.set('views', path.join(__dirname, "..", 'views')); // set directory views

// create an array of Objects for receipts

let receipts = [];

// const receipts = [
//     {
//         id: uuidv4(), // unique ID
//         name: "Groceries",
//         date: new Date(), // latest date and time
//         categories: ['food', 'snacks'],
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
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 5; //default limit to 5 per page

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedReceipts = receipts.slice(startIndex, endIndex);

        res.render('index', {
            receipts: paginatedReceipts,
            total: receipts.length,
            page: page,
            limit: limit
        })
    } catch (error){

    }
});

// READ (GET) Search
app.get('/api/v1/search', async (req, res, next) => {
    try {
        const searchTerm = req.query.term ? req.query.term.toLowerCase() : "";
        const searchType = req.query.type;

        let filteredReceipts = receipts;
        if(searchTerm){
            switch(searchType){
                case 'category':
                    filteredReceipts = receipts.filter(receipt =>
                        receipt.categories.some(category => category.toLowerCase().includes(searchTerm))
                    );
                    break;
                case 'name':
                    filteredReceipts = receipts.filter(receipt => 
                        receipt.name.toLowerCase().includes(searchTerm));
                    break;
                case 'date':
                    filteredReceipts = receipts.filter(receipt => {
                        const searchDate = new Date(searchTerm);
                        if(isNaN(searchDate.getTime())){
                            // checks for proper date submission
                            return false;
                        }
                        const receiptDate = new Date(receipt.date);
                        // Date.getDate() gets the actual Day of the Month
                        return(
                            receiptDate.getFullYear() === searchDate.getFullYear()
                                && receiptDate.getMonth() === searchDate.getMonth()
                                && receiptDate.getDate() === searchDate.getDate()
                        )
                    });
                    break;
                default:
                    // Search by Category is Default
                    filteredReceipts = receipts.filter(receipt =>
                        receipt.categories.some(category => category.toLowerCase().includes(searchTerm))
                    );
            };
        }

        res.json(filteredReceipts);
    } catch (error) {
        next(error);
    }
});

// Create (POST)
app.post('/api/v1/', async (req, res, next) => {
    try {
        const { name, date, categories : categoriesString, overallCost } = req.body;

        const errors = [];
    
        if(!name || name.trim() === ""){
            errors.push(`Name is required. Name: ${name}`);
        }
    
        if(!date){
            errors.push(`Date is required. Date: ${date}`);
        } else if(isNaN(new Date(date))){
            errors.push(`Invalid date format. Date: ${date}`);
        }

        let categories = [];

        if(categoriesString){
            categories = categoriesString
            .split(',')
            .map(category => category.trim())
            .filter(category => category !== "");
        }

    
        if(!categories || categories.length === 0){
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
        res.status(201).redirect('/'); 
    } catch (error) {
        next(error);
    }
});

// Update (PUT)
app.put('/api/v1/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const receiptIndex = receipts.findIndex(receipt => receipt.id === id);
        
        // IF CANNOT find the id
        if (receiptIndex === -1){
            const notFoundError = new Error("Receipt not Found.");
            notFoundError.status = 404;
            throw notFoundError;
        };

        const overallCost = req.body.overallCost ? parseFloat(req.body.overallCost) : req.body.overallCost;
        const categories = req.body.categories ? req.body.categories.split(',').map(category => category.trim()) : [] 

        receipts[receiptIndex] = {
            ...receipts[receiptIndex],
            ...req.body,
            categories: categories,
            overallCost: overallCost
            // categories: req.body.categories.split(',').map(category => category.trim())
        };
        // res.json(receipts[receiptIndex]);
        // res.redirect(`/edit/${id}`);
        res.redirect(`/`)
    } catch (error){
        next(error);
    }
});

// Delete (DELETE)
app.delete('/api/v1/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const receiptIndex = receipts.findIndex(receipt => receipt.id === id);

        console.log("Before " + receiptIndex);
        // If CANNOT find the id
        if(receiptIndex === -1){
            console.log(receiptIndex);
            const notFoundError = new Error("Receipt not found");
            notFoundError.status = 404;
            throw notFoundError;
        };
    
        receipts.splice(receiptIndex, 1); // delete one at index 
        res.status(204).redirect('/');
    } catch (error){
        next(error);
    }
});

// Populate with Samples (POST)
app.post('/api/v1/sample', async (req, res, next) => {
    try {    
        receipts = [...sampleReceipts];
        res.status(201).redirect('/'); 
    } catch (error) {
        next(error);
    }
});

/* Regular Access from EJS or frontend */
app.get('/', async (req, res, next) => {
    try {
        console.log(receipts);
        res.render('index', {receipts: receipts}); // Render the view, go to index.ejs and pass array of objects receipts into receipts 
    } catch (error) {
        next(error);
    }
});

app.get('/edit/:id', async(req,res, next) => {
    try{
        const receiptId = req.params.id;

        const receipt = receipts.find(receipt => receipt.id === receiptId);
    
        if(!receipt){
            const notFoundError = new Error("Receipt not Found.");
            notFoundError.status = 404;
            throw notFoundError;
        }

        res.render('edit', { receipt: receipt})
    } catch (error) {
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