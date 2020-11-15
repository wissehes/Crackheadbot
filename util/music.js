class MusicUtils {
  /**
   * Format milliseconds to hh:mm:ss
   * @param {number} millisec
   */
  static formatMS(millisec) {
    // https://stackoverflow.com/questions/19700283/how-to-convert-time-milliseconds-to-hours-min-sec-format-in-javascript

    var seconds = (millisec / 1000).toFixed(0);
    var minutes = Math.floor(seconds / 60);
    var hours = "";
    if (minutes > 59) {
      hours = Math.floor(minutes / 60);
      hours = hours >= 10 ? hours : "0" + hours;
      minutes = minutes - hours * 60;
      minutes = minutes >= 10 ? minutes : "0" + minutes;
    }

    seconds = Math.floor(seconds % 60);
    seconds = seconds >= 10 ? seconds : "0" + seconds;
    if (hours != "") {
      return hours + ":" + minutes + ":" + seconds;
    }

    return minutes + ":" + seconds;
  }
}

module.exports = MusicUtils;
