// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const {WebhookClient,Card, Suggestion} = require('dialogflow-fulfillment');
const {dialogflow} = require('actions-on-google');
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
const app = dialogflow();
var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

app.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

function testImage(agent) {
    var visualRecognition = new VisualRecognitionV3({
      version: '2018-03-19',
      iam_apikey: 'T66sxixnkf5mul0e7TBxySr0-KBfiKYci9mAGxseDL7G'
    });

    var params = {
      //url: "https://www.t-mobile.com/content/dam/t-mobile/en-p/cell-phones/apple/apple-iphone-x/silver/Apple-iPhoneX-Silver-1-3x.jpg"
      url: agent.parameters.url
    };
    return new Promise((resolve, reject) => {
      visualRecognition.classify(params, function (err, response) {
        if (err) {
          console.log(err);
          agent.add("There is something wrong with the image link");
          reject("Error");
        }
        else {
          let result = JSON.stringify(response, null, 2);
          var str = "";
          var categories = response.images[0].classifiers[0].classes;
          categories.sort(function (a, b) { return b.score - a.score });
          categories.forEach(element => {
            if (element.score > 0.8 && element.type_hierarchy != null)
              str += element.class + " :" + element.score + "\n";
          });
          //agent.add('Image contains: \n' + str);
          agent.add(new Card({
            title: `Image Details`,
            imageUrl: params.url,
            text: str,
          })
          );
          console.log(result);
          resolve("Good");
        }
      });
    });
  }

  function testTone(agent) {
    var toneAnalyzer = new ToneAnalyzerV3({
      version: '2017-09-21',
      iam_apikey: 'mtfWF2RxjGZ_VZWBv8dVfGVHuwjy4THN5hA7oSwFti_L',
      url: 'https://gateway.watsonplatform.net/tone-analyzer/api'
    });


    var toneParams = {
      tone_input: { 'text': agent.parameters.myText },
      content_type: 'application/json'
    };

    return new Promise((resolve, reject) => {
      toneAnalyzer.tone(toneParams, function (err, response) {
        if (err) {
          console.log(err);
          agent.add("There is something wrong with the image link");
          reject("Error");
        }
        else {
          let result = JSON.stringify(response, null, 2);
          var str = "You sound ";
          var tones = response.document_tone.tones;
          tones.sort(function (a, b) { return b.score - a.score });
          tones.forEach(element => {
            if (element.score > 0.5){
              str += element.tone_name;
            });
          str +="."
          agent.add(str);
          
          resolve("Good");
        }
      });
    });
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('getImageDetailIntent', testImage);
  intentMap.set('getToneIntent', testTone);
  agent.handleRequest(intentMap);
});

const exapp = express().use(bodyParser.json());
exapp.post('/fulfillment',app.dialogflowFirebaseFulfillment);

var listener = exapp.listen(process.env.PORT,process.env.IP,function(){
//var listener = app.listen(4000,process.env.IP,function(){
  //var listener = app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server has started");
    console.log('Listening on port ' + listener.address().port);
});