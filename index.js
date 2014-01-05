"use strict";

const Promise = require('lie');

module.exports = function(oGen){
  const params = [];
  if(arguments.length>1){
    let i = 1;
    const len = arguments.length;
    while(i<len){
      params.push(arguments[i++]);
    }
  }
  return new Promise(function(fulfill, reject){
    const gen = oGen.apply(undefined, params);
    function nextStep(iter){
      const next = checkDone(gen.next(iter),fulfill);
      if(next){
        return next.then(nextStep);
      }
    };
    const done = checkDone(gen.next(),fulfill);
    if(done){
      done.then(nextStep).then(null,reject);
    }
  });
};
function checkDone(iter, fulfill){
  if(iter.done){
    fulfill(iter.value);
  }else if (iter.value && iter.value.then){
    return iter.value;
  }else{
    return new Promise(function(yes){
      yes(iter.value);
    });
  }
};