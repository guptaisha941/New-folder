

const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
    {
        email: {
            type:String,
            length:100,
        },
        password: {
            type:String,
            length:20,
        },
        created_at : {
            type:Date,
            default:new Date().getTime()
        }
    })

module.exports = mongoose.model("User", UserSchema);
