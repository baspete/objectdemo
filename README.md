objectdemo
==========

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

