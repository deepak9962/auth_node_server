const express = require('express')
const { checkAuthenticated } = require('../auth/authentication')
const router = express.Router()
const User = require('../modals/user')
const Post = require('../modals/post')

router.get('/', checkAuthenticated, async (req, res) => {
    try {
        const allPosts = await Post.find({}, { _id: 0, username: 1, comments: 1 }).exec()
        res.status(200).json({
            status: 200,
            message: 'Posts with comments',
            posts: allPosts
        })
    } catch (e) {
        res.status(405).json({
            status: 405,
            message: e.message
        })
    }
})

router.get('/status', checkAuthenticated, async (req, res) => {
    try {
        const status = await Post.findOne({ username: req.user.name }, { _id: 0, like: 1, comments: 1 }).exec()
        res.status(200).json({
            status: 200,
            message: 'User status',
            username: req.user.name,
            status: status
        })
    } catch (e) {
        res.status(405).json({
            status: 405,
            message: e.message
        })
    }
})

router.post('/', checkAuthenticated, async (req, res) => {
    const body = req.body

    try {
        const savedPost = await Post.findOne({ username: req.user.name }).exec()
        if (savedPost != null) {
            if (savedPost.username === req.user.name) {
                throw new Error('Post already exists in this account')
            }
        }

        console.log(body + ' && ' + req.user.name)
        let postVerify = {
            username: req.user.name,
            like: body.like,
            status: body.status
        }

        if (body.comment != null) {
            postVerify = {
                username: req.user.name,
                like: body.like,
                comments: [{ comment: body.comment }],
                status: body.status
            }
        }
        const post = new Post(postVerify)

        await post.save()
        const postStatus = await Post.find({ username: req.user.name })
        console.log(postStatus)

        res.status(200).json({
            status: 200,
            message: 'post added'
        })
    } catch (e) {
        res.status(405).json({
            status: 405,
            message: e.message
        })
    }
})

router.put('/', checkAuthenticated, async (req, res) => {
    const body = req.body
    try {
        const query = {
            username: req.user.name
        }
        let newStatus = {
            $set: {
                like: body.like,
                status: body.status
            }
        }

        if (body.comment != null) {
            newStatus = {
                $push: {
                    comments: { comment: body.comment }
                },
                $set: {
                    like: body.like,
                    status: body.status
                }
            }
        }
        
        const updateStatus = await Post.updateOne(query, newStatus)
        console.log('updateStatus: ' + updateStatus)

        const postStatus = await Post.findOne({ username: req.user.name }).exec()
        console.log(postStatus)

        res.status(202).json({
            status: 202,
            message: 'Post updated, Successfully'
        })

    } catch (e) {
        console.log('onCatch() < put < post: ' + e.message)

        res.status(406).json({
            status: 406,
            message: e.message
        })
    }
})

router.delete('/', checkAuthenticated, async (req, res) => {
    const body = req.body.delete

    console.log(body)

    try {
        if (body.delete === null) {
            return res.status(403).json({
                status: 403,
                message: 'Invalid request'
            })
        }

        const post = await Post.findOne({ username: req.user.name }).exec()
        console.log(post)

        if (post === null) {
            return res.status(404).json({
                status: 404,
                message: 'Post not found'
            })
        }

        const deleteQuery = { username: req.user.name }
        const deleted = await Post.deleteOne(deleteQuery).exec()

        console.log(deleted)
        if (deleted.deletedCount === 0) {
            return res.status(403).json({
                status: 403,
                message: 'Could not delete, Not found'
            })
        }

        res.status(203)
    } catch (e) {
        res.status(406).json({
            status: 406,
            message: e.message
        })
    }
})

module.exports = router