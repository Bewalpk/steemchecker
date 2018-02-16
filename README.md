I know there miiighty be... an issue currently. This solves the issue:

```
<script src="https://mktcode.github.io/steemit-widgets/assets/js/steemit-widgets.min.js"></script>
<script>
  steem.api.setOptions({ url: 'https://api.steemit.com' }); // <-- ADD THIS
  steemitWidgets.profile....
  ....(
  ```

# Steemit Widgets

**A simple way to display content from steemit.com on your website.**<br>by [mkt](http://steemit.com/@mkt)

[Demo](https://mktcode.github.io/steemit-widgets/)

## How To Use

The easiest way is to use the [generator](https://mktcode.github.io/steemit-widgets/generator.html). You can adjust a lot there but if you need an even more individual solution keep reading.

First you need to decide where to put the content. You only need an empty element with an id somewhere on your website.

```html
<h1>My Steemit Blog</h1>
<div id="my-blog"></div>
```

Now add the necessary files to your website. You only need the javascript API for Steemit and the plugin itself. You don't have to download anything if you use the CDN links in the code below. Just copy these lines and paste them right before your closing `</body>` tag.

```html
<script src="https://cdn.steemjs.com/lib/latest/steem.min.js"></script>
<script src="https://mktcode.github.io/steemit-widgets/assets/js/steemit-widgets.min.js"></script>
```

Next you need to initialize the widget you want. All the widget functions are accessible through the `steemitWidgets` object. In this example we'll use the `blog()` function to display your blog posts.

```html
<script>
  steemitWidgets.blog({
    element: 'my-blog',
    user: 'your-username'
  });
</script>
```

Put together your html file might look like this:

```html
<!DOCTYPE HTML>
<html>
  <head>
    <title>My Website</title>
  </head>
  <body>
    <h1>My Steemit Blog</h1>
    <div id="my-blog"></div>

    <script src="https://cdn.steemjs.com/lib/latest/steem.min.js"></script>
    <script src="https://mktcode.github.io/steemit-widgets/assets/js/steemit-widgets.min.js"></script>
    <script>
      steemitWidgets.blog({
        element: 'my-blog',
        user: 'your-username'
      });
    </script>
  </body>
</html>
```

This will display a simple list of links to your blog posts along with the number of upvotes, comments and payout.

## Templating

To adjust the display you can use a custom template with some placeholders for the content from steemit. There are two options to provide a template. You can pass the html directly to the `template` option like this:

```html
<script>
  steemitWidgets.blog({
    element: 'my-blog',
    user: 'your-username',
    template: '<div class="post"><a href="${URL}">${TITLE}</a><br>${Payout}, ${UPVOTES} Upvotes, ${COMMENTS} Comments</div>'
  });
</script>
```

The second option is to use a `<template>` tag with an id which you pass to the `template` option.

```html
<template id="my-blog-post-template">
  <div class="post">
    <a href="${URL}">${TITLE}</a><br>
    ${Payout}, ${UPVOTES} Upvotes, ${COMMENTS} Comments
  </div>
</template>

<script>
  steemitWidgets.blog({
    element: 'my-blog',
    user: 'your-username',
    template: 'my-blog-post-template'
  });
</script>
```

Read the next section to learn how to display posts from other feeds, like trending posts or posts from a specific category, or your profile information and what placeholders you can use.

## Options and Placeholders

You can display user related content like blog, feed and profile information and you can display tag related or general posts from the new, hot and trending feeds. Each have slightly different options and placeholders.

### Profile

```javascript
steemitWidgets.profile(options);
```

#### Options

Option | Description | Type | Default
------ | ----------- | ---- | -------
element | Sets the html id of the element in which to show the content. | String | null
username | Sets the steemit.com username whose profile to show. | String | mkt
template | Provides the HTML to display the profile. Can be either an HTML string or the ID of a `<template>` tag. | String | `<img width="100" src="${IMAGE}" /><br><a href="https://steemit.com/@${USER}">@${USER}</a>`
reputationPrecision | Sets the decimal precision for the reputation score. | Integer | 0
votingPowerPrecision | Sets the decimal precision for the current voting power. | Integer | 2
updateInterval | Sets the interval in seconds to update the output. Set to 0 to disable updates. | Integer | 60
createdCallback | Sets a callback function to handle the created date display, for example with moment.js. | Function | `function (created) { monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; created = new Date(created); return monthNames[created.getMonth()] + ' ' + created.getDate() + ', ' + created.getFullYear(); }`

#### Placeholders

Placeholder | Description
----------- | -----------
${USER} | Outputs the username (without the @).
${NAME} | Outputs the alternative display name you can set in the steemit.com settings.
${LOCATION} | Outputs the users location.
${WEBSITE} | Outputs the users website url.
${IMAGE} | Outputs the users profile image url.
${COVERIMAGE} | Outputs the users cover image url.
${REPUTATION} | Outputs the users reputation.
${VOTINGPOWER} | Outputs the users actual current voting power.
${FOLLOWERS} | Outputs the number of followers the user has.
${FOLLOWING} | Outputs the number of users the user is following.
${POSTCOUNT} | Outputs the users overall post count.
${ABOUT} | Outputs the users about text.

### Currency Ticker

Source: [coinmarketcap.com](https://coinmarketcap.com). (Updated every 5 minutes.)

```javascript
steemitWidgets.ticker(options);
```

#### Options

Option | Description | Type | Default
------ | ----------- | ---- | -------
element | Sets the html id of the element in which to show the content. | String | null
currency | Sets the currency. | String | `steem`
template | Provides the HTML to display the ticker. Can be either an HTML string or the ID of a `<template>` tag. | String | `<h3>${NAME} <small>(${SYMBOL})</small></h3><p>USD: ${PRICE_USD}<br>BTC: ${PRICE_BTC}</p>`
priceBTCPrecision | Sets the decimal precision for the BTC price. | Integer | 8
priceUSDPrecision | Sets the decimal precision for the USD price. | Integer | 2
updateInterval | Sets the interval in seconds to update the output. Set to 0 to disable updates. | Integer | 300

#### Placeholders

Placeholder | Description
----------- | -----------
${ID} | Outputs the ID.
${NAME} | Outputs the name.
${RANK} | Outputs the current rank.
${SYMBOL} | Outputs the currency symbol.
${IMAGE} | Outputs the url to an logo image.
${24H_VOLUME_USD} | Outputs trading volume for the last 24 hours.
${AVAILABLE_SUPPLY} | Outputs the available token supply.
${TOTAL_SUPPLY} | Outputs the total token supply.
${MARKET_CAP_USD} | Outputs the market cap in USD.
${PERCENT_CHANGE_1H} | Outputs the price change percentage for the last hour in.
${PERCENT_CHANGE_24H} | Outputs the price change percentage for the last 24 hours in.
${PERCENT_CHANGE_7D} | Outputs the price change percentage for the last seven days in. 
${PRICE_BTC} | Outputs the current BTC price.
${PRICE_USD} | Outputs the current USD price.

### Blog and Feed

```javascript
steemitWidgets.blog(options);
steemitWidgets.feed(options);
```

#### Options

Option | Description | Type | Default
------ | ----------- | ---- | -------
element | Sets the html id of the element in which to show the content. | String | null
user | Sets the steemit.com username whose blog/feed to show. | String | mkt
limit | Sets the number of posts to show. | Integer | 10
template | Provides the HTML to display the posts. Can be either an HTML string or the ID of a `<template>` tag. | String | `<div><a href="${URL}">${TITLE}</a>${RESTEEMED}<br>${Payout}, ${UPVOTES} Upvotes, ${COMMENTS} Comments</div>`
defaultImage | Sets the URL for a default image if there is no post image. | String | [show](https://steemitimages.com/DQmXYX9hqSNcikTK8ARb61BPnTk4CKMhaiqr22iCKD8CKsp/steemit-logo.png)
resteemedIndicator | Sets the HTML displayed by ${RESTEEMED} placeholder if a post was resteemed. | String | (resteemed)
payoutPrecision | Sets the decimal precision for the payout amount. | Integer | 2
reputationPrecision | Sets the decimal precision for the reputation scores. | Integer | 0
dateCallback | Sets a callback function to handle the date display, for example with moment.js. | Function | `function (date) {return date;}`
updateInterval | Sets the interval in seconds to update the output. Set to 0 to disable updates. | Integer | 60

#### Placeholders

Placeholder | Description
----------- | -----------
${URL} | Outputs the post url.
${TITLE} | Outputs the post's title.
${AUTHOR} | Outputs the author's username.
${RESTEEMED} | Outputs the HTML provided in the `resteemedIndicator` option when a post was resteemed.
${RESTEEMEDBY} | Outputs the username (prefixed with "resteemed by") of the user who resteemed this post.
${DATE} | Outputs the post's creation date. Can be customized using the `dateCallback` option.
${IMAGE} | Outputs the post's image url.
${PAYOUT} | Outputs the full pending or past payout amount.
${REPUTATION} | Outputs the users reputation.
${COMMENTS} | Outputs the number of comments on the post.
${UPVOTES} | Outputs the number of upvotes the post has received.
${CATEGORY} | Outputs the post's category (first tag).

### New, Hot and Trending

```javascript
steemitWidgets.new(options);
steemitWidgets.hot(options);
steemitWidgets.trending(options);
```

#### Options

Option | Description | Type | Default
------ | ----------- | ---- | -------
element | Sets the html id of the element in which to show the content. | String | null
tag | Sets the tag for which to show posts. By default no tag is set and all posts will be shown. | String | null
limit | Sets the number of posts to show. | Integer | 10
template | Provides the HTML to display the posts. Can be either an HTML string or the ID of a `<template>` tag. | String | `<div><a href="${URL}">${TITLE}</a><br>${Payout}, ${UPVOTES} Upvotes, ${COMMENTS} Comments</div>`
defaultImage | Sets the URL for a default image if there is no post image. | String | 	[show](https://steemitimages.com/DQmXYX9hqSNcikTK8ARb61BPnTk4CKMhaiqr22iCKD8CKsp/steemit-logo.png)
payoutPrecision | Sets the decimal precision for the payout amount. | Integer | 2
reputationPrecision | Sets the decimal precision for the reputation score. | Integer | 0
dateCallback | Sets a callback function to handle the date display, for example with moment.js. | Function | `function (date) {return date;}`
updateInterval | Sets the interval in seconds to update the output. Set to 0 to disable updates. | Integer | 60

#### Placeholders

Placeholder | Description
----------- | -----------
${URL} | Outputs the post url.
${TITLE} | Outputs the post's title.
${AUTHOR} | Outputs the author's username.
${DATE} | Outputs the post's creation date. Can be customized using the `dateCallback` option.
${IMAGE} | Outputs the post's image url.
${PAYOUT} | Outputs the full pending or past payout amount.
${REPUTATION} | Outputs the users reputation.
${COMMENTS} | Outputs the number of comments on the post.
${UPVOTES} | Outputs the number of upvotes the post has received.
${CATEGORY} | Outputs the post's category (first tag).

### Full Post

```javascript
steemitWidgets.fullPost(options);
```

#### Options

Option | Description | Type | Default
------ | ----------- | ---- | -------
element | Sets the html id of the element in which to show the content. | String | null
author | Sets the tag for which to show posts. By default no tag is set and all posts will be shown. | String | null
permlink | Sets the number of posts to show. | Integer | 10
template | Provides the HTML to display the posts. Can be either an HTML string or the ID of a `<template>` tag. | String | `<div><a href="${URL}">${TITLE}</a><br>${Payout}, ${UPVOTES} Upvotes, ${COMMENTS} Comments<p>${BODY}</p></div>`
payoutPrecision | Sets the decimal precision for the payout amount. | Integer | 2
reputationPrecision | Sets the decimal precision for the reputation score. | Integer | 0
dateCallback | Sets a callback function to handle the date display, for example with moment.js. | Function | `function (date) {return date;}`
bodyCallback | Sets a callback function to handle the body display, for example with https://github.com/jonschlinkert/remarkable. | Integer | `function (body) {return body;}`
tagsCallback | Sets a callback function to handle the tags display. | Integer | `function (tags) { let tagsHtml = '', i; for (i = 0; i < tags.length; i++) { tagsHtml += '<a href="https://steemit.com/trending/' + tags[i] + '">' + tags[i] + '</a>'; } return '<div class="steemit-full-post-tags">' + tagsHtml + '</div>'; }`


#### Placeholders

Placeholder | Description
----------- | -----------
${URL} | Outputs the post url.
${TITLE} | Outputs the post's title.
${AUTHOR} | Outputs the author's username.
${DATE} | Outputs the post's creation date. Can be customized using the `dateCallback` option.
${BODY} | Outputs the post's body.
${PAYOUT} | Outputs the full pending or past payout amount.
${REPUTATION} | Outputs the users reputation.
${COMMENTS} | Outputs the number of comments on the post.
${UPVOTES} | Outputs the number of upvotes the post has received.
${CATEGORY} | Outputs the post's category (first tag).
${TAGS} | Outputs the post's tags (link). Can be customized using the `tagsCallback` option.

## Formatting Post Dates

If you want to format the post dates you can use the `dateCallback` option. Here is an example of how to display realtive times like "1 hour ago" like on steemit.com with [moment.js](https://momentjs.com).

```html
<script src="https://cdn.steemjs.com/lib/latest/steem.min.js"></script>
<script src="https://mktcode.github.io/steemit-widgets/assets/js/steemit-widgets.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js"></script>
<script>
  steemitWidgets.blog({
    element: 'my-blog',
    user: 'your-username',
    dateCallback: function (date) {
      return moment.utc(date).from(moment.utc().format('YYYY-MM-DD HH:mm:ss'));
    }
  });
</script>
```

You have to be careful because javascript works with your local time which might be different from what steemit.com shows. The above example takes care of this by converting dates to UTC.

## jQuery Usage

If your website uses jQuery you can use the built-in jQuery syntax.

```html
<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script src="https://cdn.steemjs.com/lib/latest/steem.min.js"></script>
<script src="https://mktcode.github.io/steemit-widgets/assets/js/steemit-widgets.min.js"></script>
<script>
  $('#my-profile').steemitProfile({user: 'your-username'});
  $('#my-ticker').steemitTicker();
  $('#my-blog').steemitBlog({user: 'your-username'});
  $('#my-feed').steemitFeed({user: 'your-username'});
  $('#new-posts').steemitNew();
  $('#hot-posts').steemitHot();
  $('#trending-posts').steemitTrending();
</script>
```

You can now omit the element option. Just make sure jQuery is included before the plugin.
