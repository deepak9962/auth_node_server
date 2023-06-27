const express = require('express')
const { checkNotAuthenticated } = require('../auth/authentication')
const User = require('../modals/user')
const router = express.Router()
const bcrypt = require('bcrypt')

router.post('/', checkNotAuthenticated, async (req, res) => {
    try {
        const savedUser = await User.findOne({ username: req.body.username }).exec()
        if (savedUser != null) {
            if (savedUser.username === req.body.username) {
                throw new Error('This username is not available, try something else')
            }
        }

        const hashedPwd = await bcrypt.hash(req.body.password, 10)
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPwd
        })

        await user.save()

        res.status(200).json({
            status: 201,
            message: 'Success, account created'
        })
    } catch (e) {
        if (e.message != null) {
            req.session.error = e.message
        }

        res.status(406).json({
            status: 406,
            message: e.message
        })
    }
})

module.exports = router