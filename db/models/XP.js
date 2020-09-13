
const mongoose = require("mongoose");
const { calculateLevel } = require("../functions")

const XP = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    guildID: {
        type: String,
        required: true
    },
    xp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 0
    }
});

XP.pre("save", function (next) {
    const currentLevel = calculateLevel(this.xp)
    this.level = currentLevel
    next()
})

module.exports = mongoose.model("xp", XP);