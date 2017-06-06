'use strict';


const express = require('express');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
var twilio = require('twilio');

var accountSid = 'ACb733a5659bcb41e964d2a321d44e14b5'; // Your Account SID from www.twilio.com/console
var authToken = '7e61cf961237b75d60e752a4ccc52b2b';   // Your Auth Token from www.twilio.com/console
var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

var restService = express();
restService.use(bodyParser.json());
restService.use(bodyParser.urlencoded({
    extended: true
}));
const server = restService.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});



restService.post('/echo', function(req, res) {
    var paras = req.body.result && req.body.result.parameters;
    var speech = "Seems like some problem. Speak again.";
    if(paras){
      if(paras.open){
        speech = 'opening the slides...';
        io.emit('openslide', new Date().toTimeString());
      }else if(paras.next){
        speech = 'here is the next page...';
        io.emit('nextpage', new Date().toTimeString());
      }else if(paras.back){
        speech = 'here you go';
        io.emit('back', new Date().toTimeString());
      }else if(paras.message){
        client.messages.create({
            to: "+16316173028",
            from: "+16467606610",
            body: "Hi Robert, there are many ways Google Home can support our GRPs, we should investigate further.",
            mediaUrl: "https://c1.staticflickr.com/3/2899/14341091933_1e92e62d12_b.jpg",
        }, function(err, message) {
            console.log(Object.keys(err));
            //console.log(message.sid);
            console.log('twilio message '+err.message);
            console.log('twilio message '+err.code);
        });
        speech = 'messages sent';
        io.emit('message', new Date().toTimeString());
      }
    }
    // var speech = req.body.result && req.body.result.parameters && req.body.result.parameters.echoText ? req.body.result.parameters.echoText : "Seems like some problem. Speak again."
    // if(new RegExp('slide').test(speech)||new RegExp('ppt').test(speech)||new RegExp('presentation').test(speech)){
    //   speech = 'opening the slides...';
    //   io.emit('openslide', new Date().toTimeString());
    // }else if (new RegExp('next').test(speech)) {
    //   speech = 'here is the next page...';
    //   io.emit('nextpage', new Date().toTimeString());
    // }else if (new RegExp('back').test(speech) || new RegExp('previous').test(speech)|| new RegExp('last page').test(speech)) {
    //   speech = 'here you go';
    //   io.emit('back', new Date().toTimeString());
    // }else if (new RegExp('message').test(speech)) {
    //   client.messages.create({
    //       to: "+16467523706",
    //       from: "+18057197602",
    //       body: "Hello from Google Home!",
    //       mediaUrl: "https://c1.staticflickr.com/3/2899/14341091933_1e92e62d12_b.jpg",
    //   }, function(err, message) {
    //       console.log(Object.keys(err));
    //       //console.log(message.sid);
    //       console.log('twilio message '+err.message);
    //       console.log('twilio message '+err.code);
    //   });
    //   speech = 'messages sent';
    //   io.emit('message', new Date().toTimeString());
    // }
    return res.json({
        speech: speech,
        displayText: speech,
        source: 'webhook-echo-sample'
    });
});


// restService.post('/open', function(req, res) {
//     //var speech = req.body.result && req.body.result.parameters && req.body.result.parameters.open ? req.body.result.parameters.open : "Seems like some problem. Speak again."
//     var speech_open = 'okay...opening the slides...';
//     io.emit('openslide', new Date().toTimeString());
//
//     return res.json({
//         speech: speech_open,
//         displayText: speech_open,
//         source: 'webhook-echo-sample'
//     });
// });
//
// restService.post('/next', function(req, res) {
//     //var speech = req.body.result && req.body.result.parameters && req.body.result.parameters.next ? req.body.result.parameters.next : "Seems like some problem. Speak again."
//     var speech_next = 'okay...here is the next page...';
//     io.emit('nextpage', new Date().toTimeString());
//
//     return res.json({
//         speech: speech_next,
//         displayText: speech_next,
//         source: 'webhook-echo-sample'
//     });
// });
//
// restService.post('/back', function(req, res) {
//     //var speech = req.body.result && req.body.result.parameters && req.body.result.parameters.back ? req.body.result.parameters.back : "Seems like some problem. Speak again."
//     var speech_back = 'here you go';
//     io.emit('back', new Date().toTimeString());
//
//     return res.json({
//         speech: speech_back,
//         displayText: speech_back,
//         source: 'webhook-echo-sample'
//     });
// });
//
// restService.post('/message', function(req, res) {
//     //var speech = req.body.result && req.body.result.parameters && req.body.result.parameters.message ? req.body.result.parameters.message : "Seems like some problem. Speak again."
//     var speech_msg = 'messages sent';
//     io.emit('message', new Date().toTimeString());
//
//     client.messages.create({
//        to: "+16467523706",
//          from: "+18057197602",
//          body: "Hello from Google Home!",
//          mediaUrl: "https://c1.staticflickr.com/3/2899/14341091933_1e92e62d12_b.jpg",
//      }, function(err, message) {
//          console.log(Object.keys(err));
//          console.log('twilio message '+err.message);
//          console.log('twilio message '+err.code);
//     });
//
//     return res.json({
//         speech: speech_msg,
//         displayText: speech_msg,
//         source: 'webhook-echo-sample'
//     });
// });

restService.post('/slack-test', function(req, res) {

    var slack_message = {
        "text": "Details of JIRA board for Browse and Commerce",
        "attachments": [{
            "title": "JIRA Board",
            "title_link": "http://www.google.com",
            "color": "#36a64f",

            "fields": [{
                "title": "Epic Count",
                "value": "50",
                "short": "false"
            }, {
                "title": "Story Count",
                "value": "40",
                "short": "false"
            }],

            "thumb_url": "https://stiltsoft.com/blog/wp-content/uploads/2016/01/5.jira_.png"
        }, {
            "title": "Story status count",
            "title_link": "http://www.google.com",
            "color": "#f49e42",

            "fields": [{
                "title": "Not started",
                "value": "50",
                "short": "false"
            }, {
                "title": "Development",
                "value": "40",
                "short": "false"
            }, {
                "title": "Development",
                "value": "40",
                "short": "false"
            }, {
                "title": "Development",
                "value": "40",
                "short": "false"
            }]
        }]
    }
    return res.json({
        speech: "speech",
        displayText: "speech",
        source: 'webhook-echo-sample',
        data: {
            "slack": slack_message
        }
    });
});
