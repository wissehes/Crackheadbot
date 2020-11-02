const Twit = require("twit");

class CrackheadTwitterClient {
  constructor(client, config) {
    this.client = client;

    this.twitter = new Twit({
      consumer_key: config.twitterConsumer,
      consumer_secret: config.twitterConsumerSecret,
      access_token: config.twitterTokenKey,
      access_token_secret: config.twitterTokenSecret,
    });
  }
  /**
   *
   * @param {String} text Text to tweet
   */
  tweet(text) {
    return new Promise((resolve, reject) => {
      this.twitter
        .post("statuses/update", { status: text })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((e) => reject(e));
    });
  }
}

module.exports = CrackheadTwitterClient;
