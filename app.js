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

/****** REQUEST TARGETTING ALL ARTICLES ******/

//Chained Route Handlers Using Express - app.route() method
//You can create chainable route handlers for a route path by using app.route(). Because the path is specified at a single location, creating modular routes is helpful, as is reducing redundancy and typos.
app.route("/articles")
  //Create the GET Route that fetches all the articles from the DB
  .get(function(req, res) {
    //Query the DB and find all the articles inside the Articles collections
    Article.find(function(err, foundArticles) {
      console.log(foundArticles);

      //Send back to the client
      if (!err) {
        res.send(foundArticles);
      }
      //Send back the error
      else {
        res.send(err);
      }
    });
  })

  //Create the POST Route that will create the new article
  //Use express to address POST requests on the server
  .post(function(req, res) {
    //Once the POST request come through from the client we need to tap into the req.body in order to grab the data that was sent through
    console.log(req.body.title);
    console.log(req.body.content);

    //Create a new constant newArticle that will store a new article
    //Use the Article model
    const newArticle = new Article({

      //title will store the data we receive from the POST request through the req.body.title
      //content will store the data we receive from the POST request through the req.body.content
      title: req.body.title,
      content: req.body.content
    });
    //Save the new object into the mongoDB
    newArticle.save(function(err) {
      if (!err) {
        res.send("Successfully added a new article!");
      } else {
        res.send(err);
      }
    });
  })

  //Create the DELETE Route that will delete all the articles inside articles collection using mongoose
  .delete(function(req, res) {
    //How the server will respond when the user makes the delete request to the /articles route
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Successfull deleted all articles from the collection!");
      } else {
        res.send(err);
      }
    });
  });

// //Create the GET Route that fetches all the articles from the DB
// app.get("/articles", function(req, res) {
//   //Query the DB and find all the articles inside the Articles collections
//   Article.find(function(err, foundArticles) {
//     console.log(foundArticles);
//
//     //Send back to the client
//     if (!err) {
//       res.send(foundArticles);
//     }
//     //Send back the error
//     else {
//       res.send(err);
//     }
//   });
// });
//
// //Create the POST Route that will create the new article
// //Use express to address POST requests on the server
// app.post("/articles", function(req, res) {
//   //Once the POST request come through from the client we need to tap into the req.body in order to grab the data that was sent through
//   console.log(req.body.title);
//   console.log(req.body.content);
//
//   //Create a new constant newArticle that will store a new article
//   //Use the Article model
//   const newArticle = new Article({
//
//     //title will store the data we receive from the POST request through the req.body.title
//     //content will store the data we receive from the POST request through the req.body.content
//     title: req.body.title,
//     content: req.body.content
//   });
//   //Save the new object into the mongoDB
//   newArticle.save(function(err) {
//     if (!err) {
//       res.send("Successfully added a new article!");
//     } else {
//       res.send(err);
//     }
//   });
// });
//
// //Create the DELETE Route that will delete all the articles inside articles collection using mongoose
// app.delete("/articles", function(req, res) {
//   //How the server will respond when the user makes the delete request to the /articles route
//   Article.deleteMany(function(err) {
//     if (!err) {
//       res.send("Successfull deleted all articles from the collection!");
//     } else {
//       res.send(err);
//     }
//   });
// });

/****** REQUEST TARGETTING A SPECIFIC ARTICLE ******/

app.route("/articles/:articleTitle")

  //Express Parameters -
  //req.params.articleTitle = "Oasis"

  .get(function(req, res) {
    //Look through our collection of Articles, find one document where the title is equal to the one inside the request parameters which is the articleTitle (req.params.articleTitle)
    Article.findOne({
      title: req.params.articleTitle
    }, function(err, foundArticle) {

      //Send the article back to the client if it has been found
      if (foundArticle) {
        res.send(foundArticle);
        //If the article has not been found then display the message below
      } else {
        res.send("No articles matching the title provided! Please try again!");
      }
    });
  })

  //Create the PUT request that uses mongoose's UPDATE method
  .put(function(req, res) {
    //Work with mongoDB to replace a specific document with whatever is sent over by the client
    Article.update({
      /*
      Search through the Articles collection with the title
      that is requested by the client inside the URL parameter
      */
      title: req.params.articleTitle
    }, {
      //The update we want to make, we just like the POST request
      title: req.body.title,
      content: req.body.content
    }, {
      //mongoose needs the below to overwrite
      overwrite: true
    }, function(err) {
      if (!err) {
        res.send("Successfully updated article using PUT Request!");
      }
    });
  })

  /*
  Create the PATCH request that will update a particular element (field)
  in the Article collection without overwritting everything
  Use mongoose's UPDATE method
  */
  .patch(function(req, res) {
    Article.update({
        title: req.params.articleTitle
      },
      /*
      What we want to update, use the $set operator to replace the value of a field with the specified value
      The req.body inside the $set operator will take what the users passes through and
      bodyParser will reparse the request and pickup the field(s) the user have provided,
      hence updating mongoDB for only the field(s) that have a new value(s)
      */
      {
        $set: req.body
      },
      function(err) {
        if (!err) {
          res.send("Successfully updated the article using the PATCH Request!");
        } else {
          res.send(err);
        }
      });
  })

  //Create the DELETE request that will delete an entry from mongoDB (title and content)
  .delete(function(req, res) {
    Article.deleteOne({
      title: req.params.articleTitle
    }, function(err) {
      if (!err) {
        res.send("Successfully deleted the corresponding article using mongoose's deleteOne method!");
      } else {
        res.send(err);
      }
    });
  });

//Set up the server to listen to port 3000
app.listen(3000, function() {
  console.log("Server started on port 3000");
});