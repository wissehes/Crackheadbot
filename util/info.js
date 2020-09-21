const os = require("os")
const packageJSON = require("../package.json")
function secondsToDhms(seconds = 0) {
    // Source: https://stackoverflow.com/questions/36098913/convert-seconds-to-days-hours-minutes-and-seconds

    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);

    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";

    // Show the comma at the end only if the days aren't shown
    let mDisplay = ""
    if (dDisplay) {
        mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes") : "";
    } else {
        mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    }

    // Only display seconds when days isn't shown
    let sDisplay = ""
    if (!dDisplay.length) {
        sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    }
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

module.exports = {
    getPlatform() {
        const platforms = {
            aix: "IBM AIX",
            darwin: "macOS",
            freebsd: "FreeBSD",
            linux: "Linux",
            openbsd: "OpenBSD",
            sunos: "SunOS",
            win32: "Windows"
        }
        if (platforms[process.platform]) {
            return platforms[process.platform]
        } else return "Unknown"
    },

    getNodeUptime() {
        return secondsToDhms(process.uptime())
    },

    getOSUptime() {
        return secondsToDhms(os.uptime())
    },

    getModuleVersion(m = "") {
        const module = packageJSON.dependencies[m];
        return module.replace("^", "")
    }
}