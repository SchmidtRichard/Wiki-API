# Build Your Own RESTful API From Scratch

# Boilerplate - Create a New Server That Uses MongoDB

```javascript
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

//Set up the server to listen to port 3000
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
```

* * *

# RESTful

| HTTP Verbs |           /articles          |          /articles/oasis          |
| :--------: | :--------------------------: | :-------------------------------: |
|     GET    | Fetches **all** the articles |  Fetches **the** article on Oasis |
|    POST    |  Creates **one** new article |                 -                 |
|     PUT    |               -              | Updates **the** articles on Oasis |
|    PATCH   |               -              |  Updates **the** article on Oasis |
|   DELETE   | Deletes **all** the articles |  Deletes **the** article on Oasis |

## Create the API Routes

### HTTP GET Request/GET Route

```javascript
//Create the GET Route that fetches all the articles from the DB
app.get(route, function(req, res){

});
```

### READ From mongoDB

```javascript
//Query the DB and find all the "articles" inside the "Articles" collections
<ModelName>.find({conditions}, function(err, results){
	//Use the found results docs
});
```

### GET Route Code Example

```javascript
//Create the GET Route that fetches all the articles from the DB
app.get("/articles", function(req, res) {
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
});
```

### HTTP POST Request/POST Route

```javascript
//Create the POST Route that will create the new article
//Use express to address POST requests on the server
app.post(route, function(req, res){

});
```

### CREATE Data and Save Into mongoDB

Save the Data Created from the POST Request Into the mongoDB

```javascript
//Create a new constant that will store a new article
const <constantName> = new <ModelName>({

	//The article will have two fields: title and content
	<fieldName> : <fieldData>,
	<fieldName> : <fieldData>,
});

//Save the new object into the mongoDB
<constantName>.save();
```

### POST Route Code Example

```javascript
//Create the POST Route that will create the new article
//Use express to address POST requests on the server
app.post("/articles", function(req, res) {
  /*
  Once the POST request come through from the client we need to
  tap into the req.body in order to grab the data that was sent through
  */
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
});
```

### HTTP DELETE Request/DELETE Route

```javascript
//Create the DELETE Route that will delete all the articles inside articles collection using mongoose
app.delete(route, function(req, res){

});
```

### DELETE Data From mongoDB Using deleteMany

```javascript
Mongoose Delete
<modelName>.deleteMany({conditions}, function(err){

});
```

### DELETE Route Code Example

```javascript
//Create the DELETE Route that will delete all the articles inside articles collection using mongoose
app.delete("/articles", function(req, res) {
  //How the server will respond when the user makes the delete request to the /articles route
  Article.deleteMany(function(err) {
    if (!err) {
      res.send("Successfull deleted all articles from the collection!");
    } else {
      res.send(err);
    }
  });
});
```

## [app.route()](https://expressjs.com/en/guide/routing.html)

You can create chainable route handlers for a route path by using `app.route()`. Because the path is specified at a single location, creating modular routes is helpful, as is reducing redundancy and typos.

Here is an example of chained route handlers that are defined by using `app.route()`.

```javascript
app.route('/book')
  .get(function (req, res) {
    res.send('Get a random book')
  })
  .post(function (req, res) {
    res.send('Add a book')
  })
  .put(function (req, res) {
    res.send('Update the book')
  })
```

### New Code Using Chained Route Handlers That Replaces the Previous Ones

```javascript
 //Chained Route Handlers Using Express - app.route() method
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
     /*
     Once the POST request come through from the client we need to tap
     into the req.body in order to grab the data that was sent through
     */
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

   /*
   Create the DELETE Route that will delete all the articles
   inside articles collection using mongoose
   */
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
```

## [Route Parameters](https://expressjs.com/en/guide/routing.html)

Route parameters are named URL segments that are used to capture the values specified at their position in the URL. The captured values are populated in the `req.params` object, with the name of the route parameter specified in the path as their respective keys.

    Route path: /users/:userId/books/:bookId
    Request URL: http://localhost:3000/users/34/books/8989
    req.params: { "userId": "34", "bookId": "8989" }

To define routes with route parameters, simply specify the route parameters in the path of the route as shown below.

```javascript
app.get('/users/:userId/books/:bookId', function (req, res) {
  res.send(req.params)
})
```

> :warning: The name of route parameters must be made up of ???word characters??? ([A-Za-z0-9_]).

### HTTP GET a Specific Article Using Chained Route Handlers

```javascript
//Create the GET Route that fetches all a specific article from the DB
app.route("route")

.get(function(req, res){

});
```

### READ from mongoDB

```javascript
//Query the DB and find a specific article inside the "Articles" collections
//findOne Method
<ModelName>.findOne({conditions}, function(err, result){
	//Use the found result
});
```

### GET Route Code Example Using Chained Route Handlers

