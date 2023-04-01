const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const UserModel = require("./models/User.js");
const LocationModel = require("./models/location.js");
const Signup = require("./models/Signup.js");
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const swaggerJSDoc = require('swagger-jsdoc');

mongoose.connect("mongodb+srv://guptaisha941:JDBzx3l3IZxLRHuW@onroadassist.ugutu1z.mongodb.net/?retryWrites=true&w=majority")
.then(() => {console.log("Connected");})
.catch(() => {console.log("Failed");});

const app = express();
app.use(cors());
app.use(bodyParser.json()); // Parse JSON request body
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request body

// Define the Swagger specification using swagger-jsdoc
const swaggerOptions = {
    swaggerDefinition: {openapi: '3.0.0',info: {title: 'My API',version: '1.0.0',description: 'API documentation using Swagger',},
        servers: [{url: 'http://localhost:5000',description: 'Local server',},],},apis: ['./index.js'],};
  const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       required:
 *         - email
 *         - password
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Created
 *       400:
 *         description: Bad request
 */

app.post(
    '/users', 
    (req, res) => { 
        const {  email,password } = req.body; // Destructure name and email properties from request body
        console.log(email,password)
        const user = new UserModel({ email,password }); // Create a new user document
        user.save(); // Save the user document to the database
        res.send(user); // Send the user document as response
    }
);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
app.get(
    '/users', 
    async (req, res) => { 
        const users = await UserModel.find(); // Fetch all user documents from the database
        res.send(users); // Send the array of user documents as response
    }
);

/**
 * @swagger
 * components:
 *   schemas:
 *     Location:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         lat:
 *           type: number
 *         lng:
 *           type: number
 *         type:
 *           type: string
 *       required:
 *         - name
 *         - lat
 *         - lng
 *         - type
 */

/**
 * @swagger
 * /api/locations:
 *   post:
 *     summary: Create a new location
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Location'
 *     responses:
 *       200:
 *         description: Created
 *       400:
 *         description: Bad request
 */

app.post(
    '/api/locations', 
     (req, res) => {
        const { name, lat, lng, type } = req.body;
        const location = new LocationModel({ name, lat, lng, type });
        location.save();
        res.send(location);
});


/**
 * @swagger
 * /api/locations:
 *   get:
 *     summary: Get all locations
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not Found
*         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Location'
 */
app.get(
    '/api/locations', 
    async (req, res) => { 
        const locations = await LocationModel.find();
        res.send(locations); // Send the array of user documents as response
    }
);


app.listen(
    5000,
    () => console.log("Backend is running")
);

