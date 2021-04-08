//jshint esversion:6

//Create 4 constants to require packages/modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

//Create a new app instance using express
const app = express();

//Tell the app to use EJS as its view engine as the templating engine
app.set("view engine", "ejs");

//Require body-parser module to parser the requests
app.use(bodyParser.urlencoded({
  extended: true
}));

//Tell the app to use all the statics files inside the public folder
app.use(express.static("public"));

//Setup MongoDB
//Allow mongoose to connect to the local mongoDB instance
//Connect to the new URL where mongoDB is hosted locally (usually localhost:27017)
//useNewUrlParser: true -> To get rid of the errors mongoDB throws
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});

//Create the schema to the articles collection so we can create some models around it
const articleSchema = {
  title: String,
  content: String
};

//Create the Article model using mongoose based on the articleSchema
const Article = mongoose.model("Article", articleSchema);

//Create the GET Route that fetches all the articles from the DB
app.get("/articles", function(req, res) {
  //Query the DB and find all the articles inside the Articles collections
  Article.find(function(err, foundArticles) {
    console.log(foundArticles);

    //Send back to the client
    If(!err) {
      res.send(foundArticles);
    }
    //Send back the error
    else {
      res.send(err);
    }
  });
});


//Set up the server to listen to port 3000
app.listen(3000, function() {
  console.log("Server started on port 3000");
});