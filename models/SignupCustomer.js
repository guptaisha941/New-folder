const mongoose = require("mongoose");
const { Schema } = mongoose;

const SignupCustomerSchema = new Schema(
    {
        name: {
            type:String,
            length:50
        },
        email: {
            type:String,
            length:100,
            unique:true,
        },
        password: {
            type:String,
            length:20,
        },
        phone: {
            type:String,
            length:10,
        },
        created_at : {
            type:Date,
            default:new Date().getTime()
        }
    })

    // Define a schema for the Garage table
const GarageSchema = new Schema({
    email: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
    },
    service_type: {
      type: String,
      length: 50,
    },
    location: {
      type: String,
      length: 100,
    },
    vehicle_number: {
      type: String,
      length: 20,
    },
    vehicle_make: {
      type: String,
      length: 50,
    },
    vehicle_model: {
      type: String,
      length: 50,
    },
    additional_details: {
      type: String,
      length: 500,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending',
      },
    assigned_admin: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
    },
  });
  
  // Define a schema for the Hospital table
  const HospitalSchema = new Schema({
    email: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
    },
    location: {
      type: String,
      length: 100,
    },
    name: {
      type: String,
      length: 50,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending',
      },
    assigned_admin: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
    }
  });

const Customer = mongoose.model("Customer", SignupCustomerSchema);
const Garage = mongoose.model("Garage", GarageSchema);
const Hospital = mongoose.model("Hospital", HospitalSchema);
// module.exports = mongoose.model("Customer", SignupCustomerSchema);


module.exports = {
    Customer,
    Garage,
    Hospital,
  };
