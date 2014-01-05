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
  const a = yield async(5,seed);
  const b = yield async(5,a*2);
  return async(5,b*2);
}
describe('degent',function(){
  it('should work',function(){
    return degent(asyncThing,2).should.become(8);
  })
});