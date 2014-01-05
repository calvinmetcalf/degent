degent
===

```bash
npm install degent
```

Takes a generator function and returns a promise for its return value, any yields in the generator are assumed to be promises and the resolved value is passed back in, in other words

```javascript
// simply returns a function with a promise which resolves to the value
// passed in after some time.
function async(wait,value){
  return new Promise(function(fulfill){
    setTimeout(function(){yes(value)},wait);
  });
}

degent(function*(){
  var a = yield async(5,5);
  var b = yield async(5,a*5);
  return async(5,b*5);
}).then(function(result){
  console.log(result);
  //prints 125;
});
``` 

requires --harmony flag, also you can pass additional arguments to degent which are passed along to the generator function.