require("dotenv").config();

const Twit = require("twit");
const config = require("./config");
const T = new Twit(config);
const prettyMs = require("pretty-ms");
const isReply = require("./isReply");

function likeATweet(tweetId) {
  return T.post("favorites/create", {
    id: tweetId
  });
}
console.log(config.track);
const stream = T.stream("statuses/filter", {
  track: config.track
});

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function addToQueue(tweet) {
  if (isReply(tweet)) {
    console.log(`reply or retweet ${tweet.text.substr(0, 25)}`);
    return;
  }
  let timeout = randomIntFromInterval(10, 100) * 60 * 1000; // milli- seconds
  let prettyTime = prettyMs(timeout);
  console.log(`Will like this tweet after ${prettyTime}`);
  setTimeout(() => {
    likeATweet(tweet.id_str)
      .then(s => {
        console.log(`liked a tweet ${tweet.id_str} after ${prettyTime}`);
      })
      .catch(err => {
        console.error(`failed to like tweet ${tweet.id_str}: ${err.message}`);
      });
  }, timeout);
}

stream.on("tweet", addToQueue);
stream.on("connect", () => console.log("======== bot started ======="));
