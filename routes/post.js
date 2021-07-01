const express = require('express');
const jwt = require('jsonwebtoken');

const { createPost, listPosts, deletePost } = require('../controllers/postCOntroller');

const router = express.Router();

router.post('/', async(req, res) => {
    let token = req.headers['authorization'].split(' ')[1]
    try {
        let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        let response = await createPost(req.body.post, decoded.username)
        if (response.status) {
            res.status(200).json(response.message)
        } else {
            res.status(400).json(response.message)
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.get('/', async(req, res) => {
    let token = req.headers['authorization'].split(' ')[1]
    try {
        let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        let response = await listPosts(decoded.username)
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
    let token = req.headers['authorization'].split(' ')[1]
    try {
        let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        let response = await deletePost(req.params.id, decoded.username)
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