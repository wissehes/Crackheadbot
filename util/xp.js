module.exports = {
    rankEmoji(place) {
        /**
        * this function returns a 🏆 if somoeone is first and 🥈 when second and so on
        */
        let emojis = {
            1: "🏆",
            2: "🥈",
            3: "🏅",
            else: "🎖"
        }
        if (emojis[place]) {
            return emojis[place]
        } else return emojis.else;
    }
}