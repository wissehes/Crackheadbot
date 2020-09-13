const mongoose = require("mongoose");

const Snipe = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    channelID: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    expireAt: {
        type: Date,
        default: Date.now,
        expires: '1h'
    },
});

module.exports = mongoose.model("snipe", Snipe);