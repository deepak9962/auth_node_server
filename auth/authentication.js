const jwt = require('jsonwebtoken')

function checkAuthenticated(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        return res.status(401).json({
            status: 401,
            message: 'Unauthorized, login required'
        })
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(403).json({
                status: 403,
                message: 'Forbidden, Invalid token'
            })
        }

        req.user = user
        next()
    })
}

function checkNotAuthenticated(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        return next()
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(403).json({
                status: 403,
                message: 'Forbidden, Invalid token'
            })
        }

        req.user = user
        res.sendStatus(204)
    })
}

module.exports = { checkAuthenticated, checkNotAuthenticated }