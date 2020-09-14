const mongoose = require("mongoose");

const Reward = new mongoose.Schema({
    guildID: {
        type: String,
        required: true
    },
    roleID: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("reward", Reward);