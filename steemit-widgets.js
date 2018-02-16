/**
 * Steemit Widgets
 *
 * @author mkt <kontakt@markus-kottlaender.de>
 * @license MIT
 */

var steemitWidgets = {};

steemitWidgets.updateIntervals = [];

// Profile
steemitWidgets.profile = function(options) {
  var settings = Object.assign({
    element: null,
    user: 'mkt',
    template: '<img width="100" src="${IMAGE}" /><br><a href="https://steemit.com/@${USER}">@${USER}</a>',
    reputationPrecision: 0,
    votingPowerPrecision: 2,
    updateInterval: 60,
    createdCallback: function (created) {
      var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      created = new Date(created);
      return monthNames[created.getMonth()] + ' ' + created.getDate() + ', ' + created.getFullYear();
    }
  }, options);

  var element = settings.element instanceof Element ? settings.element : document.getElementById(settings.element);

  if (element) {
    run();
    if (settings.updateInterval) {
      steemitWidgets.updateIntervals.push(setInterval(run, settings.updateInterval * 1000));
    }

    function run() {
      steem.api.getAccounts([settings.user], function(err, profile) {
        if (!err && profile.length) {
          var profile = profile[0];
          var metaData = profile.json_metadata ? JSON.parse(profile.json_metadata).profile : {};

          steem.api.getFollowCount(settings.user, function(err, followers) {
            var template = steemitWidgets.getTemplate(settings.template)
            .replace(/\${USER}/gi, profile.name)
            .replace(/\${NAME}/gi, metaData.name)
            .replace(/\${LOCATION}/gi, metaData.location)
            .replace(/\${WEBSITE}/gi, metaData.website)
            .replace(/\${IMAGE}/gi, metaData.profile_image ? 'https://steemitimages.com/2048x512/' + metaData.profile_image : '')
            .replace(/\${COVERIMAGE}/gi, metaData.cover_image ? 'https://steemitimages.com/2048x512/' + metaData.cover_image : '')
            .replace(/\${REPUTATION}/gi, steemitWidgets.calculateReputation(profile.reputation, settings.reputationPrecision))
            .replace(/\${VOTINGPOWER}/gi, steemitWidgets.calculateVotingPower(profile.voting_power, profile.last_vote_time, settings.votingPowerPrecision))
            .replace(/\${FOLLOWERS}/gi, followers.follower_count)
            .replace(/\${FOLLOWING}/gi, followers.following_count)
            .replace(/\${POSTCOUNT}/gi, profile.post_count)
            .replace(/\${CREATED}/gi, settings.createdCallback(profile.created))
            .replace(/\${ABOUT}/gi, metaData.about);

            element.innerHTML = template;
          });
        } else {
          element.innerHTML = 'Error: API not responding!';
        }
      });
    }
  } else {
    console.log('Element ' + settings.element + ' not found!');
  }
};

