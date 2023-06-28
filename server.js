if (process.env.MODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const flash = require('express-flash')
const session = require('express-session')

const cors = require('cors')

const mongoose = require('mongoose').default
const User = require('./modals/user')
const passport = require('passport')
const initializePassport = require('./auth/passport-config')

const indexRouter = require('./routes/index')
const loginRouter = require('./routes/login')
const registerRouter = require('./routes/register')
const postRouter = require('./routes/post')

const app = express()

app.use(express.json())
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(cors())

app.use(passport.initialize({}))
app.use(passport.session({}))

mongoose.connect(process.env.DATABASE_URL).then(() => {
    console.log('Connected to mongoose')

    initializePassport(
        passport,
        id => userData('id', id),
        name => userData('name', name)
    )
}, (err) => {
    console.log(err)
})

async function userData(key, query) {
    let userQuery;
    switch (key) {
        case 'id': {
            userQuery = await User.findOne({ _id: query }).exec()
        }
            break;
        case 'name': {
            userQuery = await User.findOne({ username: query }).exec()
        }
            break;
        default: {
            throw new Error('Invalid key: ' + key)
        }
    }

    if (userQuery != null) {
        return userQuery
    }
}

app.use('/', indexRouter)
app.use('/login', loginRouter)
app.use('/register', registerRouter)
app.use('/post', postRouter)

setInterval(() => {
    const data = fetch(process.env.KA).json();
    console.log(data);
}, (1000 * 60) * 10);

app.listen(process.env.PORT)