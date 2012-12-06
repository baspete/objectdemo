// ###################################################################################
// APPLICATION NAMESPACE & UTILITIES
var app = {

  // Get a the tweets from a given user id
  getTweets: function(id, cb){
    var num = 5,
        url = "http://search.twitter.com/search.json?q=from%3A"
               +id
               +"&rpp="
               +num
               +"&callback=?";

    $.getJSON(url,function(response){
      cb(response);
    });
  },

  // Extract tweets from data and format them as an html list.
  // Note: twitter api returns: {response:{results:[<stuff we want>]}}
  parseTweets: function(data){
    var response = "<ul>";
    $.each(data.results, function(i,result){
      response += "<li>" + result.text + "</li>";
    })
    response += "</ul>";
    return response;
  },

  // Insert something into the DOM
  insert: function(content,el){
    el.html(content);
  }

};


// ###################################################################################
// FUNCTION EXAMPLE
// Here's an object with a single method, "get()".
// You use it by calling the method directly.
app.functionTweets = {
  get: function(params){
    // Set defaults if not provided
    params.id = params.id || "baspete",
    params.el = params.el || $("#content1");

    // Get the tweets (async XHR), then parse and render them
    app.getTweets(params.id, function(data){
      var tweets = app.parseTweets(data);
      app.insert(tweets, params.el);
    });
  }
};


// ###################################################################################
// CONSTRUCTOR EXAMPLE
// Here's an object Constructor which will return an instance of itself.
// You instantiate it by creating an object using the "new" keyword
// and then calling a method on that object.
app.ConstructorTweets = function(params){

  this.init = function(){
    // Set defaults if not provided
    this.id = params.id || "baspete";
    this.el = params.el || $("#content1");
    // Get the data and render it (note callback)
    var render = this.render,
        el = this.el;
    this.get(function(){
      render(el);
    });
  };

  // Get tweets (async XHR), parse the results, set this.tweets, and callback
  this.get = function(cb){
    app.getTweets(this.id, function(data){
      this.tweets = app.parseTweets(data);
      if(typeof(cb)!=="undefined"){
        cb();
      }
    });
  };

  // Render the tweets in this.tweets
  this.render = function(el){
    app.insert(this.tweets, el);
  };

};


// ###################################################################################
// BACKBONE EXAMPLE
// Backbone is a little more comlicated.
// We start with an application Constructor, which
// creates a Collection and View when instantiated.
app.BackboneTweets = function(params){
  // Defaults
  var id = params.id || "baspete";
  var el = params.el || $("#content1");
  // Create a Collection
  var tweets = new app.TwitterFeed();
  // ... pass in the id so it knows what URL to go to
  tweets.id = id;
  // ... and fetch the data
  tweets.fetch({
    dataType:'jsonp',
    success: function(results){
      // Create and render a View
      var tweetsView = new app.TweetsView({
        collection: tweets,
        el: el
      }).render();
    }
  });
};

// A Collection is responsible for fetching things from a service
// and parsing the data that comes back. It's a type of Constructor.
app.TwitterFeed = Backbone.Collection.extend({
  // url: "http://search.twitter.com/search.json?q=from:circupon&rpp=3&include_entities=true&callback=",
  url: function(){
    var num = 5,
        url = "http://search.twitter.com/search.json?q=from%3A"
               +this.id
               +"&rpp="
               +num
               +"&callback=?";
    return url;
  },
  parse: function(response){
    return response.results;  // twitter api returns {response:{results:[<stuff we want>]}}
  }
});

// A View is responsible for rendering data to the DOM.
app.TweetsView = Backbone.View.extend({
  render: function(){
    var el = $(this.el);
        tweets = this.collection.toJSON();

    // Note, for a real app we'd create this markup using
    // a JS templating syatem like hogan.js.
    var markup = "<ul>";
    $.each(tweets, function(i,tweet){
      markup += "<li>" + tweet.text + "</li>";
    })
    markup += "</ul>";
    el.html(markup);
  }
});