// Blog
steemitWidgets.blog = function(options) {
  var settings = Object.assign({
    element: null,
    user: "mkt",
    limit: 10,
    template: '<div><a href="${URL}">${TITLE}</a>${RESTEEMED}<br>${Payout}, ${UPVOTES} Upvotes, ${COMMENTS} Comments</div>',
    defaultImage: 'https://steemitimages.com/DQmXYX9hqSNcikTK8ARb61BPnTk4CKMhaiqr22iCKD8CKsp/steemit-logo.png',
    resteemedIndicator: ' (resteemed) ',
    payoutPrecision: 2,
    reputationPrecision: 0,
    updateInterval: 60,
    dateCallback: function (date) {
        return date;
    }
  }, options);

  var element = settings.element instanceof Element ? settings.element : document.getElementById(settings.element);

  if (element) {
    run();
    if (settings.updateInterval) {
      steemitWidgets.updateIntervals.push(setInterval(run, settings.updateInterval * 1000));
    }

    function run() {
      steem.api.getDiscussionsByBlog({tag: settings.user, limit: settings.limit}, function(err, posts) {
        if (!err && posts.length) {
          var html = '';
          for (var i = 0; i < posts.length; i++) {
            var metaData = JSON.parse(posts[i].json_metadata);
            var template = steemitWidgets.getTemplate(settings.template)
              .replace(/\${URL}/gi, 'https://steemit.com' + posts[i].url)
              .replace(/\${TITLE}/gi, posts[i].title)
              .replace(/\${AUTHOR}/gi, posts[i].author)
              .replace(/\${REPUTATION}/gi, steemitWidgets.calculateReputation(posts[i].author_reputation, settings.reputationPrecision))
              .replace(/\${RESTEEMED}/gi, posts[i].author != settings.user ? settings.resteemedIndicator : '')
              .replace(/\${RESTEEMEDBY}/gi, posts[i].first_reblogged_by ? 'resteemed by ' + posts[i].first_reblogged_by : '')
              .replace(/\${DATE}/gi, settings.dateCallback(new Date(posts[i].created)))
              .replace(/\${IMAGE}/gi, metaData.image ? 'https://steemitimages.com/2048x512/' + metaData.image[0] : settings.defaultImage)
              .replace(/\${PAYOUT}/gi, steemitWidgets.getPayout(posts[i]).toFixed(settings.payoutPrecision))
              .replace(/\${COMMENTS}/gi, posts[i].children)
              .replace(/\${UPVOTES}/gi, posts[i].net_votes)
              .replace(/\${CATEGORY}/gi, posts[i].category);

            html += template;
          }
          element.innerHTML = html;
        } else {
          element.innerHTML = 'Error: API not responding!';
        }
      });
    }
  } else {
    console.log('Element ' + settings.element + ' not found!');
  }
};

// Feed
steemitWidgets.feed = function(options) {
  var settings = Object.assign({
    element: null,
    user: "mkt",
    limit: 10,
    template: '<div><a href="${URL}">${TITLE}</a>${RESTEEMED}<br>${Payout}, ${UPVOTES} Upvotes, ${COMMENTS} Comments</div>',
    defaultImage: 'https://steemitimages.com/DQmXYX9hqSNcikTK8ARb61BPnTk4CKMhaiqr22iCKD8CKsp/steemit-logo.png',
    resteemedIndicator: ' (resteemed) ',
    payoutPrecision: 2,
    reputationPrecision: 0,
    updateInterval: 60,
    dateCallback: function (date) {
        return date;
    }
  }, options);

  var element = settings.element instanceof Element ? settings.element : document.getElementById(settings.element);

  if (element) {
    run();
    if (settings.updateInterval) {
      steemitWidgets.updateIntervals.push(setInterval(run, settings.updateInterval * 1000));
    }

    function run() {
      steem.api.getDiscussionsByFeed({tag: settings.user, limit: settings.limit}, function(err, posts) {
        if (!err && posts.length) {
          var html = '';
          for (var i = 0; i < posts.length; i++) {
            var metaData = JSON.parse(posts[i].json_metadata);
            var template = steemitWidgets.getTemplate(settings.template)
            .replace(/\${URL}/gi, 'https://steemit.com' + posts[i].url)
            .replace(/\${TITLE}/gi, posts[i].title)
            .replace(/\${AUTHOR}/gi, posts[i].author)
            .replace(/\${REPUTATION}/gi, steemitWidgets.calculateReputation(posts[i].author_reputation, settings.reputationPrecision))
            .replace(/\${RESTEEMED}/gi, posts[i].first_reblogged_by ? settings.resteemedIndicator : '')
            .replace(/\${RESTEEMEDBY}/gi, posts[i].first_reblogged_by ? 'resteemed by ' + posts[i].first_reblogged_by : '')
            .replace(/\${DATE}/gi, settings.dateCallback(new Date(posts[i].created)))
            .replace(/\${IMAGE}/gi, metaData.image ? 'https://steemitimages.com/2048x512/' + metaData.image[0] : settings.defaultImage)
            .replace(/\${PAYOUT}/gi, steemitWidgets.getPayout(posts[i]).toFixed(settings.payoutPrecision))
            .replace(/\${COMMENTS}/gi, posts[i].children)
            .replace(/\${UPVOTES}/gi, posts[i].net_votes)
            .replace(/\${CATEGORY}/gi, posts[i].category);

            html += template;
          }
          element.innerHTML = html;
        } else {
          element.innerHTML = 'Error: API not responding!';
        }
      });
    }
  } else {
    console.log('Element ' + settings.element + ' not found!');
  }
};

