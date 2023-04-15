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

module.exports = mongoose.model("Customer", SignupCustomerSchema);
// module.exports = mongoose.model("Admin", SignupAdminSchema);

// const CustomerSchema = new Schema({
//     signup: SignupCustomerSchema
// });

// const AdminSchema = new Schema({
//     signup: SignupAdminSchema
// });

// const Customer = mongoose.model("Customer", CustomerSchema);
// const Admin = mongoose.model("Admin", AdminSchema);

// module.exports = { Customer, Admin };

// module.exports = mongoose.model("Customer", SignupCustomerSchema);
