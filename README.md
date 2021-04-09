# Wiki-API

## Boilerplate - Steps to Create a New Server That Uses MongoDB

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

## RESTful

| HTTP Verbs |           /articles          |          /articles/oasis          |
| :--------: | :--------------------------: | :-------------------------------: |
|     GET    |  Feches **all** the articles |  Feches **the** article on Oasis  |
|    POST    |  Creates **one** new article |                 -                 |
|     PUT    |               -              | Updates **the** articles on Oasis |
|    PATCH   |               -              |  Updates **the** article on Oasis |
|   DELETE   | Deletes **all** the articles |  Deletes **the** article on Oasis |

### Create the API Routes

#### GET Route

```javascript
//Create the GET Route that fetches all the articles from the DB
app.get(route, function(req, res){

});
```

#### READ From mongoDB

```js
//Query the DB and find all the "articles" inside the "Articles" collections
<ModelName>.find({conditions}, function(err, results){
	//Use the found results docs
});
```

#### GET Route Code Example

```js
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

#### POST Route

```js
//Create the POST Route that will create the new article
//Use express to address POST requests on the server
app.post(route, function(req, res){

});
```

#### CREATE Data and Save Into mongoDB

Save the Data Created from the POST Request Into the mongoDB

```js
//Create a new constant that will store a new article
const <constantName> = new <ModelName>({

	//The article will have two fields: title and content
	<fieldName> : <fieldData>,
	<fieldName> : <fieldData>,
});

//Save the new object into the mongoDB
<constantName>.save();
```

#### POST Route Code Example

```js
//Create the POST Route that will create the new article
//Use express to address POST requests on the server
app.post("/articles", function(req, res) {
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
});
```

**_Using Postman to Handle the POST Request_**</br>
1 - Open a new tab inside Postman</br>
2- Choose **POST** from the dropdown menu</br>
3 - Type in `localhost:3000/articles`</br>

**_Then to send data along with the POST request_**</br>
1 - Go to the **Body** tab and change the encoding to `x-www-form-urlencoded`, which is what our `bodyParser` is designed to handle</br>
2 - Then add the variables we defined: `title` and `content` as the **KEY** inside Postman</br>
3 - Inside a title and content to the **VALUE**</br>
4 - Press **SEND** to send the **POST** request</br>
5 - Jump back to the **Hyper** terminal and see the data being printed</br>
6 - Jump back **Robo 3T** and select `wikiDB/Collections/**articles**` then **CLICK** over it and select `View Documents`</br>

#### Example of a HTML Form POST Request

```html
<form method="post" action="/">
	<input type="text" name="title">
	<input type="text" name="content">
	<button type="submit">Send</button>
</form>
```

## Running the Server and MongoDB in the Hyper Terminal

1 - Open the project location inside Hyper and type in `mongod` and press `Enter`</br>
2 - In a new tab inside Hyper type `mongo` and press `Enter`</br>
3 - In a new tab inside Hyper type `nodemon app.js` and press `Enter`</br>
