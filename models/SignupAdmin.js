const mongoose = require("mongoose");
const { Schema } = mongoose;

const SignupAdminSchema = new Schema(
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
        },
        instName : {
            type:String,
            length:100
        },
        institution : {
            type:String,
            length:100
        },
        document: {
            data: Buffer,
            contentType: String,
            fileName: String
        },
        assigned_hospitals: [{
            type: Schema.Types.ObjectId,
            ref: 'Hospital',
          }],
        assigned_garage: [{
        type: Schema.Types.ObjectId,
        ref: 'Garage',
        }],

    })



module.exports = mongoose.model("Admin", SignupAdminSchema);