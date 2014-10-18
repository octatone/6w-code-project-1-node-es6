'use strict';

const env = process.env;
const co = require('co');
const thunkify = require('thunkify');
const request = require('request');
const get = thunkify(request.get);
const post = thunkify(request.post);

const appConsumerKey = env.KEY;
const appConsumerSecret = env.SECRET;

const tokenUrl = 'https://api.twitter.com/oauth2/token';

const searchBase = 'https://api.twitter.com/1.1/search/tweets.json?q=';
const searchQuery = '6wunderkinder';
const searchUrl = searchBase + searchQuery + '&result_type=recent&count=100';

function *getToken () {

  let options = {
        'auth': {
          'user': appConsumerKey,
          'pass': appConsumerSecret,
          'sendImmediately': true
        },
        'form': {
          'grant_type': 'client_credentials'
        }
      },
      response = yield post(tokenUrl, options);
  return JSON.parse(response[1]).access_token;
};

function *get6wTweets () {

  let options = {
        'auth': {
          'bearer': yield getToken()
        }
      },
      response = yield get(searchUrl, options);
  return JSON.parse(response[1]).statuses;
}

function printStatus (status) {

  let user = status.user,
      handle = user.screen_name,
      tweet = status.text;
  console.log('[' + handle + '] ' + tweet);
};

// "Main"
co(function *() {

  var tweets = yield get6wTweets();
  tweets.forEach(printStatus);
})();