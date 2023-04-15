const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const UserModel = require("./models/User.js");
const LocationModel = require("./models/location.js");
// const Signup = require("./models/SignupCustomer.js");
const SignupCustomer = require("./models/SignupCustomer.js");
const SignupAdmin = require("./models/SignupAdmin.js");
// const DocumentSchema = require("./models/Document.js");
const cors = require('cors');
const path = require('path');


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
 *     SignupCustomer:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 50
 *         email:
 *           type: string
 *           maxLength: 100
 *         password:
 *           type: string
 *           maxLength: 20
 *         phone:
 *           type: string
 *           maxLength: 10
 *         created_at:
 *           type: string
 *           format: date-time
 * 
 * /customers:
 *   post:
 *     summary: Create a new customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupCustomer'
 *     responses:
 *       200:
 *         description: Created
 *       500:
 *         description: Error creating customer
 */


// Endpoint to create a new customer
app.post('/customers', (req, res) => {
    const { name, email, password, phone } = req.body;
    const customer = new SignupCustomer({ name, email, password, phone });
    customer.save();
    res.send(customer);
});

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Get all customers
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SignupCustomer'
 *       404:
 *         description: Not Found
 */
app.get(
    '/customers', 
    async (req, res) => { 
        const customer = await SignupCustomer.find(); // Fetch all user documents from the database
        res.send(customer); // Send the array of user documents as response
    }
);

const multer = require('multer');
const fs = require('fs');
// const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null,file.originalname);
  }
});

// Initialize upload
const upload = multer({storage: storage});

const directory = 'uploads/';
if (!fs.existsSync(directory)){
  fs.mkdirSync(directory);
}

app.post('/admins', upload.single('document'), (req, res) => {
  const { name, email, password, phone, instName, institution } = req.body;
  let document;
  document = {
    data: fs.readFileSync(path.join(__dirname, 'uploads', req.file.filename)),
    contentType: req.file.mimetype,
    fileName: req.file.originalname
  };

    const admin = new SignupAdmin({ name, email, password,phone, instName, institution, document });
    admin.save();
    // console.log(req.body);
    // console.log(document);
    res.send(admin);
});



/**
 * @swagger
* /admins:
*   get:
*     summary: Get all admins
*     responses:
*       200:
*         description: OK
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/SignupAdmin'
*       404:
*         description: Not Found
*/
app.get(
    '/admins', 
    async (req, res) => { 
        const admin = await SignupAdmin.find();  // Fetch all user documents from the database
        res.send(admin); // Send the array of user documents as response
    }
);

app.get(
    '/adminss', 
    async (req, res) => { 
        const admin = await SignupAdmin.find();  // Fetch all user documents from the database
        const documents = admin.map(user => user.document);
        res.send(documents); // Send an array of all user documents as response
    }
);

app.get('/admins/:id/document', async (req, res) => {
    const admin = await SignupAdmin.findById(req.params.id);
    if (!admin) {
      return res.status(404).send('Admin not found');
    }
    const { data, contentType, fileName } = admin.document;
    res.set('Content-Type', contentType);
    res.set('Content-Disposition', `attachment; filename=${fileName}`);
    res.send(data)
  });

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

app.get(
  '/api/locations/garages',
  async (req, res) => {
    const garages = await LocationModel.find({ type: 'garage' });
    res.send(garages);
  }
);

app.get(
  '/api/locations/hospitals',
  async (req, res) => {
    const garages = await LocationModel.find({ type: 'hospital' });
    res.send(garages);
  }
);

app.get(
  '/api/locations/petrolpump',
  async (req, res) => {
    const garages = await LocationModel.find({ type: 'petrol-pump' });
    res.send(garages);
  }
);


app.listen(
    5000,
    () => console.log("Backend is running")
);