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
var asyncThing = function*(seed){
  if(!seed){
    throw new Error('need a seed');
  }
  const a = yield async(5,seed);
  const b = yield async(5,a*2);
  return async(5,b*2);
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
});