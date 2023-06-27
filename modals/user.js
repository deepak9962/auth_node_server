const mongoose = require('mongoose').default
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: Object,
        required: true
    }
})

userSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('User', userSchema)