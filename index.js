const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nodemailer = require('nodemailer');

const UserModel = require("./models/User.js");
const LocationModel = require("./models/location.js");
// const Signup = require("./models/SignupCustomer.js");
// const Customer = require("./models/SignupCustomer.js");
const SignupAdmin = require("./models/SignupAdmin.js");
const { Customer,Garage, Hospital } = require("./models/SignupCustomer.js");

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


app.get(
    '/users', 
    async (req, res) => { 
        const users = await UserModel.find(); // Fetch all user documents from the database
        res.send(users); // Send the array of user documents as response
    }
);

app.post('/customers', (req, res) => {
    const { name, email, password, phone } = req.body;
    const customer = new Customer({ name, email, password, phone });
    customer.save();
    res.send(customer);
});


app.get(
    '/customers', 
    async (req, res) => { 
        const customer = await Customer.find(); // Fetch all user documents from the database
        res.send(customer); // Send the array of user documents as response
    }
);

const multer = require('multer');
const fs = require('fs');


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



app.post(
    '/api/locations', 
     (req, res) => {
        const { name, lat, lng, type } = req.body;
        const location = new LocationModel({ name, lat, lng, type });
        location.save();
        res.send(location);
});



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

app.post(
  '/api/requests/garage', 
   async(req, res) => {
      const { email,service_type,location,vehicle_number, vehicle_make, vehicle_type,additional_details } = req.body;
      // const customer_details = await Customer.find({_id:email})
      // const admins = await SignupAdmin.find();
      // const adminEmails = admins.map(SignupAdmin => SignupAdmin.email);

      const Garag = new Garage({ email,service_type,location,vehicle_number, vehicle_make, vehicle_type,additional_details, status: 'pending' });
      await Garag.save();
      res.send(Garag);
    });

    app.get('/api/requests/garage', async (req, res) => {

        const garageRequests = await Garage.find().populate('email');
        res.json({ success: true, garageRequests });
    });

    app.get('/api/requests/garage/:requestId', async (req, res) => {

      const garageRequests = await Garage.findById(requestId);
      res.json({ success: true, garageRequests });
  });


    app.put('/api/requests/garage/:requestId', async (req, res) => {
  const requestId = req.params.requestId;
  const { status } = req.body;

  const updatedGarageRequest = await Garage.findByIdAndUpdate(
    requestId,
    { $set: {status} },
    { new: true }
  );
  
  res.json({ success: true, updatedGarageRequest });
});

    app.delete('/api/requests/garage/:id', async (req, res) => {
      try {
        const requestId = req.params.id;
    
        await Garage.findByIdAndDelete(requestId);
    
        res.json({ success: true });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ success: false, message: 'Error deleting request' });
      }
    });
    
    

// app.get(
//   '/api/requests/garage',
//   async (req, res) => {
//     const garag = await Garage.find();
//     res.send(garag);
//   }
// );


// app.post('/api/requests', async (req, res) => {
//   try {

//     if (req.body.service_type === 'Vehicle Towing Service') {
//       const garageRequest = new Garage({ ...req.body, status: 'pending' });
//       await garageRequest.save();
//       res.json({ success: true, message: 'Request submitted successfully' });
//     } else if (req.body.service_type === 'Hospital') {
//       const hospitalRequest = new Hospital({ ...req.body, status: 'pending' });
//       await hospitalRequest.save();
//       res.json({ success: true, message: 'Request submitted successfully' });
//     } else {
//       res.json({ success: false, message: 'Invalid service type' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Error submitting request' });
//   }
// });


// app.get('/api/requests/garage', async (req, res) => {
//   try {
//     // Retrieve all documents from both collections
//     const garageRequests = await Garage.find().populate('email');
//     // const hospitalRequests = await Hospital.find().populate('email');
//     res.json({ success: true, garageRequests});
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Error retrieving requests' });
//   }
// });

app.get('/api/requests/hospital', async (req, res) => {
  try {
    // Retrieve all documents from both collections
    const hospitalRequests = await Hospital.find({ status: 'pending' }).populate('email');
    // const hospitalRequests = await Hospital.find().populate('email');
    res.json({ success: true, hospitalRequests});
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error retrieving requests' });
  }
});


app.put('/api/requests/garage/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status !== 'accepted' && status !== 'declined') {
      return res.json({ success: false, message: 'Invalid status' });
    }

    const garageRequest = await Garage.findByIdAndUpdate(id, { status });
    // const hospitalRequest = await Hospital.findByIdAndUpdate(id, { status });

    if (!garageRequest) {
      return res.json({ success: false, message: 'Request not found' });
    }

    res.json({ success: true, message: 'Request updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error updating request' });
  }
});


app.put('/api/requests/hospital/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status !== 'accepted' && status !== 'declined') {
      return res.json({ success: false, message: 'Invalid status' });
    }

    // const garageRequest = await Garage.findByIdAndUpdate(id, { status });
    const hospitalRequest = await Hospital.findByIdAndUpdate(id, { status });

    if (!hospitalRequest) {
      return res.json({ success: false, message: 'Request not found' });
    }

    res.json({ success: true, message: 'Request updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error updating request' });
  }
});

// Create an endpoint for updating a request
app.patch('/api/requests/:id', async (req, res) => {
  try {
    // Determine which collection to update based on the service type
    if (req.body.service_type === 'Garage') {
      const garageRequest = await Garage.findByIdAndUpdate(req.params.id, req.body);
      res.json({ success: true, message: 'Request updated successfully', garageRequest });
    } else if (req.body.service_type === 'Hospital') {
      const hospitalRequest = await Hospital.findByIdAndUpdate(req.params.id, req.body);
      res.json({ success: true, message: 'Request updated successfully', hospitalRequest });
    } else {
      res.json({ success: false, message: 'Invalid service type' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error updating request' });
  }
});


// Create an endpoint for deleting a request
app.delete('/api/requests/:id', async (req, res) => {
  try {
    // Determine which collection to delete from based on the service type
    if (req.query.service_type === 'Garage') {
      const garageRequest = await Garage.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Request deleted successfully', garageRequest });
    } else if (req.query.service_type === 'Hospital') {
      const hospitalRequest = await Hospital.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Request deleted successfully', hospitalRequest });
    } else {
      res.json({ success: false, message: 'Invalid service type' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error deleting request' });
  }
});

app.listen(
    5000,
    () => console.log("Backend is running")
);