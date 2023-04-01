// const express = require("express");
// const bodyParser = require("body-parser");
// const UserModel = require("../models/User.js");

// const router = express.Router();
// router.use(bodyParser.json());

// router.post(
//     '/', 
//     async (req, res) => { 
//         const { email, password } = req.body; // Destructure name and email properties from request body
//         console.log(email, password);
//         const user = new UserModel({ email, password }); // Create a new user document
//         await user.save(); // Save the user document to the database
//         res.send(user); // Send the user document as response
//     }
// );

// router.get(
//     '/', 
//     async (req, res) => { 
//         const users = await UserModel.find(); // Fetch all user documents from the database
//         res.send(users); // Send the array of user documents as response
//     }
// );

// module.exports = router;
