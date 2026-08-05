const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        unique : [true, "User name Already exist"],
        required : true
    },
    email : {
        type : String,
        unique : [true , "Email Already exist"],
        required : true,
    },
    password : {
        type : String,
        required : true,
        select : false,
    }
})

const UserModel = mongoose.model("users", UserSchema)

module.exports = UserModel;