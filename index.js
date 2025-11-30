const express = require('express');
const axios = require('axios');
const app = express();

// Use dotenv to read .env file variables
require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// This will now be loaded correctly from your .env file
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// ---
// TODO: ROUTE 1 - Homepage (GET)
// ---
app.get('/', async (req, res) => {
    
    // 
    // === FIX 1: REPLACE THIS WITH YOUR REAL OBJECT ID ===
    //
    const customObjectUrl = 'https://api.hubapi.com/crm/v3/objects/2-194050940'; // e.g., '2-1234567' or 'p_pets'
    
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    
    //
    // === FIX 2: CHANGED 'species' to 'species' ===
    //
    const params = {
        properties: 'name,bio,species' 
    };

    try {
        const resp = await axios.get(customObjectUrl, { headers, params });
        const data = resp.data.results;
        res.render('homepage', { title: 'Custom Object Table | Practicum', data });      
    } catch (error) {
        console.error(error);
        // Send a more user-friendly error to the browser
        res.status(500).send(`Error fetching data from HubSpot. Check your console. <br/>Error: ${error.message}`);
    }
});


// ---
// TODO: ROUTE 2 - Form Page (GET)
// ---
app.get('/update-cobj', (req, res) => {
    try {
        res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
    } catch (error) {
        console.error(error);
    }
});


// ---
// TODO: ROUTE 3 - Form Submission (POST)
// ---
app.post('/update-cobj', async (req, res) => {

    const newRecord = {
        properties: {
            //
            // === FIX 3: CHANGED 'species' to 'species' ===
            //
            "name": req.body.name,
            "bio": req.body.bio,
            "species": req.body.species
        }
    }

    //
    // === FIX 1 (Again): REPLACE THIS WITH YOUR REAL OBJECT ID ===
    //
    const createRecordUrl = 'https://api.hubapi.com/crm/v3/objects/2-194050940'; // e.g., '2-1234567' or 'p_pets'
    
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.post(createRecordUrl, newRecord, { headers } );
        res.redirect('/');
    } catch(err) {
        console.error(err.response ? err.response.data : err.message);
        res.status(500).send(`Error creating record in HubSpot. Check your console. <br/>Error: ${err.message}`);
    }
});


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));