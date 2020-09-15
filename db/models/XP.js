
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

XP.statics.getRank = async function (user) {
    const allUsers = await this.find({})

    const sorted = allUsers.sort((a, b) => b.xp - a.xp)

    const mapped = sorted.map((u, i) => ({
        userID: u.userID,
        xp: u.xp,
        rank: i + 1
    }))
    return mapped.find(u => u.userID == user.userID).rank
}

module.exports = mongoose.model("xp", XP);