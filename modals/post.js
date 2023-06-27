const mongoose = require('mongoose').default
const passportLocalMongoose = require('passport-local-mongoose')

const postSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    like: {
        type: Boolean,
        required: false
    },
    comments: {
        type: Array,
        required: false
    },
    status: {
        type: String,
        required: true
    }
})

postSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('Post', postSchema)