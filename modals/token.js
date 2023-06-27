const mongoos = require('mongoose').default

const tokenSchema = new mongoos.Schema({
    token: {
        type: String,
        required: true
    }
})

module.exports = mongoos.model('Token', tokenSchema)