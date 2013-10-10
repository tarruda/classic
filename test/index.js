var assert = require('assert');

for (var k in assert) global[k] = assert[k];


var classic = require('../src');


// Using function invoked with the prototype as 'this'
var Person = classic(function() {
  this.constructor = function(firstname, lastname) {
    this.firstname = firstname;
    this.lastname = lastname;
  };

  this.name = function() {
    return this.firstname + ' ' + this.lastname;
  };
});


// Passing the prototype directly
var Actor = classic({
  constructor: function(firstname, lastname, movieCount) {
    Person.apply(this, arguments);
    this.movieCount = movieCount;
  },

  name: function() {
    return Person.prototype.name.call(this) + ', acted in ' +
      this.movieCount + ' movies';
  }
}, Person);


// Omit constructor
var Director = Actor.extend(function() {
  this.name = function() {
    return Person.prototype.name.call(this) + ', directed ' +
      this.movieCount + ' movies';
  };
});


runMocha({
  'Suite': {
    'passing function': function() {
      var p = new Person('john', 'doe');
      equal(p.name(), 'john doe');
      ok(p instanceof Person);
    },

    'passing prototype': function() {
      var a = new Actor('john', 'travolta', 42);
      equal(a.name(), 'john travolta, acted in 42 movies');
      ok(a instanceof Person);
      ok(a instanceof Actor);
    },

    'passing function inheriting constructor': function() {
      var d = new Director('quentin', 'tarantino', 42);
      equal(d.name(), 'quentin tarantino, directed 42 movies');
      ok(d instanceof Person);
      ok(d instanceof Actor);
      ok(d instanceof Director);
    }
  }
});
