const express = require('express')
const { checkAuthenticated } = require('../auth/authentication')
const router = express.Router()
const User = require('../modals/user')

router.get('/', checkAuthenticated, async (req, res) => {
    res.json(await User.findOne({ username: req.user.name }).exec())
})

router.get('/ka', (req, res) => {
    res.sendStatus(200);
})

module.exports = router