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

const followUser = async(userToFollow, currentUser) => {
    try {
        let validUser = await User.findOne({ username: userToFollow })
        if (!validUser) {
            return { status: false, message: `This user doesn't exist! Try again!!` }
        } else {
            let user = await User.findOne({ username: currentUser })
            validUser.followers.push(user._id)
            await validUser.save()
            user.following.push(validUser._id)
            await user.save()
            return { status: true, message: 'Successfully followed ' + userToFollow }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

const unfollowUser = async(userToFollow, currentUser) => {
    try {
        let validUser = await User.findOne({ username: userToFollow })
        if (!validUser) {
            return { status: false, message: `This user doesn't exist! Try again!!` }
        } else {
            let user = await User.findOne({ username: currentUser })

            validUser.followers.pull(user._id)
            await validUser.save()
            user.following.pull(validUser._id)
            await user.save()
            return { status: true, message: 'Successfully unfollowed ' + userToFollow }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

const blockUser = async(userToBlock, currentUser) => {
    try {
        let validUser = await User.findOne({ username: userToBlock })
        if (!validUser) {
            return { status: false, message: `This user doesn't exist! Try again!!` }
        } else {
            let user = await User.findOne({ username: currentUser })

            validUser.following.pull(user._id)
            await validUser.save()
            user.followers.pull(validUser._id)
            await user.save()
            return { status: true, message: 'Successfully blocked ' + userToBlock }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

module.exports = {
    addUser,
    loginUser,
    followUser,
    unfollowUser,
    blockUser
}