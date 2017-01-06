/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var Voice = require('ui/voice');
var languages = ["ru"];
var ajax = require('ajax');
var selectedLang = 0;
var translationAPIKey = 'trnsl.1.1.20170106T151741Z.c93dea41a166c3cb.2465ae22813d3ed317e51dc820966656f665dd67';

var main = new UI.Card({
  title: 'English translator',
  icon: 'images/menu_icon.png',
  subtitle: '',
  body: 'Press select button and speak',
  subtitleColor: 'indigo', // Named colors
  // bodyColor: '#9a0036' // Hex colors
});

main.show();

// main.on('click', 'up', function(e) {
//   var menu = new UI.Menu({
//     sections: [{
//       items: [{
//         title: 'Pebble.js',
//         icon: 'images/menu_icon.png',
//         subtitle: 'Can do Menus'
//       }, {
//         title: 'Second Item',
//         subtitle: 'Subtitle Text'
//       }, {
//         title: 'Third Item',
//       }, {
//         title: 'Fourth Item',
//       }]
//     }]
//   });
//   menu.on('select', function(e) {
//     console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
//     console.log('The item is titled "' + e.item.title + '"');
//   });
//   menu.show();
// });

  var startListen = function() {
      Voice.dictate('start', false, function(e) {
        if (e.err) {
          console.log('Error: ' + e.err);
          return;
        }
        var url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key='+ translationAPIKey + '&text=' + e.transcription + '&lang=en-' + languages[selectedLang];
        main.subtitle('You said: ' + e.transcription);
               console.log(url);

        ajax({
          url: url,
          method: 'post'
        }, function(data) {
            console.log('data');
            console.log(data);
            data = JSON.parse(data);
          // main.subtitle(e.transcription);
          main.body(data.text.join('\n'));
          // main.subtitle(data.text);

        }, function(err) {
           console.log('err');
           console.log(err);
        });
      });  
  };
main.on('click', 'select', function(e) {
    startListen();
  // var wind = new UI.Window({
  //   backgroundColor: 'black'
  // });
  // var isListening = false;
  // var textField = new UI.Text({
  //   size: new Vector2(140, 60),
  //   font: 'gothic-24-bold',
  //   text: 'Say the word\nOr sentence...',
  //   textAlign: 'center'
  // });
  // var windSize = wind.size();
  // // var textPos = textField.position()
  // //   .addSelf(wind.size())
  // //   .subSelf(textPos.size())
  // //   .multiplyScalar(0.5);
  // // textField.position(textPos);

  // var startListen = function() {
  //     isListening = true;
  //     textField.text('Speak now..');
  //     Voice.dictate('start', false, function(e) {
  //       if (e.err) {
  //         console.log('Error: ' + e.err);
  //         return;
  //       }
  //       main.subtitle('You said: ' + e.transcription);
  //       ajax({
  //         url: 'https://translate.yandex.net/api/v1.5/tr.json/translate?key='+ translationAPIKey + '&text=' + e.transcription + '&lang=en-' + languages[selectedLang];
  //       }, function(data) {
  //         // main.subtitle(e.transcription);
  //         main.body(data.text)
  //       })
  //     });  
  // };
  

  // wind.on('click', 'select', function(e) {
  //   if (isListening) {
  //     Voice.dictate('stop');
  //   } else {
  //     startListen();
  //   }
  //   isListening = !isListening;

  // });

  // wind.add(textField);
  // wind.show();
  // if (!isListening) {
  //   startListen();
  // }
});

main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});
