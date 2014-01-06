require("mocha-as-promised")();
var chai = require("chai");
var should = chai.should();
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var Promise = require('lie');
var degent = require('../');
function async(num,value){
  return new Promise(function(yes,no){
    setTimeout(function(){yes(value)},num);
  });
}
function thunk(num,value){
  return function(done){
    setTimeout(function(){
      if(value){
        done(null,value);
      }else{
        done('need a value');
      }
    },num);
  };
}
var asyncThing = function*(seed){
  if(!seed){
    throw new Error('need a seed');
  }
  const a = yield async(5,seed);
  const b = yield async(5,a*2);
  return async(5,b*2);
}
var asyncThunk = function*(seed){
  const a = yield thunk(5,seed);
  const b = yield thunk(5,a*2);
  return thunk(5,b*2);
}
describe('degent',function(){
  it('should work',function(){
    return degent(asyncThing,2).should.become(8);
  });
  it('should fail well',function(){
    return degent(asyncThing).should.be.rejected;
  });
  it('should handle no yields',function(){
    return degent(function*(){
      return async(5,9)
    }).should.become(9);
  });
  it('should handle non promise yield',function(){
    return degent(function*(){
      const a = yield 8;
      return a + 1;
    }).should.become(9);
  });
  it('should work with a thunk',function(){
    return degent(asyncThunk,2).should.become(8);
  });
  it('should fail well with a thunk',function(){
    return degent(asyncThunk).should.be.rejected;
  });
  it('should handle no yields and a thunk',function(){
    return degent(function*(){
      return thunk(5,9)
    }).should.become(9);
  });
});