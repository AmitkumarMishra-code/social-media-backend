const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        unique: true,
    },
}, { timestamps: true });

const TokenModel = mongoose.model('Token', TokenSchema);

module.exports = TokenModel;