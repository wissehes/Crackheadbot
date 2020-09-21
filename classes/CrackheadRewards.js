const { Role } = require("discord.js");

class CrackheadRewards {
    constructor(client) {
        this.client = client;
    }

    getAllRewards(guild) {
        return new Promise(async (resolve, reject) => {
            try {
                const rewards = await guild.settings.get("rewards")
                resolve(rewards || {})
            } catch (e) {
                reject(e)
            }
        })
    }

    setAllRewards(guild, rewards) {
        return new Promise(async (resolve, reject) => {
            try {
                await guild.settings.set('rewards', rewards)
                resolve()
            } catch (e) {
                reject(e)
            }
        })
    }

    setGuildReward(guild, role, level) {
        if (role instanceof Role)
            role = role.id

        return new Promise(async (resolve, reject) => {
            const rewards = await this.getAllRewards(guild);

            if (role in rewards) {
                resolve(false)
            } else {
                rewards[role] = level;

                await this.setAllRewards(guild, rewards);

                resolve(true)
            }
        })
    }

    removeGuildReward(guild, role) {
        if (role instanceof Role)
            role = role.id

        return new Promise(async (resolve, reject) => {
            const rewards = await this.getAllRewards(guild);

            if (!role in rewards) {
                resolve(false)
            } else {
                delete rewards[role];

                await this.setAllRewards(guild, rewards)

                resolve(true)
            }
        })
    }
}

module.exports = CrackheadRewards;