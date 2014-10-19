'use strict';

const env = process.env,
      co = require('co'),
      promisify = require('es6-promisify'),
      request = require('request'),
      get = promisify(request.get),
      post = promisify(request.post),
      appConsumerKey = env.KEY,
      appConsumerSecret = env.SECRET,
      tokenUrl = 'https://api.twitter.com/oauth2/token',
      searchBase = 'https://api.twitter.com/1.1/search/tweets.json?q=',
      searchQuery = '6wunderkinder',
      searchUrl = searchBase + searchQuery + '&result_type=recent&count=100';

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
  return JSON.parse(response.body).access_token;
};

function *get6wTweets () {
  let options = {
        'auth': {
          'bearer': yield getToken
        }
      },
      response = yield get(searchUrl, options);
  return JSON.parse(response.body).statuses;
}

function printStatus (status) {
  let user = status.user,
      handle = user.screen_name,
      tweet = status.text;
  console.log('[' + handle + '] ' + tweet);
};

// "Main"
co(function *() {
  var tweets = yield get6wTweets;
  tweets.forEach(printStatus);
})();