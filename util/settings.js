module.exports = {
    getCurrentValue(setting, client) {
        let value;
        switch (setting.currentType) {
            case "boolean":
                value = {
                    value: setting.current ? "`on`" : "`off`",
                    validate: (input) => {
                        if (input == "on" || input == "off") {
                            return true
                        } else return false
                    },
                    saveAble: (input) => {
                        if (input == "on") {
                            return true
                        } else {
                            return false
                        }
                    },
                }
                break;
            case "channel":
                value = {
                    validate: (input) => {
                        if (typeof input == "object") {
                            return true
                        } else return false
                    },
                    saveAble: (input) => {
                        return input.id
                    },
                }
                if (setting.current == "") {
                    value.value = "`Not set`"
                } else {
                    const channel = client.channels.resolve(setting.current)
                    value.value = channel ? channel : "`Not found`"
                }
                break;
        }
        return value;
    },
}