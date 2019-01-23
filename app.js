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
    // return new Promise((resolve, reject)=>{
    //   var visualRecognition = new VisualRecognitionV3({
    //     version: '2018-03-19',
    //     iam_apikey: 'Ae8wfpNwYI-OU88zzvem1L7iH0LzfUxdK1SElGV5VZQa'
    //   });

    //   var params = {
    //     url: "https://www.t-mobile.com/content/dam/t-mobile/en-p/cell-phones/apple/apple-iphone-x/silver/Apple-iPhoneX-Silver-1-3x.jpg"
    //   };

    //   visualRecognition.classify(params, function (err, response) {
    //     if (err)
    //         console.log(err);
    //     else {
    //         //Store the response into a string
    //         var result = JSON.stringify(response, null, 2);
    //         //Note that the return data is stored in response
    //         //res.write(response.images.constructor.name + "\n");
    //         //res.write(response.images[0].classifiers.constructor.name+"\n");
    //         //res.end(response.images[0].classifiers[0].classes[0].score+"\n");
    //         //Get the array of classes (category classification)
    //         var class_col = response.images[0].classifiers[0].classes;
    //         for (i = 0; i < class_col.length; i++) {
    //             res.write(class_col[i].class + "\t");
    //             res.write(class_col[i].score + "\n");
    //         }
    //         res.end("END");
    //         console.log(result);

    //     }
    //   });
    // });
    agent.add("HAAIIII");
  };

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('getImageDetailIntent', testImage);
  
  agent.handleRequest(intentMap);
});

const exapp = express().use(bodyParser.json);
exapp.post('/fulfillment',app.dialogflowFirebaseFulfillment);

var listener = exapp.listen(process.env.PORT,process.env.IP,function(){
//var listener = app.listen(4000,process.env.IP,function(){
  //var listener = app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server has started");
    console.log('Listening on port ' + listener.address().port);
});