```javascript
app.route("/articles/:articleTitle")

  //Express Parameters -
  //req.params.articleTitle = "Oasis"

  .get(function(req, res) {
    /*
    Look through our collection of Articles, find one document
    where the title is equal to the one inside
    the request parameters which is the articleTitle (req.params.articleTitle)
    */
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
  });
```

### HTTP PUT Request/PUT Route

```javascript
//Create the PUT Route that updates the properties of an entire article
app.put(route, function(req, res){

});
```

### UPDATE mongoDB

```javascript
//Work with mongoDB to replace a specific document with whatever is sent over by the client
<ModelName>update({conditions}, {updates}, {overwrite: true} function(err, results){

});
```

### PUT Route Code Example Using Chained Route Handlers

```javascript
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
  });
```

### HTTP PATCH Request/PATCH Route

```javascript
//Create the PATCH Route that updates the specific field of an article
app.patch(route, function(req, res){

});
```

### UPDATE mongoDB

```javascript
//Work with mongoDB to replace a specific field with whatever is sent over by the client
<ModelName>.update({conditions}, {$set: updates}, function(err, results){

});
```

### PATCH Route Code Example Using Chained Route Handlers

```javascript
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
      Use the $set operator to replace the value of a field with the specified value we want to update
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
  });
```

### HTTP DELETE Request/DELETE Route

```javascript
//Create the DELETE request that will delete an entry from mongoDB (title and content)
app.delete(route, function(req, res){

});
```

### DELETE mongoDB

```javascript
//Create the DELETE request that will delete an entry from mongoDB (title and content)
<ModelName>.deleteOne({conditions}, function(err){

});
```

### DELETE Route Code Example Using Chained Route Handlers

```javascript
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
```

* * *

## Using Postman

**_Using Postman to Handle the POST Request_**</br>
1 - Open a new tab inside Postman</br>
2- Choose **POST** from the dropdown menu</br>
3 - Type in `localhost:3000/articles`</br>

**_Then to send data along with the POST request_**</br>
1 - Go to the **Body** tab and change the encoding to `x-www-form-urlencoded`, which is what our `bodyParser` is designed to handle</br>
2 - Then add the variables we defined in the code: `title` and `content` as the **KEY** inside Postman</br>
3 - Inside title and content add the relevant data to the **VALUE** field</br>
4 - Press **SEND** to send the **POST** request</br>
5 - Jump back to the **Hyper** terminal and see the data being printed</br>
6 - Jump back **Robo 3T** and select `wikiDB/Collections/**articles**` then **CLICK** over it and select `View Documents`</br>

* * *

## Example of a HTML Form POST Request

```html
<form method="post" action="/">
	<input type="text" name="title">
	<input type="text" name="content">
	<button type="submit">Send</button>
</form>
```

* * *

## mongo Guide

### Running the Server and MongoDB in the Hyper Terminal

1 - Open the project location inside Hyper and type in `mongod` and press `Enter`</br>
2 - In a new tab inside Hyper type `mongo` and press `Enter`</br>
3 - In a new tab inside Hyper type `nodemon app.js` and press `Enter`</br>

### mongo Shell Quick [Reference](https://docs.mongodb.com/manual/reference/mongo-shell/)

|  Option | Description                                                                                                                     |
| :-----: | :------------------------------------------------------------------------------------------------------------------------------ |
|  --help | Show command line options                                                                                                       |
|  --nodb | Start mongo shell without connecting to a database.                                                                             |
| --shell | Used in conjunction with a JavaScript file (i.e. `<file.js>`) to continue in the mongo shell after running the JavaScript file. |

### mongo Command Helpers

|  Help Methods and Commands  | Descritpion                                                                                                                                                                                                       |
| :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|             help            | Show help.                                                                                                                                                                                                        |
|          db.help()          | Show help for database methods.                                                                                                                                                                                   |
| db.&lt; collection >.help() | Show help on collection methods. The &lt;**collection**> can be the name of an existing collection or a non-existing collection.                                                                                  |
|           show dbs          | Print a list of all databases on the server. The operation corresponds to the listDatabases command. If the deployment runs with access control, the operation returns different values based on user privileges. |
|        use &lt; db >        | Switch current database to &lt;**db**>. The mongo shell variable **db** is set to the current database.                                                                                                           |
|       show collections      | Print a list of all collections for current database.                                                                                                                                                             |
|          show users         | Print a list of users for current database.                                                                                                                                                                       |
|          show roles         | Print a list of all roles, both user-defined and built-in, for the current database.                                                                                                                              |
|         show profile        | Print the five most recent operations that took 1 millisecond or more.                                                                                                                                            |
|        show databases       | Print a list of all available databases. The operation corresponds to the listDatabases command. If the deployment runs with access control, the operation returns different values based on user privileges.     |
|            load()           | Execute a JavaScript file.                                                                                                                                                                                        |
