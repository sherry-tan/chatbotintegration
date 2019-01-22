var express = require("express");
var app = express();
var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');

app.get("/test",function(req,res){

  var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
  var fs = require('fs');

  var visualRecognition = new VisualRecognitionV3({
    version: '2018-03-19',
    api_key: 'T66sxixnkf5mul0e7TBxySr0-KBfiKYci9mAGxseDL7G'
  });

  var images_file = fs.createReadStream('./picture.jpg');
  var classifier_ids = ["food"];

  var params = {
    url:"https://www.t-mobile.com/content/dam/t-mobile/en-p/cell-phones/apple/apple-iphone-x/silver/Apple-iPhoneX-Silver-1-3x.jpg"
  };

  visualRecognition.classify(params, function(err, response) {
    if (err)
      console.log(err);
    else
      console.log(JSON.stringify(response, null, 2))
  });

})

app.get("/testpersonality",function(req,res){

    
  var personality_insights = new PersonalityInsightsV3({
    iam_apikey: 'xTHRBRNKlUpsmbIPDXEg73bcpFnVEuqUrQFRtKi4GKhS',
    version_date: '2017-10-13'
  });

  var params = {
    content: `In Moulmein, in Lower Burma, I was hated by large numbers of people — the only time in my life that I have been important enough for this to happen to me. I was sub-divisional police officer of the town, and in an aimless, petty kind of way anti-European feeling was very bitter...In Moulmein, in Lower Burma, I was hated by large numbers of people — the only time in my life that I have been important enough for this to happen to me. I was sub-divisional police officer of the town, and in an aimless, petty kind of way anti-European feeling was very bitter...`,
    content_type: 'text/plain',
    consumption_preferences: true,
    raw_scores: true
  };

  personality_insights.profile(params, function(error, response) {
    if (error)
      console.log('Error:', error);
    else
      console.log(JSON.stringify(response, null, 2));
      res.end(JSON.stringify(response, null, 2));
    }
  );

})

//var listener = app.listen(process.env.PORT,process.env.IP,function(){
var listener = app.listen(4000,process.env.IP,function(){
	//var listener = app.listen(process.env.PORT,process.env.IP,function(){
	console.log("server has started");
	 console.log('Listening on port ' + listener.address().port);
});
