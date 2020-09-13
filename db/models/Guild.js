
const mongoose = require("mongoose");

const Guild = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    joined: {
        type: Date,
        default: Date.now
    },
    memberJoinedMessages: {
        type: Boolean,
        default: false,
    },
    memberJoinedMessage: {
        type: String,
        default: ""
    },
    memberLeftMessages: {
        type: Boolean,
        default: false,
    },
    memberJoinedChannel: {
        type: String,
        default: ""
    },
    memberLeftChannel: {
        type: String,
        default: "",
    },
    levels: {
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.model("guild", Guild);