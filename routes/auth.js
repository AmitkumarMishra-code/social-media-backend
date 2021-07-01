const express = require('express')
const jwt = require('jsonwebtoken');
const { addToken, findToken, logoutUser } = require('../controllers/tokenController');
const { addUser, loginUser } = require('../controllers/userController');

const router = express.Router();

router.post('/signup', async(req, res) => {
    const { username, email, password, name } = req.body
    if (!username || !email || !password) {
        res.status(401).json({ message: 'Missing Required Fields!' })
    } else {
        let response = await addUser(username, email, password, name)
        if (response.status) {
            res.status(200).json(response.message)
        } else {
            res.status(400).json(response.message)
        }
    }
})

router.post('/login', async(req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(401).json({ message: 'Missing Required Fields!' })
    } else {
        let response = await loginUser(username, password)
        if (response.status) {
            let payload = {
                username
            }
            let token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME })
            let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME })
            await addToken(refreshToken, username)
            res.status(200).json({ access_Token: token, refresh_Token: refreshToken })
        } else {
            res.status(400).send(response.message)
        }
    }
})

router.post('/logout', async(req, res) => {
    let token = req.headers['authorization'].split(' ')[1]
    try {
        let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        await logoutUser(decoded.username)
        res.status(200).json({ message: 'Logged out successfully' })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.post('/token', async(req, res) => {
    const { token } = req.body
    let validToken = await findToken(token)
    if (!token || !validToken.status) {
        res.send(401).json({ message: 'Invalid or missing token!' })
    } else {
        try {
            let decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
            let payload = {
                username: decode.username
            }
            let newAccessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME })
            res.status(200).json({ 'access_token': newAccessToken })
        } catch (error) {
            res.status(401).json({ message: error.message })
        }
    }
})



module.exports = router;