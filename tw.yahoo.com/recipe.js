var cheerio = require('cheerio');
var shrimp = require('shrimp');
var URL = require('url');

shrimp.setRecipeName('雅虎奇摩');

function getCategories() {
  shrimp.request('https://tw.news.yahoo.com', function (error, response, body) {
    if (error) {
      shrimp.alert(error.message);
      return;
    }

    var $ = cheerio.load(body);

    var categories = $('.nav-0 .navlist.yog-grid').children().map(function () {
      var url = $(this).find('a').attr('href').trim();
      return {
        title: $(this).find('a').first().text().trim(),
        navigate: function () {
          getArticles(url);
        }
      };
    }).get();

    shrimp.show({items: categories});
  });
}

function getArticles(url) {
  shrimp.request(url, function (error, response, body) {
    if (error) {
      shrimp.alert(error.message);
      return;
    }

    var $ = cheerio.load(body);

    var articles = $('.list-story').not('.classickick').map(function () {
      var source = getHref($(this).find('a'));
      return {
        title: $(this).find('.title').text().trim(),
        image: getImageUrl($(this).find('img')),
        date: $(this).find('cite attr').attr('title'),
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

function getHref(aElem) {
  var href = aElem.attr('href').trim();
  if (href.indexOf('http') === 0) {
    return href;
  }
  return 'https://tw.news.yahoo.com' + href;
}

function getImageUrl(imgElem) {
  if (imgElem.length > 0) {
    return 'http://www.theage.com.au' + imgElem.attr('src');
  }
  return '';
}

shrimp.setEntry(getCategories);
