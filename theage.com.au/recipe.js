var cheerio = require('cheerio');
var shrimp = require('shrimp');
var URL = require('url');

shrimp.setRecipeName('ABC News');

function getCategories() {
  var categories = [
    {title: 'Victoria', navigate: function () { getArticles('http://www.theage.com.au/victoria') }},
    {title: 'National', navigate: function () { getArticles('http://www.theage.com.au/national') }},
    {title: 'World', navigate: function () { getArticles('http://www.theage.com.au/world') }},
    {title: 'World Business', navigate: function () { getArticles('http://www.theage.com.au/business/world') }},
    {title: 'Politics', navigate: function () { getArticles('http://www.theage.com.au/federal-politics/political-news') }},
    {title: 'Environment', navigate: function () { getArticles('http://www.theage.com.au/environment') }},
    {title: 'Health', navigate: function () { getArticles('http://www.theage.com.au/national/health') }},
    {title: 'Education', navigate: function () { getArticles('http://www.theage.com.au/national/education/') }}
  ]
  shrimp.show({items: categories});
}

function getArticles(url) {
  shrimp.request(url, function (error, response, body) {
    if (error) {
      shrimp.alert(error.message);
      return;
    }

    var $ = cheerio.load(body);

    var articles = $('.cN-storyImageLead, .cN-storyHeadlineLead').map(function () {
      var url = 'http://www.theage.com.au' + $(this).find('h3 a').attr('href').trim();
      return {
        title: $(this).find('h3').text().trim(),
        image: 'http://www.theage.com.au' + $(this).find('img').attr('src'),
        date: $(this).find('cite small').text().trim(),
        source: url,
        navigate: function () {
          getArticle(url);
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

    var content = $('.articleBody').html();
    var article = {
      title: $('h1.cN-headingPage').text().trim(),
      content: content,
      baseUrl: url
    };

    shrimp.show({item: article});
  });
}

shrimp.setEntry(getCategories);
