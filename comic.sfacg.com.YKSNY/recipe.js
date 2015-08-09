var cheerio = require('cheerio');
var shrimp = require('shrimp');
var URL = require('url');

shrimp.setRecipeName('月刊少女野崎君');

function getChapters() {
  var baseUrl = 'http://comic.sfacg.com/HTML/YKSNY/'
  shrimp.request(baseUrl, function (error, response, body) {
    if (error) {
      shrimp.alert(error.message);
      return;
    }

    var $ = cheerio.load(body);

    var categories = $('.serialise_list li').map(function () {
      var href = $(this).find('a').attr('href');
      var chapterCode = href.match(/^.*\/([a-zA-Z0-9]+)\/$/)[1];
      if (isNaN(chapterCode)) {
        var scriptUrl = 'http://comic.sfacg.com/Utility/1305/TBP/' + chapterCode + '.js';
      } else {
        var scriptUrl = 'http://comic.sfacg.com/Utility/1305/' + chapterCode + '.js';
      }
      return {
        title: $(this).find('a').first().text().trim(),
        navigate: function () {
          getPages(scriptUrl);
        }
      };
    }).get();

    shrimp.show({items: categories});
  });
}

function getPages(url) {
  shrimp.request(url, function (error, response, body) {
    if (error) {
      shrimp.alert(error.message);
      return;
    }

    eval(body); // body returned is actually javascript, yes, evil act but harmless

    var images = [];
    for (var i = 0; i < picAy.length; i++) {
      var url = URL.resolve(hosts[0], picAy[i]);
      images.push({url: url});
    }

    shrimp.show({images: images});
  });
}

shrimp.setEntry(getChapters);
