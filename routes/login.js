const express = require('express')
const { checkNotAuthenticated } = require('../auth/authentication')
const passport = require('passport')
const router = express.Router()
const Token = require('../modals/token')
const jwt = require('jsonwebtoken')

router.post('/', checkNotAuthenticated,
    function (req, res) {
        passport.authenticate('local', { session: false }, async function (err, user, info) {
            if (err) {
                res.status(500).json({
                    status: 500,
                    message: 'Internal error, please try again'
                })
            }

            if (!user) {
                console.log(info)
                return res.status(404).json({
                    status: 404,
                    message: 'Username or Password is wrong'
                })
            }

            const username = { name: user.username }
            const at = generateAT(username)
            const rt = jwt.sign(username, process.env.REFRESH_TOKEN)

            const token = new Token({
                token: rt
            })

            await token.save()
            const responseBody = {
                status: 302,
                message: "Logged in successfully",
                username: username.name,
                ut: {
                    at: at,
                    rt: rt
                }
            }

            res.status(302).json(responseBody)
        })(req, res)
    }
)

router.post("/rt", async (req, res) => {
    const rt = req.body.rt
    if (rt == null) {
        return res.status(401).json({
            status: 401,
            message: 'Unauthorized, please login first'
        })
    }

    if (!(await Token.findOne({token: rt}).exec())) {
        return res.status(403).json({
            status: 403,
            message: 'Forbidden, Invalid token'
        })
    }

    jwt.verify(rt, process.env.REFRESH_TOKEN, (err, user) => {
        if (err) {
            return res.status(404).json({
                status: 404,
                message: 'Forbidden, Invalid token'
            })
        }

        const at = generateAT({name: user.name})
        res.status(201).json({
            status: 201,
            message: 'Created successfully',
            at: at
        })
    })
})

router.delete('/', async (req, res) => {
    const rt = req.body.rt
    const deleted = await Token.deleteOne({token: rt}).exec()
    if (deleted.deletedCount === 0) {
        return res.status(403).json({
            status: 403,
            message: 'Forbidden, Invalid token'
        })
    } else {
        return res.sendStatus(204)
    }
})

function generateAT(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN, {expiresIn: '3600s'})
}

module.exports = router