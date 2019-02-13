# Hack Nights Web Dev Workshop
## Introduction
Hey all, thanks for coming to the first Hack Nights of Spring 2019! Today, I’ll be leading a Hack Nights Web Dev workshop where I’ll be introducing basic web development with Node.js/Express and MongoDB.  

By the end of today, hopefully you’ll have a better understanding of how web development works at a high level and will have a better grasp on the basics of Node.js and Express.

Today, we’ll be building `Troy Tips`, an application that lets anonymous students post USC campus related tips to a shared feed. The application is pretty simple:
* The home page displays all of the tips people have submitted
* There is a form that allows people to submit new tips
* Users can view an individual tip and share a permalink to that tip

At the end of this workshop and guide, I’ll provide more links and resources so you can learn more about the modern stack that a lot of developers are using today!

NOTE: Before you read on, make sure to check out the slides I prepared for the workshop ( [slides link](https://docs.google.com/presentation/d/1Gp9t75kZWHF7yDz8ZwgZcHpDmXkzeKu3QYSV20GokqQ/edit?usp=sharing) )

## Pre-requisites
This workshop is intended for beginner developers who have some programming experience. It is recommended that you have at least taken CSCI 102 or CSCI 103 and/or know how to use your computer’s terminal.

Before this workshop, you should have installed Node.js/NPM and MongoDB. If you haven’t, here are the links

* Install Node.js and NPM ( [https://nodejs.org/en/download/package-manager/](https://nodejs.org/en/download/package-manager/) )
	* (Note: for Mac users, if you have HomeBrew, it is recommended to install Node via HomeBrew versus the installer)
* Install MongoDB ( [https://docs.mongodb.com/manual/installation/](https://docs.mongodb.com/manual/installation/) )

## Set-Up
At this point, you should have Node.js, NPM, and MongoDB installed. This means we can start working on our site! To simplify this workshop, I’ve created a skeleton project that you can access from this repo.

Let’s get that skeleton project working on your local machine.

* Go ahead and run `git clone https://github.com/WilhelmWillie/hacknights-webdev-workshop.git` somewhere on your local machine.

This will clone this workshop repo where you can access the skeleton project.

Find the folder `troytips-skeleton` and access that from within your terminal. This folder has all of the barebones code that you need to get started. This document and workshop will help you complete the app so that it runs like the demo.

Once you’re inside the `troytips-skeleton` folder from your terminal:

* Run `npm install`

This will install all of the necessary libraries we need for our program to work.

(Want to know how this works? Look at the file package.json, this is how we tell NPM what our project’s dependencies are. All these dependencies are available at npmjs.com so when we run `npm install`, npm will download the right packages and will install it on our local machine)

* Once installation is done, run `npm start`. This will start a program called `nodemon` that will update our server whenever we make changes to our Javascript files.
* This will start a server on port 3000 so now you can access Troy Tips by going to `localhost:3000`  on your browser!

Yikes though. We see a message that says `Cannot GET /`.  We need to tell our server what to respond with when visit the home page!

## Intro to Routing
Let’s open up `server.js` . I’ve written a lot of the set up code for you. If you are at workshop, I’ll quickly go through what each section means.

What’s left for us is to set up how our server should respond to different requests using routes!

The default home page for a website is the `/` route. We need to write code that tells the server what to respond when the user requests the `/` route on their browser.

To do this, we’re going to create a router file that will handle this separately from our server.js file.

In the `routes` folder, you should see a file called `index.js`. We’ll use this file to define the routes for this application. We’re only going to use this file for this workshop but for more complex apps, we can split routes up across several files (Ex: users.js handling user routes, comments.js handling comment routes).

For our application, we’re only going to deal with 3 routes: `/`, `/tip:id`, and `/tip/new`.  Let’s start off with our `/` route.

### Home Page Routing
Our `routes/index.js` file already has a few routes defined, albeit they’re very basic routes.

Notice the structure of the file. First we create a router variable:
`const router = express.Router()`

We can extend this object to handle different routes by passing in a function that takes two arguments: the request, and response. The request variable allows us to obtain any data that our user sent to our server. Response allows us to send back a message, a file, a web page, and more.

Let’s look at the home page route which is very basic. This will simply display the string “all tips” when the user visits the home page.
```
router.get('/', (req, res) => {
  return res.send('all tips');
});
```

We could replace this to send a file like an HTML page, an image, or even better: a dynamic HTML page that we can embed variables in!  First, let’s connect this router to our server.

Go back to `server.js`. Look for the line that says `TODO: Set up routing`. Let’s import our route file and tell our server to use that file for handling routes.

To do that, we insert the following lines of code:
```
// Routing
const indexRouter = require('./routes/index');
app.use('/', indexRouter);
```

We create a variable indexRouter that contains the router from the `routes/index.js`  then tell our server or `app` variable to use that router for every route that starts with `/`.

Now go to `localhost:3000` in your browser. Great, we got the router to work… but that’s boring. What if we want to render an HTML page? Or better yet, what if we wanted to embed dynamic content into an HTML page?

Node.js supports templates that we can render using a function. We can specify what template we want to use then pass along data to that template.

Let’s go back to our `routes/index.js` file and modify a single line.

Change  `return res.send('all tips');` to `return res.render(‘home’);`

In our `server.js` file, we set our views folder to be `/views` and our view engine to be EJS. This allows us to use the `res.render()` function so we can say which template we want (`home` = `/views/home.ejs`). The render function not only allows us to simply display HTML, but also embed data from the backend into the frontend. This will be important later on as we start embedding content from our database.

Now when you access `localhost:3000`, you should see a pretty web page. Great! But it’s not dynamic and we can’t do anything with it.. Next step is to set up our database so we can make our web app dynamic!

## Database Setup & Setting Up Our Model
We’re going to hook up our web app to a Mongo database. MongoDB is a NoSQL, document-oriented database. It integrates really neatly with apps built in Javascript and serves our purposes pretty well. It’s a bit different from MySQL which many of you might be used to. At the end of this guide, I’ll provide more links so if you wanna learn more, you can! Back to the workshop…

Let’s install some packages:

* Run `npm install --save mongoose`

This will install a package called Mongoose into node_modules and will document it as a dependency in `package.json`. Mongoose is a package that makes working with MongoDB easy by allowing us to define schemas/models that represent our data.

Next, let’s start a MongoDB instance.

* Open a separate Terminal window and `cd` to a folder that can hold our database
* Run `mkdir troytips-db` then `mongod —dbpath=./troytips-db`
* This will start a database in our `troytips-db` folder. You can close out of this Terminal window now as it’ll run in the background.
* For reference, this database can be accessed in our code through the URL `mongodb://localhost/troytips`

We need to establish a connection to this database in our `server.js` file. Look for the line that says `TODO: Set up Database` . Replace that with

```
// Connect to database
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/troytips')
```

This will establish a connection to MongoDB via Mongoose. Now that we have that connection established, we need to set up the model for our Tip object.

### Model Set-up
Open up `models/Tip.js`. There you will se a skeleton model that I’ll walk you through.

First, we need to get a reference to Mongoose, the package I referred to earlier.

Next, we need to define the schema for our Tip. Feel free to replace the `TODO: Define the Tip model` with the following:

```
// Define the Tip model
const tipSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});
```

To explain: we’re setting up a Tip model that has three fields. Content, author, and created. Content is a String that is required, this will represent the actual Tip content that users will submit. Author is also a String that is required, this will represent the name of the person submitting the tip. Lastly, created is a Datetime object that defaults to the time when the Tip was created.

We’ll be using this model throughout the rest of the workshop. After this workshop, I challenge you to extend this model and add more fields.

The last line of `models/Tip.js` creates a Mongoose model that is available for import by the rest of our web app. Now that we’ve set up our MongoDB connection and our Tip model, we can start writing code so we can create and read Tips to/from our database!

## POST Routes and Tip Creation
Go to `localhost:3000` on your browser. Try filling out the form then click submit. You will notice the app does… nothing! Let’s change that.

What we’re going to do is edit the form so that when you click submit, it’ll send a request to our server indicating that the user wants to create a new Tip. We’ll be using a POST request that will hit a specific route that we’ve programmed.

First, let’s edit the HTML of our home page. Go to `views/home.ejs`. We need to change up some of the markup so that we can send data to our server.

Change the opening `<form>` tag so that it looks like this:
* `<form method="POST" action="/tip/new">`

When the user clicks the submit button, this will tell the browser to make a POST request to the `/tip/new` route.

Next, we need to add names to our input tags. The names of these input tags will allow us to access input values on our server after they are submitted.

For the text area, add the attribute `name="content"`.
For the next input tag, add the attribute `name=“author"`

I’ve already taken care of the submit button for you but note that it has the type `submit`. This indicates to the browser that this is the button that will submit the data when it is clicked .

### Post Route
If you save `views/home.ejs` , reload `localhost:3000`, then try submitting a Tip, you’ll be directed to a page that simply says “new tip”. None of this data is being saved to a database so let’s write code that actually does this.

Open up `/routes/index.js`. First, we need to import the Tip model we previously created. Replace the `TODO: Import Tip model` line with: `const Tip = require('../models/Tip');`

Next, look for the `TODO: Create a new Tip` comment. Let’s fill out this route.

```
// Create a new tip
router.post('/tip/new', (req, res) => {
  const content = req.body.content;
  const author = req.body.author;
}
```

Remember how we added `name` attributes to our inputs? We can access that through the req (request) variable! It will be passed to us via the body variable. We’ll store these values into separate variables so we can do error handling and validation later. Next, we need to create a new Tip object and try to save it to our data base.

```
// Create a new tip
router.post('/tip/new', (req, res) => {
  const content = req.body.content;
  const author = req.body.author;

	// Add this piece of code next!
	const tip = new Tip({
    content: content,
    author: author
  });

	tip.save(function (err) {
    if (err) {
      return res.render('error');
    }

    return res.redirect('/');
  });
});
```

This will create a new instance of a Tip model with the data we pulled from `req.body`. Then we try saving the new Tip to our database. Saving is an asynchronous function which means we need to pass a callback function that will get called after an attempt was made.

If there was an error, our route will render our `error` template. Otherwise, we will redirect the user to the home page.

This callback stuff might be a bit confusing if you’re new to asynchronous Javascript development. This callback pattern is quite common in Javascript as network operations rarely tend to be synchronous. I’ll have more links at the end of this guide so you can learn more about how this all works and why it happens.

Now, when you go to `localhost:3000`, you can actually go ahead, fill out the form, then click submit! If everything went well, you should be redirected to the home page… but the feed doesn’t update. And that’s because we haven’t written the code for that.. so let’s do that now.

## GET Routes and Viewing a Single Tip
Remember how I said we can use EJS and templates to embed data from our back-end into our front-end? Let’s do that now. When users access the `/` route, we should hit the database, retrieve all the Tips, and render that to the user.

Let’s stay on `routes/index.js` and modify our `router.get(‘/‘)` route.

Models have a variety of methods that allow us to do search operations. We’ll use a method called `.find()`

Replace our `res.render(‘home’);` line with the following:

```
// Get all tips in the database
router.get('/', (req, res) => {
  Tip.find({}, null, {sort: {created: -1}}, function (err, tips) {
    if (err) {
      res.render('error');
    } else {
      res.render('home', {
        tips: tips,
        moment: moment
      });
    }
  });
});
```

That’s a lot of code but let me walk you through it:
* First ,we call the find method.
	* The first argument is the conditions. We want every Tip so we don’t have any conditions.
	* The second argument are the fields we want. We want every field so we pass `null`.
	* Third argument are options. You can google and read more about this but essentially we’re telling Mongo that we want to sort by the `created` field in a descending (-1) order
* Database calls are asynchronous so we need to pass a callback method that deals with the results. This callback method passes back two variables: an error or an array of Tip objects resulting from the search
	* If there is an error, we render the `error` template
* Otherwise, we render the `home` template and pass along two objects:
	* the tips array
	* and a library called moment that we imported at the top
		* (I didn’t go over this much but moment is a great library for date time formatting. Simplifies it a bunch)

If you save this file and access `localhost:3000`, nothing will update visually but behind the scenes, the server is accessing a database for us. Let’s update our `views/home.ejs` file so we can display this data from the backend.

In our `views/home.ejs` file, find the `TODO: Display tips` line. I created the basic HTML structure for the Tip object but now we need to make it so that it’s dynamic. Replace the entire `<div class=“tips”></div>` section with the following:

```
<div class="tips">
  <% for(var i = 0; i < tips.length; i++) { %>
    <div class="tip">
        <p class="content"><%= tips[i].content %></p>

        <p class="details">
          <b>
            - <%= tips[i].author %>
          </b>

          <br/>

          <a href="/tip/<%= tips[i]._id %>" class="permalink">
            <%= moment(tips[i].created).format('MMMM DD, hh:mm a') %>
          </a>
        </p>
    </div>
  <% } %>
</div>
```

Remember how in the `routes/index.js` file, we pass along the data from the database to our template? We can access that data using `<%` and `%>` tags.

`<%` and `%>` are used for logic. `<%=` and `%>` are used for printing out data.

Essentially, we loop through the tips array and create a `<div class=“tip”>` for each element in that array. We fill in our Tip HTML structure with content stored in `tips[i]`. Now if you click save and load `localhost:3000`, you can now add tips using the form and see them in our feed!

Good stuff! However, try clicking the date that corresponds to each Tip. I added a permalink for each Tip so you can share Tips individually but all you see is a simple page that says `single tip`. We need to define the route for each individual Tip! Let’s jump into that

### Route Parameters
Let’s go back to our good old `routes/index.js` file. Notice how we have one more Route left to fill out: `router.get(‘/tip/:id)`

See the `:id` part of that string? That’s a parameter. Whatever value the user puts in, we can access through the variable `req.params.id`

Example: `localhost:3000/tip/XYZ` -> req.params.id == ‘XYZ’
Example: `localhost:3000/tip/ABC` -> req.params.id == ‘ABC’

In our case, this `:id` will be the unique ID corresponding to a single Tip. Whenever we insert a document into our Mongo database, it receives a unique ID. Mongoose includes a nifty method for models called `findById()`. We’ll use this so we can create a permalink route that allows us to see a specific tip via a URL.

Now, let’s fill in that route! Replace the current `router.get(‘/tip/:id’)` code with the following:
```
// View a single tip
router.get('/tip/:id', (req, res) => {
  Tip.findById(req.params.id, function (err, tip) {
    if (err) {
      // Display error page if we can't find Tip
      res.render('error');
    } else {
      // Display Tip, pass moment a time format library
      res.render('tip', {
        tip: tip,
        moment: moment
      });
    }
  });
});
```

The first parameter of findById is the unique ID corresponding to the Tip. The second parameter of findById is a function with two parameters: an error and the corresponding tip.

If there is an error, we render the error template. Otherwise, we’ll render the `tip` template and will pass along that tip’s data and the moment library we saw earlier.

One last thing before we get permalink working: open up `views/tip.ejs`

Right now the HTML is static but let’s update it so that it’s dynamic.

* Replace the inner content of `<p class=“content”>` with `<p class="content"><%= tip.content %></p>`
* Replace the `Anonymous` text with `<%= tip.author %>`
* Replace the hardcoded date with `<%= moment(tip.created).format('MMMM DD, hh:mm a') %>`
* Set the href attribute of the permalink to `/tip/<%= tip._id %>`

The end result HTML of `<div class=“tip”>` should look like:
```
<div class="tip">
  <p class="content"><%= tip.content %></p>

  <p class="details">
    <b>
      - <%= tip.author %><br/>
    </b>

    <a href="/tip/<%= tip._id %>" class="permalink">
      <%= moment(tip.created).format('MMMM DD, hh:mm a') %>
    </a>
  </p>
</div>
```

Save this file and now visit `localhost:3000`. Click on one of the gray dates next to a Tip and now you should see a single Tip page that displays data for that single Tip.

So there you go! You’re now 90% done with this application. You were able to connect to a database, write to it, and read from it. What’s left now is error handling. You can now call it a day and say you’re done but I highly recommend going through error handling so you understand how to do it at a basic level.

## Error Handling (Optional)
## What’s Next?
