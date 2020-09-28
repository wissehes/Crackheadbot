class GeneralUtils {
  static list(array, lastSeparator) {
    let text = "";

    for (let i = 0; i < array.length; i++) {
      if (i == 0) {
        text += array[i];
      } else if (i == array.length - 1) {
        text += ` ${lastSeparator} ${array[i]}`;
      } else {
        text += `, ${array[i]}`;
      }
    }

    return text;
  }

  static shuffleArray(array) {
    let counter = array.length;

    while (counter) {
      let index = Math.floor(Math.random() * counter);

      counter--;

      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }

    return array;
  }
}

module.exports = GeneralUtils;
