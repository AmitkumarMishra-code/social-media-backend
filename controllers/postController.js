const mongoose = require('mongoose')

const Post = require('../models/posts')
const User = require('../models/user')

const createPost = async(postToCreate, author) => {
    try {
        let user = await User.findOne({ username: author })
        let newPost = new Post({ post: postToCreate, author: user._id })
        let post = await newPost.save()
        user.posts.push(post._id)
        await user.save()
        return { status: true, message: "Successfully created a new post" }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

const listPosts = async(author) => {
    try {
        let user = await User.findOne({ username: author }).populate('posts')
        let allPosts = user.posts.map(post => post)
        return { status: true, message: allPosts }

    } catch (error) {
        return { status: false, message: error.message }
    }
}

const deletePost = async(postId, author) => {
    try {
        let user = await User.findOne({ username: author })
        let post = await Post.findOne({ _id: postId })
        if (post) {
            await post.remove()
            user.posts.pull(postId)
            await user.save();
            return { status: true, message: "Successfully deleted post" }
        } else {
            return { status: false, message: "Post not found!" }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

module.exports = {
    createPost,
    listPosts,
    deletePost
}