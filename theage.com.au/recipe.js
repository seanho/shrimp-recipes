var cheerio = require('cheerio');
var shrimp = require('shrimp');
var URL = require('url');

shrimp.setRecipeName('The Age');

function getCategories() {
  var categories = [
    {title: 'Home', navigate: function () { getHomeArticles('http://www.theage.com.au') }},
    {title: 'Victoria', navigate: function () { getArticles('http://www.theage.com.au/victoria') }},
    {title: 'National', navigate: function () { getArticles('http://www.theage.com.au/national') }},
    {title: 'World', navigate: function () { getArticles('http://www.theage.com.au/world') }},
    {title: 'World Business', navigate: function () { getArticles('http://www.theage.com.au/business/world') }},
    {title: 'Politics', navigate: function () { getArticles('http://www.theage.com.au/federal-politics/political-news') }},
    {title: 'Environment', navigate: function () { getArticles('http://www.theage.com.au/environment') }},
    {title: 'Health', navigate: function () { getArticles('http://www.theage.com.au/national/health') }},
    {title: 'Education', navigate: function () { getArticles('http://www.theage.com.au/national/education/') }}
  ]
  shrimp.show({categories: categories});
}

function getHomeArticles(url) {
  shrimp.request(url, function (error, response, body) {
    if (error) {
      shrimp.alert(error.message);
      return;
    }

    var $ = cheerio.load(body);

    var articles = $('.article, li.clippingAction').map(function () {
      if ($(this).hasClass('article')) {
        var source = getHref($(this).find('h3 a'));
        return {
          title: $(this).find('h3').text().trim(),
          image: getImageUrl($(this).find('img')),
          shortDesc: $(this).find('p').text().trim(),
          source: source,
          navigate: function () {
            getArticle(source);
          }
        };
      } else {
        var source = $(this).find('a').attr('href').trim();
        return {
          title: $(this).find('a').text().trim(),
          source: source,
          navigate: function () {
            getArticle(source);
          }
        };
      }
    }).get();

    var data = {items: articles};
    shrimp.show(data);
  });
}

function getArticles(url) {
  shrimp.request(url, function (error, response, body) {
    if (error) {
      shrimp.alert(error.message);
      return;
    }

    var $ = cheerio.load(body);

    var articles = $('.cN-storyHeadlineLead').not('.date').map(function () {
      var source = getHref($(this).find('h3 a'));
      return {
        title: $(this).find('h3').text().trim(),
        image: getImageUrl($(this).find('img')),
        date: $(this).find('cite small').text().trim(),
        shortDesc: $(this).find('p').contents().not('cite').text().trim(),
        source: source,
        navigate: function () {
          getArticle(source);
        }
      };
    }).get();

    var data = {items: articles};
    shrimp.show(data);
  });
}

function getArticle(url) {
  shrimp.request(url, function (error, response, body) {
    if (error) {
      shrimp.alert(error.message);
      return;
    }

    var $ = cheerio.load(body);

    $('.ad').remove();
    $('#video-player-content').remove();

    var content = $('.articleBody').html();
    var article = {
      title: $('h1.cN-headingPage').text().trim(),
      content: content,
      baseUrl: url,
      source: url
    };

    shrimp.show({item: article});
  });
}

function getHref(aElem) {
  var href = aElem.attr('href').trim();
  if (href.indexOf('http') === 0) {
    return href;
  }
  return 'http://www.theage.com.au' + href;
}

function getImageUrl(imgElem) {
  if (imgElem.length > 0) {
    return 'http://www.theage.com.au' + imgElem.attr('src');
  }
  return '';
}

shrimp.setEntry(getCategories);
