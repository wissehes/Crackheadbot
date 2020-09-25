const { Role } = require("discord.js");
const Reward = require("../db/models/Reward");

class CrackheadRewards {
    constructor(client) {
        this.client = client;
    }

    getAllRewards(guild) {
        return new Promise(async (resolve, reject) => {
            try {
                const rewards = await Reward.find({
                    guildID: guild.id
                })
                resolve(rewards)
            } catch (e) {
                reject(e)
            }
        })
    }

    addGuildReward(guild, role, level) {
        if (role instanceof Role)
            role = role.id

        return new Promise(async (resolve, reject) => {
            try {
                if (await Reward.findOne({
                    guild: guild.id,
                    role,
                    level
                })) {
                    return resolve(false)
                }

                const reward = new Reward({
                    guildID: guild.id,
                    roleID: role,
                    level
                })
                resolve(await reward.save())
            } catch (e) {
                reject(e)
            }
        })
    }

    removeGuildReward(guild, role, level) {
        if (role instanceof Role)
            role = role.id

        return new Promise(async (resolve, reject) => {
            const reward = await Reward.findOne({
                guildID: guild.id,
                role,
                level
            })
            if (reward) {
                await reward.remove()
                resolve(true)
            } else {
                resolve(false)
            }
        })
    }
}

module.exports = CrackheadRewards;