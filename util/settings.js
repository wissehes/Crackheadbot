module.exports = {
    readableValue(message, type, value) {
        switch (type) {
            case "onoff":
                return value ? "`on`" : "`off`"
                break;
            case "channel":
                let returnValue;
                if (value == "") {
                    returnValue = "*Not set*"
                } else {
                    const foundChannel = message.guild.channels.resolve(value)
                    if (foundChannel) {
                        returnValue = foundChannel.toString()
                    } else {
                        returnValue = "Deleted channel"
                    }
                }
                return returnValue;
                break;
            default:
                return "unknown"
                break;
        }
    }
}