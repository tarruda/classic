for (var k in require('assert')) global[k] = assert[k];


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
      expect(p.name()).to.eql('john doe');
      expect(p).to.be.instanceOf(Person);
    },

    'passing prototype': function() {
      var a = new Actor('john', 'travolta', 42);
      expect(a.name()).to.eql('john travolta, acted in 42 movies');
      expect(a).to.be.instanceOf(Person);
      expect(a).to.be.instanceOf(Actor);
    },

    'passing function inheriting constructor': function() {
      var d = new Director('quentin', 'tarantino', 42);
      expect(d.name()).to.eql('quentin tarantino, directed 42 movies');
      expect(d).to.be.instanceOf(Person);
      expect(d).to.be.instanceOf(Actor);
      expect(d).to.be.instanceOf(Director);
    }
  }
});
