This is a quick demo to show the difference between a function and a constructor in Javascript. It also has a backbone.js example.

## Installation

Just clone this repo anywhere you can reach it with a web browser and load index.html.

## Files

There are two files we care about:

1. **index.html** - This file does three things:
	* Creates empty DOM elements named content1-content3 into which our code will drop.
	* Loads our javascript libraries (jquery, underscore, backbone).
	* Creates our examples when the DOM has finished loading.
	
2. **app.js** - This file contains the javascript examples.

## Namespacing

One convention I've followed here is putting everything in a single namespace, defined as an object literal at the top of app.js:

	var app = {
	  getTweets: function(){
	    // some stuff
	  },
	  parseTweets: funtction(){
	    // some other stuff		
	  }
	}      	

Then, anytime I've created something in the app, I can put it under the `app` namespace, like so:

	app.foo = new app.SomeConstructor({
	  // some stuff
	});

This has several advangages:

* It keeps you from accidentally overwriting other libraries' objects which may be on your page doing important stuff.
* It keeps you from accidentally creating global variables.

## Functions vs Constructors

OK, with that out of the way, let's learn the difference between functions and constructors using some examples.

### Example 1 - Calling a Function Object

In our first example index.html, we call this function's `get` method like so:

	app.functionTweets.get({
	  id:"DEVOPS_BORAT",
	  el:$("#content1")
	});

passing in a `params` hash with the Twitter username and the DOM element into which we'd like to put the results. Over in app.js, `app.functionTweets` looks like this:

	app.functionTweets = {
	  get: function(params){
	    // Set defaults if not provided
	    params.id = params.id || "baspete",
	    params.el = params.el || $("#content1");
	
	    // Nested, named callbacks
	    app.getTweets(params.id, function(data){
	      app.parseTweets(data, function(tweets){
	        app.insert(tweets, params.el);
	      });
	    });
	  }
	}; 

That's a function. In this case, it uses a series of nested named callbacks (defined as methods on the `app` namespace at the top of app.js) to get a user's Twitter feed via XHR, extract and format the tweets into an HTML list, and insert the results into the DOM where we asked it to. Simple.

### Example 2 - Creating an Instance of a Constructor Object

Our second example works a bit differently. It looks like:

	app.tfln = new app.ConstructorTweets({
	  id:"TFLN",
	  el:$("#content2")
	}).init();

There are two significant differences between this and our first example:

1. We're using a "new" keyword to create a **new instance** of the `app.ConstructorTweets` object.
2. We're chaining a call to the object's `init` method to the creation that new instance object.

That new instance is given a name, `app.tfln`. It can be referred to again and again, and changes we make to it have no effect on the app.ConstructorTweets Constructor object.

**PROTIP:** It's a good idea to name your constructors by capitalizing the first letter. This allows you to easly tell them them from functions or variables, which ususally have a small first letter.

If we look in `app.js`, you'll see that `app.ConstructorTweets` has several methods:

	app.ConstructorTweets = function(params){
	
	  this.init = function(){
	    // Set defaults if not provided
	    this.id = params.id || "baspete";
	    this.el = params.el || $("#content1");
	    this.tweets = null;
	    // Get the data and render it (note callback)
	    var render = this.render,
	        el = this.el;
	    this.get(function(){
	      render(el);
	    });
	  };
	
	  this.get = function(cb){
	    // Nested, named callbacks
	    app.getTweets(this.id, function(data){
	      app.parseTweets(data, function(tweets){
	        this.tweets = tweets; // save as attribute for external access
	        if(typeof(cb)!=="undefined"){
	          cb();
	        }
	      });
	    });
	  };
	
	  this.render = function(el){
	    app.insert(this.tweets, el);
	  };
	
	};
	
Each of those methods exists after instantiation on our new `app.tfln` object, and we can call them whenever we want. In fact, that's exactly what happens in our instantiation code, where we chain `init()` to the instantiation code.

### Backbone

Let's explore the power of an instance a bit more. Take a look at example 3:

	app.hipster = new app.BackboneTweets({
	  id: "hipsterhacker",
	  el: "#content3"
	});

This creates an instance of a Constructor, just like before. If you look in `app.js`, you'll see:

	app.BackboneTweets = function(params){
	  // Defaults
	  var id = params.id || "baspete";
	  var el = params.el || $("#content1");
	  // Create a Collection
	  var hipsterTweets = new app.TwitterFeed();
	  // ... pass in the id so it knows what URL to go to
	  hipsterTweets.id = id;
	  // ... and fetch the data
	  hipsterTweets.fetch({
	    dataType:'jsonp',
	    success: function(results){
	      // Create and render a View
	      var hipsterView = new app.TweetsView({
	        collection: hipsterTweets,
	        el: el
	      }).render();
	    }
	  });
	};
	
Let's walk through what happens here:

1. We set some default values for `id` and `el`. This is just so that if we forget to pass them in with the instantiating code, our Constructor can still do something useful. You can pretty much ignore this for now.
2. We create an instance of app.TwitterFeed. This is a Backbone Collection, which is another Constructor we define a little further down.
3. We give that instance an `id` attribute. See how we operated on it **after** it was created?
4. We call that instance's `fetch` method, again **after** it was created, and pass in a success callback, which itself creates an instance of the app.TweetsView Constructor.

This is the entire point of using a Constructor in Javascript. Doing so allows you to create **instance**, which is an entirely separate object from any other instances of that Constructor. 