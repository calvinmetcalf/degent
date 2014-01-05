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
  const gen = oGen.apply(undefined, params);
  return new Promise(function(fulfill, reject){
    function checkDone(iter){
      if(iter.done){
        fulfill(iter.value);
      }else{
        return iter.value;
      }
    };
    function nextStep(iter){
      const next = checkDone(gen.next(iter));
      if(next){
        return next.then(nextStep);
      }
    };
    const deal = checkDone(gen.next());
    if(deal){
      deal.then(nextStep).then(null,reject);
    }
  });
};