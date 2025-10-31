require("dotenv").config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const TOKEN = process.env.HUBSPOT_ACCESS_TOKEN; 
const BASE_URL = "https://api.hubapi.com";
const CUSTOM_OBJECT_API_NAME = "p_pets"; 
// ------------------------

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.


// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// 1. POST /update-cobj: Create a new Pet record
app.post("/update-cobj", async (req, res) => {
    const { name, bio, species } = req.body; 

    const data = {
        properties: {
            name: name,
            bio: bio,
            species: species,
        },
    };

    try {
        await axios.post(
            `${BASE_URL}/crm/v3/objects/${CUSTOM_OBJECT_API_NAME}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );
        
        res.redirect("/");

    } catch (error) {
        console.error("Error creating custom object record:", error.response?.data || error.message);
        res.status(500).send("Error creating Pet record. Check server logs for details.");
    }
});



// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// 2. GET /update-cobj: Render the form to create a new record
app.get("/update-cobj", (req, res) => {
    res.render("updates", {
        title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
    });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// 3. GET /: Homepage route to display all Custom Object records
app.get("/", async (req, res) => {
    const customObjectEndpoint = `${BASE_URL}/crm/v3/objects/${CUSTOM_OBJECT_API_NAME}`;

    const params = {
        properties: 'name,bio,species'
    };

    try {
        const response = await axios.get(customObjectEndpoint, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                "Content-Type": "application/json",
            },
            params: params,
        });

        const pets = response.data.results;

        res.render("homepage", {
            title: "Pet Records List | Integrating With HubSpot I Practicum",
            pets: pets,
        });
    } catch (error) {
        console.error("Error retrieving custom object records:", error.response?.data || error.message);
        res.status(500).send("Error retrieving data from HubSpot.");
    }
});


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));