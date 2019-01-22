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
    agent.add(`WOrking...`);
   
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('getImageDetailIntent', testImage);
  
  agent.handleRequest(intentMap);
});

const exapp = express().use(bodyParser.json);
exapp.post('/fulfillment',app.dialogflowFirebaseFulfillment);

//var listener = app.listen(process.env.PORT,process.env.IP,function(){
var listener = app.listen(4000,process.env.IP,function(){
  //var listener = app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server has started");
    console.log('Listening on port ' + listener.address().port);
});