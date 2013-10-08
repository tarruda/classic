var inherits = require('inherits');
var has = require('has');


module.exports = function classic(protoSetup, superClass) {
  var constructor, protoTmp;
  
  if (typeof protoSetup === 'function') {
    protoTmp = {};
    protoSetup.call(protoTmp);
  } else {
    protoTmp = protoSetup;
  }

  constructor = protoTmp.constructor;
   
  if (!has(protoTmp, 'constructor')) {
    if (superClass) {
      constructor = function() {
        superClass.apply(this, arguments);
      };
    } else {
      constructor = function() {};
    }
  }

  delete protoTmp.constructor;

  if (superClass) {
    inherits(constructor, superClass);
  }

  for (var k in protoTmp) {
    if (!has(protoTmp, k)) continue;
    constructor.prototype[k] = protoTmp[k];
  }

  constructor.extend = function(protoSetup) {
    return classic(protoSetup, constructor);
  };

  return constructor;
};