// New
steemitWidgets.new = function(options) {
  var settings = Object.assign({
    element: null,
    tag: null,
    limit: 10,
    template: '<div><a href="${URL}">${TITLE}</a><br>${Payout}, ${UPVOTES} Upvotes, ${COMMENTS} Comments</div>',
    defaultImage: 'https://steemitimages.com/DQmXYX9hqSNcikTK8ARb61BPnTk4CKMhaiqr22iCKD8CKsp/steemit-logo.png',
    payoutPrecision: 2,
    reputationPrecision: 0,
    updateInterval: 60,
    dateCallback: function (date) {
        return date;
    }
  }, options);

  var element = settings.element instanceof Element ? settings.element : document.getElementById(settings.element);

  if (element) {
    run();
    if (settings.updateInterval) {
      steemitWidgets.updateIntervals.push(setInterval(run, settings.updateInterval * 1000));
    }

    function run() {
      steem.api.getDiscussionsByCreated({tag: settings.tag, limit: settings.limit}, function(err, posts) {
        if (!err && posts.length) {
          var html = '';
          for (var i = 0; i < posts.length; i++) {
            var metaData = JSON.parse(posts[i].json_metadata);
            var template = steemitWidgets.getTemplate(settings.template)
            .replace(/\${URL}/gi, 'https://steemit.com' + posts[i].url)
            .replace(/\${TITLE}/gi, posts[i].title)
            .replace(/\${AUTHOR}/gi, posts[i].author)
            .replace(/\${REPUTATION}/gi, steemitWidgets.calculateReputation(posts[i].author_reputation, settings.reputationPrecision))
            .replace(/\${DATE}/gi, settings.dateCallback(new Date(posts[i].created)))
            .replace(/\${IMAGE}/gi, metaData.image ? 'https://steemitimages.com/2048x512/' + metaData.image[0] : settings.defaultImage)
            .replace(/\${PAYOUT}/gi, steemitWidgets.getPayout(posts[i]).toFixed(settings.payoutPrecision))
            .replace(/\${COMMENTS}/gi, posts[i].children)
            .replace(/\${UPVOTES}/gi, posts[i].net_votes)
            .replace(/\${CATEGORY}/gi, posts[i].category);

            html += template;
          }
          element.innerHTML = html;
        } else {
          element.innerHTML = 'Error: API not responding!';
        }
      });
    }
  } else {
    console.log('Element ' + settings.element + ' not found!');
  }
};

