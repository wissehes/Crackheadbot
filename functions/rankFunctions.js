const { calculateLevel } = require("../db/functions")

exports.calculateNeededXP = (xp) => {
    /**
     * This funtion calculates the amount of XP
     * that is needed to level up
     */
    let currentLevel = calculateLevel(xp)

    const nextLevel = calculateLevel(xp) + 1

    let neededXP = 0
    while (currentLevel < nextLevel) {
        neededXP++
        currentLevel = calculateLevel(xp + neededXP)
    }
    return neededXP;
}

exports.calculateXPForLevel = (level) => {
    /**
     * This function calculates the XP a certain level requires
     */
    let xp = 0
    let currentLevel = 0

    while (currentLevel != level) {
        xp++
        currentLevel = calculateLevel(xp)
    }
    return xp;
}