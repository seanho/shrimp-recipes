var cheerio = require('cheerio');
var shrimp = require('shrimp');

shrimp.setRecipeName('TEEPR 趣味新聞');

function getCategories() {
  shrimp.request('http://www.teepr.com', function (error, response, body) {
    if (error) {
      shrimp.alert(error.message);
      return;
    }

    var $ = cheerio.load(body);

    var categories = $('.menu-item-home, .menu-item-object-category').map(function () {
      var url = $(this).find('a').attr('href').trim();
      return {
        title: $(this).find('a').first().text().trim(),
        navigate: function () {
          getArticles(url);
        }
      };
    }).get();

    shrimp.show({categories: categories});
  });
}

function getArticles(url) {
  shrimp.request(url, function (error, response, body) {
    if (error) {
      shrimp.alert(error.message);
      return;
    }

    var $ = cheerio.load(body);

    var articles = $('.article article').map(function () {
      var url = $(this).find('a').attr('href').trim();
      return {
        title: $(this).find('h2').text().trim(),
        image: $(this).find('img').attr('src').trim(),
        date: $(this).find('.thetime').text().trim(),
        navigate: function () {
          getArticle(url);
        }
      };
    }).get();

    var data = {items: articles};

    if ($('.pagination .next').length > 0) {
      var nextUrl = $('.pagination .next').attr('href');
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

    $('.ad-inserter').remove();
    $('.wp-polls').remove();
    $('.wp-polls-loading').remove();

    var content = $('.post-single-content').html();
    var article = {
      title: $('h1.title').text().trim(),
      content: content,
      baseUrl: url,
      source: url
    };

    shrimp.show({item: article});
  });
}

shrimp.setEntry(getCategories);
