const mongoose = require('mongoose');

const User = require('../models/user');
const bcrypt = require('bcrypt');

const addUser = async(username, email, password, name = '') => {
    if (!username.length) {
        return { status: false, message: 'Username cannot be empty' }
    }
    if (!email.length) {
        return { status: false, message: 'Email cannot be empty' }
    }
    if (!password.length) {
        return { status: false, message: 'Password cannot be empty' }
    }
    if (!(/.*@.*\..*/.test(email))) {
        return { status: false, message: 'Invalid Email' }
    }

    let hashedPassword = await bcrypt.hash(password, 10)
    try {
        let newUser = new User({ username, email, password: hashedPassword, name })
        let user = await newUser.save()
        return { status: true, message: `New account created with email id: ${email}` }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

const loginUser = async(username, password) => {
    if (!username.length) {
        return { status: false, message: 'Username cannot be empty' }
    }
    if (!password.length) {
        return { status: false, message: 'Password cannot be empty' }
    }
    try {
        let user = await User.findOne({ username })
        if (!user) {
            return { status: false, message: 'Username not found!' }
        } else {
            let result = bcrypt.compare(password, user.password)
            if (!result) {
                return { status: false, message: 'Invalid Password' }
            } else {
                return { status: true, message: 'Login Successful' }
            }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

module.exports = {
    addUser,
    loginUser,
}