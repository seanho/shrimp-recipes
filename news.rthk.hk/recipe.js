var cheerio = require('cheerio');
var shrimp = require('shrimp');

function getCategories() {
  var categories = [
    {title: '全部', navigate: function () { getArticles('http://news.rthk.hk/rthk/webpageCache/services/loadModNewsShowSp2List.php?lang=zh-TW&cat=NULL&newsCount=60&dayShiftMode=1') }},
    {title: '本地', navigate: function () { getArticles('http://news.rthk.hk/rthk/webpageCache/services/loadModNewsShowSp2List.php?lang=zh-TW&cat=3&newsCount=60&dayShiftMode=1') }},
    {title: '大中華', navigate: function () { getArticles('http://news.rthk.hk/rthk/webpageCache/services/loadModNewsShowSp2List.php?lang=zh-TW&cat=2&newsCount=60&dayShiftMode=1') }},
    {title: '國際', navigate: function () { getArticles('http://news.rthk.hk/rthk/webpageCache/services/loadModNewsShowSp2List.php?lang=zh-TW&cat=4&newsCount=60&dayShiftMode=1') }},
    {title: '財經', navigate: function () { getArticles('http://news.rthk.hk/rthk/webpageCache/services/loadModNewsShowSp2List.php?lang=zh-TW&cat=5&newsCount=60&dayShiftMode=1') }},
    {title: '體育', navigate: function () { getArticles('http://news.rthk.hk/rthk/webpageCache/services/loadModNewsShowSp2List.php?lang=zh-TW&cat=6&newsCount=60&dayShiftMode=1') }}
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

    var articles = $('.ns2-page').map(function () {
      var url = $(this).find('a').attr('href').trim();
      return {
        title: $(this).find('.ns2-title').text().trim(),
        date: $(this).find('.ns2-created').text().trim(),
        navigate: function () {
          getArticle(url);
        }
      };
    }).get();

    shrimp.show({items: articles});
  });
}

function getArticle(url) {
  shrimp.request(url, function (error, response, body) {
    if (error) {
      shrimp.alert(error.message);
      return;
    }

    var $ = cheerio.load(body);

    var content = $('.itemFullText').html();
    var article = {
      title: $('.itemTitle').text().trim(),
      content: content,
      baseUrl: url
    };

    shrimp.show({item: article});
  });
}

shrimp.setEntry(getCategories);
