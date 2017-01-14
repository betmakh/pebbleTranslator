/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Settings = require('settings');
var Voice = require('ui/voice');
var ajax = require('ajax');
var selectedLang = 0;
var translationAPIKey = 'trnsl.1.1.20170106T151741Z.c93dea41a166c3cb.2465ae22813d3ed317e51dc820966656f665dd67';
var selectedLang = Settings.data('selectedLang') || {code: 'ru'};

var main = new UI.Card({
  subtitle: 'English translator (en-' + selectedLang.code + ')',
  scrollable: true,
  // icon: 'images/menu_icon.png',
  // subtitle: '',
  body: 'Press select button and speak',
  subtitleColor: 'indigo', // Named colors
  // bodyColor: '#9a0036' // Hex colors
});

main.show();
getLangsList();

function getLangsList() {
  selectedLang = Settings.data('selectedLang');
  var url = 'https://translate.yandex.net/api/v1.5/tr.json/getLangs?key=' +
    translationAPIKey + '&ui=en';
  ajax({
    url: url,
  }, function(data) {
    data = JSON.parse(data);
    data.dirs = data.dirs.map(function(el) {
        return el.split('-')
      })
      .filter(function(el) {
        return el[0] == 'en';
      });

    data = data.dirs.map(function(el) {
      return {
        code: el[1],
        name: data.langs[el[1]]
      }
    });
    data = data.sort(function(a, b) {
      var nameA = a.name.toUpperCase(); // ignore upper and lowercase
      var nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    Settings.data('langs', data);
  }, function(err) {
    console.log(err);
  });
}

var startListen = function() {
  Voice.dictate('start', false, function(e) {
    selectedLang = Settings.data('selectedLang');
    if (e.err) {
      console.log('Error: ' + e.err);
      return;
    }
    var url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=' + translationAPIKey
      + '&text=' + e.transcription + '&lang=en-' + selectedLang.code;
    main.subtitle('You said: ' + e.transcription);
    ajax({
      url: url,
      method: 'post'
    }, function(data) {
      data = JSON.parse(data);
      main.body('(' + selectedLang.code + ') ' + data.text.join('\n'));
    }, function(err) {
      console.log(err);
    });
  });
};

main.on('click', 'select', function(e) {
  startListen();
});

main.on('longClick', 'select', function(e) {

  var langsData = Settings.data('langs') || {};
  var formattedMenuData = langsData.map(function(el) {
    return {
      title: el.name,
      subtitle: el.code
    }
  });
  var menu = new UI.Menu({
    // backgroundColor: 'black',
    // textColor: 'blue',
    // highlightBackgroundColor: 'blue',
    // highlightTextColor: 'black',
    sections: [{
      title: 'Select your language',
      items: formattedMenuData
    }]
  });

  menu.on('select', function(e) {
    Settings.data('selectedLang', langsData[e.itemIndex]);
    main.subtitle('English translator (en-' + langsData[e.itemIndex].code + ')');
    menu.hide();
  });
  menu.show();
})

// main.on('click', 'down', function(e) {
//   var card = new UI.Card();
//   card.title('A Card');
//   card.subtitle('Is a Window');
//   card.body('The simplest window type in Pebble.js.');
//   card.show();
// });
