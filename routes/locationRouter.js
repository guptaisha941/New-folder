// const express = require("express");
// const bodyParser = require("body-parser");
// const LocationModel = require("../models/location.js");

// const router = express.Router();
// router.use(bodyParser.json());

// router.post(
//     '/', 
//     async (req, res) => { 
//         const { name, latitude, longitude } = req.body; // Destructure name, latitude, and longitude properties from request body
//         console.log(name, latitude, longitude);
//         const location = new LocationModel({ name, latitude, longitude }); // Create a new location document
//         await location.save(); // Save the location document to the database
//         res.send(location); // Send the location document as response
//     }
// );

// router.get(
//     '/', 
//     (req, res) => { 
//         const locations = LocationModel.find(); // Fetch all location documents from the database
//         res.send(locations); // Send the array of location documents as response
//     }
// );

// module.exports = router;
