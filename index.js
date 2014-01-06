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
      const next = checkDone(gen.next(iter),fulfill,reject);
      if(next){
        return next.then(nextStep);
      }
    };
    const done = checkDone(gen.next(),fulfill,reject);
    if(done){
      done.then(nextStep).then(null,reject);
    }
  });
};
function checkDone(iter, fulfill, reject){
  if(iter.done){
    if(iter.value&&iter.value.then){
      fulfill(iter.value);
    }else if(typeof iter.value === 'function'){
      iter.value(function(err,data){
        if(err){
          reject(err);
        }else{
          fulfill(data);
        }
      });
    }else{
      fulfill(iter.value);
    }
  }else if (iter.value && iter.value.then){
    return iter.value;
  }else{
    return new Promise(function(yes, no){
      if(typeof iter.value === 'function'){
        iter.value(function(err,data){
          if(err){
            no(err);
          }else{
            yes(data)
          }
        })
      }else{
        yes(iter.value);
      }
    });
  }
};