// Hot
steemitWidgets.hot = function(options) {
  var settings = Object.assign({
    element: null,
    tag: null,
    limit: 10,
    template: '<div><a href="${URL}">${TITLE}</a><br>${Payout}, ${UPVOTES} Upvotes, ${COMMENTS} Comments</div>',
    defaultImage: 'https://steemitimages.com/DQmXYX9hqSNcikTK8ARb61BPnTk4CKMhaiqr22iCKD8CKsp/steemit-logo.png',
    payoutPrecision: 2,
    reputationPrecision: 0,
    updateInterval: 60,
    dateCallback: function (date) {
        return date;
    }
  }, options);

  var element = settings.element instanceof Element ? settings.element : document.getElementById(settings.element);

  if (element) {
    run();
    if (settings.updateInterval) {
      steemitWidgets.updateIntervals.push(setInterval(run, settings.updateInterval * 1000));
    }

    function run() {
      steem.api.getDiscussionsByHot({tag: settings.tag, limit: settings.limit}, function(err, posts) {
        if (!err && posts.length) {
          var html = '';
          for (var i = 0; i < posts.length; i++) {
            var metaData = JSON.parse(posts[i].json_metadata);
            var template = steemitWidgets.getTemplate(settings.template)
            .replace(/\${URL}/gi, 'https://steemit.com' + posts[i].url)
            .replace(/\${TITLE}/gi, posts[i].title)
            .replace(/\${AUTHOR}/gi, posts[i].author)
            .replace(/\${REPUTATION}/gi, steemitWidgets.calculateReputation(posts[i].author_reputation, settings.reputationPrecision))
            .replace(/\${DATE}/gi, settings.dateCallback(new Date(posts[i].created)))
            .replace(/\${IMAGE}/gi, metaData.image ? 'https://steemitimages.com/2048x512/' + metaData.image[0] : settings.defaultImage)
            .replace(/\${PAYOUT}/gi, steemitWidgets.getPayout(posts[i]).toFixed(settings.payoutPrecision))
            .replace(/\${COMMENTS}/gi, posts[i].children)
            .replace(/\${UPVOTES}/gi, posts[i].net_votes)
            .replace(/\${CATEGORY}/gi, posts[i].category);

            html += template;
          }
          element.innerHTML = html;
        } else {
          element.innerHTML = 'Error: API not responding!';
        }
      });
    }
  } else {
    console.log('Element ' + settings.element + ' not found!');
  }
};

// Trending
steemitWidgets.trending = function(options) {
  var settings = Object.assign({
    element: null,
    tag: null,
    limit: 10,
    template: '<div><a href="${URL}">${TITLE}</a><br>${Payout}, ${UPVOTES} Upvotes, ${COMMENTS} Comments</div>',
    defaultImage: 'https://steemitimages.com/DQmXYX9hqSNcikTK8ARb61BPnTk4CKMhaiqr22iCKD8CKsp/steemit-logo.png',
    payoutPrecision: 2,
    reputationPrecision: 0,
    updateInterval: 60,
    dateCallback: function (date) {
        return date;
    }
  }, options);

  var element = settings.element instanceof Element ? settings.element : document.getElementById(settings.element);

  if (element) {
    run();
    if (settings.updateInterval) {
      steemitWidgets.updateIntervals.push(setInterval(run, settings.updateInterval * 1000));
    }

    function run() {
      steem.api.getDiscussionsByTrending({tag: settings.tag, limit: settings.limit}, function(err, posts) {
        if (!err && posts.length) {
          var html = '';
          for (var i = 0; i < posts.length; i++) {
            var metaData = JSON.parse(posts[i].json_metadata);
            var template = steemitWidgets.getTemplate(settings.template)
            .replace(/\${URL}/gi, 'https://steemit.com' + posts[i].url)
            .replace(/\${TITLE}/gi, posts[i].title)
            .replace(/\${AUTHOR}/gi, posts[i].author)
            .replace(/\${REPUTATION}/gi, steemitWidgets.calculateReputation(posts[i].author_reputation, settings.reputationPrecision))
            .replace(/\${DATE}/gi, settings.dateCallback(new Date(posts[i].created)))
            .replace(/\${IMAGE}/gi, metaData.image ? 'https://steemitimages.com/2048x512/' + metaData.image[0] : settings.defaultImage)
            .replace(/\${PAYOUT}/gi, steemitWidgets.getPayout(posts[i]).toFixed(settings.payoutPrecision))
            .replace(/\${COMMENTS}/gi, posts[i].children)
            .replace(/\${UPVOTES}/gi, posts[i].net_votes)
            .replace(/\${CATEGORY}/gi, posts[i].category);

            html += template;
          }
          element.innerHTML = html;
        } else {
          element.innerHTML = 'Error: API not responding!';
        }
      });
    }
  } else {
    console.log('Element ' + settings.element + ' not found!');
  }
};

