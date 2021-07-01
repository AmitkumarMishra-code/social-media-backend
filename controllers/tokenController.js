const mongoose = require('mongoose')

const Token = require('../models/tokens')

const addToken = async(token, email) => {
    let existingToken = await Token.findOne({ email })
    if (existingToken) {
        await existingToken.remove()
    }
    let newtoken = new Token({ token, email })
    let addedToken = await newtoken.save()
    return { status: true, message: 'added' }
}

const logoutUser = async(email) => {
    let token = Token.findOne({ email })
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