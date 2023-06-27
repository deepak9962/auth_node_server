const express = require('express')
const { checkAuthenticated } = require('../auth/authentication')
const router = express.Router()
const User = require('../modals/user')

router.get('/', checkAuthenticated, async (req, res) => {
    res.json(await User.findOne({ username: req.user.name }).exec())
})

module.exports = router