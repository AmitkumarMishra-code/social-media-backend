const mongoose = require('mongoose')

const Token = require('../models/tokens')

const addToken = async(token, username) => {
    let existingToken = await Token.findOne({ username })
    if (existingToken) {
        await existingToken.remove()
    }
    let newtoken = new Token({ token, username })
    let addedToken = await newtoken.save()
    return { status: true, message: 'added' }
}

const logoutUser = async(username) => {
    let token = Token.findOne({ username })
    if (token) {
        await token.remove()
    }
}

const findToken = async(token) => {
    let existingToken = Token.findOne({ token })
    if (!existingToken) {
        return { status: false, message: 'Invalid Refresh Token' }
    } else {
        return { status: true, message: 'Valid User' }
    }
}

module.exports = {
    addToken,
    logoutUser,
    findToken
}