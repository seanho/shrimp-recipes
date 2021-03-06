var cheerio = require('cheerio');
var shrimp = require('shrimp');
var URL = require('url');

shrimp.setRecipeName('雅虎奇摩');

function getCategories() {
  shrimp.request(options('https://tw.news.yahoo.com'), function (error, response, body) {
    if (error) {
      shrimp.alert(error.message);
      return;
    }

    var $ = cheerio.load(body);

    var categories = $('.nav-0 .navlist.yog-grid').children().map(function () {
      var source = URL.resolve(getHref($(this).find('a')), 'archive/');
      return {
        title: $(this).find('a').first().text().trim(),
        source: source,
        navigate: function () {
          getArticles(source);
        }
      };
    }).get();

    shrimp.show({categories: categories});
  });
}

function getArticles(url) {
  shrimp.request(options(url), function (error, response, body) {
    if (error) {
      shrimp.alert(error.message);
      return;
    }

    var $ = cheerio.load(body);

    $('a.more').remove()

    var articles = $('.yom-list-wide li').map(function () {
      var source = getHref($(this).find('a'));
      return {
        title: $(this).find('h4').text().trim(),
        image: getImageUrl($(this).find('.img img')),
        shortDesc: $(this).find('p').text(),
        date: $(this).find('cite').text(),
        source: source,
        navigate: function () {
          getArticle(source);
        }
      };
    }).get();

    var data = {items: articles};

    if ($('a.next').length > 0) {
      var nextUrl = getHref($('a.next'));
      data.next = function () {
        getArticles(nextUrl);
      };
    }

    shrimp.show(data);
  });
}

function getArticle(url) {
  shrimp.request(options(url), function (error, response, body) {
    if (error) {
      shrimp.alert(error.message);
      return;
    }

    var $ = cheerio.load(body);

    $('.yui-media, .yom-figure, .yom-video-player').css({'width': '100%', 'height': 'auto'});
    $('iframe').attr('width', '100%');
    $('iframe').attr('height', 'auto');

    if ($('.yog-ycb').length > 0) {
      $('.yog-ycb').replaceWith($('.yog-ycb .RRThumbnailList img'));
    }

    var content = $('.yom-art-content').html();
    var article = {
      title: $('h1.headline').text().trim(),
      content: content,
      baseUrl: url,
      source: url
    };

    shrimp.show({item: article});
  });
}

function options(url) {
  return {
    url: url,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
    }
  };
}

function getHref(aElem) {
  var href = aElem.attr('href').trim();
  if (href.indexOf('http') === 0) {
    return encodeURI(href);
  }
  return encodeURI(URL.resolve('https://tw.news.yahoo.com', href));
}

function getImageUrl(imgElem) {
  if (imgElem.length > 0 && imgElem.css('background-image')) {
    var src = imgElem.css('background-image').replace("url('", '').replace("')", '');
    return src;
  }
  return '';
}

shrimp.setEntry(getCategories);