// Full Post
steemitWidgets.fullPost = function(options) {
  var settings = Object.assign({
    element: null,
    author: 'mkt',
    permlink: 'steemline-beta-multifeed-ui-and-notifications-for-steemit',
    template: '<div><a href="${URL}">${TITLE}</a><br>${Payout}, ${UPVOTES} Upvotes, ${COMMENTS} Comments<p>${BODY}</p></div>',
    payoutPrecision: 2,
    reputationPrecision: 0,
    dateCallback: function (date) {
        return date;
    },
    bodyCallback: function (body) {
        return body;
    },
    tagsCallback: function (tags) {
      var tagsHtml = '',
          i;
      for (i = 0; i < tags.length; i++) {
          tagsHtml += '<a href="https://steemit.com/trending/' + tags[i] + '">' + tags[i] + '</a>';
      }
      return '<div class="steemit-full-post-tags">' + tagsHtml + '</div>';
    }
  }, options);

  var element = settings.element instanceof Element ? settings.element : document.getElementById(settings.element);

  if (element) {
    steem.api.getContent(settings.author, settings.permlink, function(err, post) {
      if (!err && post) {
        var metaData = JSON.parse(post.json_metadata);
        var template = steemitWidgets.getTemplate(settings.template)
        .replace(/\${URL}/gi, 'https://steemit.com' + post.url)
        .replace(/\${TITLE}/gi, post.title)
        .replace(/\${AUTHOR}/gi, post.author)
        .replace(/\${REPUTATION}/gi, steemitWidgets.calculateReputation(post.author_reputation, settings.reputationPrecision))
        .replace(/\${DATE}/gi, settings.dateCallback(new Date(post.created)))
        .replace(/\${BODY}/gi, settings.bodyCallback(post.body))
        .replace(/\${PAYOUT}/gi, steemitWidgets.getPayout(post).toFixed(settings.payoutPrecision))
        .replace(/\${COMMENTS}/gi, post.children)
        .replace(/\${UPVOTES}/gi, post.net_votes)
        .replace(/\${CATEGORY}/gi, post.category)
        .replace(/\${TAGS}/gi, settings.tagsCallback(metaData.tags));

        element.innerHTML = template;
      } else {
        element.innerHTML = 'Error: API not responding!';
      }
    });
  } else {
    console.log('Element ' + settings.element + ' not found!');
  }
};

// Ticker
steemitWidgets.ticker = function(options) {
    var settings = Object.assign({
        element: null,
        currency: 'steem',
        template: '<h3>${NAME} <small>(${SYMBOL})</small></h3><p>USD: ${PRICE_USD}<br>BTC: ${PRICE_BTC}</p>',
        priceBTCPrecision: 8,
        priceUSDPrecision: 2,
        updateInterval: 300 // coinmarketcap limit
    }, options);

    var element = settings.element instanceof Element ? settings.element : document.getElementById(settings.element);

    if (element) {
        run();
        if (settings.updateInterval) {
            steemitWidgets.updateIntervals.push(setInterval(run, settings.updateInterval * 1000));
        }

        function run() {

            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://api.coinmarketcap.com/v1/ticker/' + settings.currency + '/', true);
            xhr.send();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        var ticker = JSON.parse(xhr.responseText)[0],
                            html = '';

                        var template = steemitWidgets.getTemplate(settings.template)
                            .replace(/\${ID}/g, ticker.id)
                            .replace(/\${NAME}/g, ticker.name)
                            .replace(/\${RANK}/g, ticker.rank)
                            .replace(/\${SYMBOL}/g, ticker.symbol)
                            .replace(/\${IMAGE}/g, 'https://files.coinmarketcap.com/static/img/coins/64x64/' + ticker.id + '.png')
                            .replace(/\${24H_VOLUME_USD}/g, parseFloat(ticker['24h_volume_usd']).toLocaleString(undefined, {minimumFractionDigits: 2}))
                            .replace(/\${AVAILABLE_SUPPLY}/g, parseFloat(ticker.available_supply).toLocaleString(undefined, {minimumFractionDigits: 2}))
                            .replace(/\${TOTAL_SUPPLY}/g, parseFloat(ticker.total_supply).toLocaleString(undefined, {minimumFractionDigits: 2}))
                            .replace(/\${MARKET_CAP_USD}/g, parseFloat(ticker.market_cap_usd).toLocaleString())
                            .replace(/\${PERCENT_CHANGE_1H}/g, steemitWidgets.getColoredPercentChange(ticker.percent_change_1h))
                            .replace(/\${PERCENT_CHANGE_7D}/g, steemitWidgets.getColoredPercentChange(ticker.percent_change_7d))
                            .replace(/\${PERCENT_CHANGE_24H}/g, steemitWidgets.getColoredPercentChange(ticker.percent_change_24h))
                            .replace(/\${PRICE_BTC}/g, parseFloat(ticker.price_btc).toFixed(settings.priceBTCPrecision))
                            .replace(/\${PRICE_USD}/g, parseFloat(ticker.price_usd).toFixed(settings.priceUSDPrecision));

                        html += template;
                        element.innerHTML = html;
                    } else {
                        element.innerHTML = 'Error: API not responding!';
                    }
                }
            };
        }
    } else {
        console.log('Element ' + settings.element + ' not found!');
    }
};

