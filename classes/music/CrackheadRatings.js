const { User } = require("discord.js");
const Rating = require("../../db/models/Rating");
const CrackheadCommandoClient = require("../CrackheadCommandoClient");

class CrackheadRatings {
  /**
   * @param {CrackheadCommandoClient} client
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Get the ratings for a track
   * @param {String} track Base64 string from Lavalink
   */
  async get(track) {
    const ratings = await Rating.find({ track });
    return ratings;
  }

  /**
   * Get a user's rating for a track
   * @param {User} user
   * @param {String} track
   */
  async getUser(user, track) {
    const usersRating = await Rating.findOne({
      userID: user.id,
      track,
    });

    return usersRating;
  }

  /**
   * Create a new rating
   * @param {Object} opts options
   * @param {String} opts.track Base64 string from Lavalink
   * @param {User} opts.user User who made the rating
   * @param {Number} opts.rating The rating (0-5)
   */
  async new(opts) {
    const { track, user, rating } = opts;

    if (isNaN(rating) || (rating < 0 && rating > 5)) {
      throw new Error("Rating must be a number between 0 and 5");
    }

    let userRating;

    if (await this.has(user, track)) {
      userRating = await this.getUser(user, track);
    } else {
      userRating = new Rating({
        userID: user.id,
        track,
      });
    }
    userRating.rating = rating;

    await userRating.save();

    return userRating;
  }

  /**
   * Check if a user has already rated this song
   * @param {User} user
   * @param {String} track
   */
  async has(user, track) {
    const found = await Rating.findOne({
      userID: user.id,
      track,
    });

    return found;
  }
}
module.exports = CrackheadRatings;
