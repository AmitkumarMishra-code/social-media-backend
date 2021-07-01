const express = require('express')
const jwt = require('jsonwebtoken');

const { followUser, unfollowUser } = require('../controllers/userController')
const router = express.Router()

router.post('/:id', async(req, res) => {
    const userToFollow = req.params.id
    let token = req.headers['authorization'].split(' ')[1]
    try {
        let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        let response = await followUser(userToFollow, decoded.username)
        if (response.status) {
            res.status(200).json(response.message)
        } else {
            res.status(400).json(response.message)
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.delete('/:id', async(req, res) => {
    const userToFollow = req.params.id
    let token = req.headers['authorization'].split(' ')[1]
    try {
        let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        let response = await unfollowUser(userToFollow, decoded.username)
        if (response.status) {
            res.status(200).json(response.message)
        } else {
            res.status(400).json(response.message)
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})


module.exports = router;