/**
 * Helpers
 */

steemitWidgets.getTemplate = function(template) {
  var templateElement = document.getElementById(template);
  if (templateElement) {
    return templateElement.innerHTML;
  }

  return template;
}

steemitWidgets.getPayout = function(post) {
  if (post.last_payout == '1970-01-01T00:00:00') {
    var payout = post.pending_payout_value.replace(' SBD', '');
    return parseFloat(payout);
  }

  var authorPayout = post.total_payout_value.replace(' SBD', '');
  var curatorPayout = post.curator_payout_value.replace(' SBD', '');

  return parseFloat(authorPayout) + parseFloat(curatorPayout);
}

steemitWidgets.getColoredPercentChange = function(percentChange) {
    if (percentChange > 0) {
        percentChange = '+' + percentChange;
    }

    if (percentChange > 0) {
        return '<span style="color: #090;">' + percentChange + ' %</span>';
    } else if (percentChange < 0) {
        return '<span style="color: #900;">' + percentChange + ' %</span>';
    } else {
        return percentChange + ' %';
    }
}

steemitWidgets.calculateReputation = function(rep, precision) {
  var reputation = ((((Math.log10(Math.abs(rep))) - 9) * 9) + 25),
      precision = parseInt(precision);

  return (rep < 0 ? '-' : '') + (precision ? reputation.toFixed(precision) : Math.floor(reputation));
}

steemitWidgets.calculateVotingPower = function(votingPower, lastVoteTime, precision) {
  var secondsPassedSinceLastVote = (new Date - new Date(lastVoteTime + "Z")) / 1000;
  votingPower += (10000 * secondsPassedSinceLastVote / 432000);

  return Math.min(votingPower / 100, 100).toFixed(precision);
}

// jQuery adapter

if (window.jQuery) {
  jQuery.fn.steemitProfile = function(options) {
    steemitWidgets.profile(jQuery.extend({element: this[0]}, options));
  };
  jQuery.fn.steemitBlog = function(options) {
    steemitWidgets.blog(jQuery.extend({element: this[0]}, options));
  };
  jQuery.fn.steemitFeed = function(options) {
    steemitWidgets.feed(jQuery.extend({element: this[0]}, options));
  };
  jQuery.fn.steemitNew = function(options) {
    steemitWidgets.new(jQuery.extend({element: this[0]}, options));
  };
  jQuery.fn.steemitHot = function(options) {
    steemitWidgets.hot(jQuery.extend({element: this[0]}, options));
  };
  jQuery.fn.steemitTrending = function(options) {
    steemitWidgets.trending(jQuery.extend({element: this[0]}, options));
  };
  jQuery.fn.steemitFullPost = function(options) {
    steemitWidgets.fullPost(jQuery.extend({element: this[0]}, options));
  };
  jQuery.fn.steemitTicker = function(options) {
    steemitWidgets.ticker(jQuery.extend({element: this[0]}, options));
  };
}
