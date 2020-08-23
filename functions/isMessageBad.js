module.exports = (message, badWords = []) => {
    let isBad = false;
    for (let i = 0; i < badWords.length; i++) {
        const regex = badWords[i];
        if (regex.test(message.content)) {
            isBad = true
        }
    }
    return isBad
}