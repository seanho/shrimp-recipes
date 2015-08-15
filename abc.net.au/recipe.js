var cheerio = require('cheerio');
var shrimp = require('shrimp');
var URL = require('url');

shrimp.setRecipeName('ABC News');

function getCategories() {
  var categories = [
    {title: 'Just In', navigate: function () { getArticles('http://www.abc.net.au/news/justin/') }},
    {title: 'National', navigate: function () { getArticles('http://www.abc.net.au/news/national/') }},
    {title: 'Australian Capital Territory', navigate: function () { getArticles('http://www.abc.net.au/news/act/') }},
    {title: 'New South Wales', navigate: function () { getArticles('http://www.abc.net.au/news/nsw/') }},
    {title: 'Northern Territory', navigate: function () { getArticles('http://www.abc.net.au/news/nt/') }},
    {title: 'Queensland', navigate: function () { getArticles('http://www.abc.net.au/news/qld/') }},
    {title: 'South Australia', navigate: function () { getArticles('http://www.abc.net.au/news/sa/') }},
    {title: 'Tasmania', navigate: function () { getArticles('http://www.abc.net.au/news/tas/') }},
    {title: 'Victoria', navigate: function () { getArticles('http://www.abc.net.au/news/vic/') }},
    {title: 'Western Australia', navigate: function () { getArticles('http://www.abc.net.au/news/wa/') }},
    {title: 'World - Just In', navigate: function () { getArticles('http://www.abc.net.au/news/world/just-in/') }},
    {title: 'World - Asia Pacific', navigate: function () { getArticles('http://www.abc.net.au/news/world/asia-pacific/') }},
    {title: 'Business', navigate: function () { getArticles('http://www.abc.net.au/news/business/articles/') }}
  ]
  shrimp.show({categories: categories});
}

function getArticles(url) {
  shrimp.request(url, function (error, response, body) {
    if (error) {
      shrimp.alert(error.message);
      return;
    }

    var $ = cheerio.load(body);

    var articles = $('.article-index li').map(function () {
      var url = getHref($(this).find('a'));
      return {
        title: $(this).find('h3').text().trim(),
        image: getImageUrl($(this).find('.thumb img')),
        shortDesc: $(this).find('p').not('.published, .topics').text(),
        date: $(this).find('.timestamp').first().text().trim(),
        navigate: function () {
          getArticle(url);
        }
      };
    }).get();

    var data = {items: articles};

    if ($('a.next').length > 0) {
      var nextUrl = URL.resolve(url, $('a.next').attr('href'));
      data.next = function () {
        getArticles(nextUrl);
      };
    }

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

    $('.tools.btn-group').remove();

    var content = $('.article.section').html();
    var article = {
      title: $('h1').text().trim(),
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
  return URL.resolve('http://www.abc.net.au', href);
}

function getImageUrl(imgElem) {
  if (imgElem.length > 0) {
    return URL.resolve('http://www.abc.net.au', imgElem.attr('src'));
  }
  return '';
}

shrimp.setEntry(getCategories);
