/* This is my attempt to recreate some of the functions found in underscore.js
library in order to practice and familiarize myself with these useful
functions. Start at line 54 to see my implementations!*/

// Baseline setup
// --------------

// Establish the root object, `window` in the browser, or `exports` on the server.
var root = this;

// Save the previous value of the `_` variable.
var previousUnderscore = root._;

// Save bytes in the minified (but not gzipped) version:
var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

// Create quick reference variables for speed access to core prototypes.
var
  push             = ArrayProto.push,
  slice            = ArrayProto.slice,
  toString         = ObjProto.toString,
  hasOwnProperty   = ObjProto.hasOwnProperty;

// All **ECMAScript 5** native function implementations that we hope to use
// are declared here.
var
  nativeIsArray      = Array.isArray,
  nativeKeys         = Object.keys,
  nativeBind         = FuncProto.bind,
  nativeCreate       = Object.create;

// Naked function reference for surrogate-prototype-swapping.
var Ctor = function(){};

// Create a safe reference to the Underscore object for use below.
var _ = function(obj) {
  if (obj instanceof _) return obj;
  if (!(this instanceof _)) return new _(obj);
  this._wrapped = obj;
};

// Export the Underscore object for **Node.js**, with
// backwards-compatibility for the old `require()` API. If we're in
// the browser, add `_` as a global object.
if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = _;
  }
  exports._ = _;
} else {
  root._ = _;
}

//Begin my implementations

//Collections

//_.each or forEach
/*iterates over a list of elements, yielding in turn to an
iteratee function. Each invocation of iteratee is called with three arguments:
(element, index, list). If list is a JavaScript object, iteratee's arguments
will be (value, key, list). Returns the list for chaining. */

_.each = function(list, iteratee){
  if (Array.isArray(list)){
    for (var index = 0; index < list.length; index++){
      iteratee(list[index], index, list);
    }
  //  return list;
  }
  else if (list.constructor === Object){
    for (var key in list){
      iteratee(list[key],key,list);
    }
  //  return list;
  }
}

//test examples
var arrayEach = [3, 6, "Hi", 10];
var listEach = {a: 3, b: "Hi", 'three': {}};

_.each(arrayEach, function(element){alert(element);});
_.each(listEach, function(element){alert(element);});

//_.map or collect
/* Produces a new array of values by mapping each value in list through a
transformation function (iteratee). The iteratee is passed three arguments: the
value, then the index (or key) of the iteration, and finally a reference to the
entire list.*/

//with loop
_.map = function(list, iteratee){
  var mappedArray = [];
  if (Array.isArray(list)){
    for (var index = 0; index < list.length; index++){
      mappedArray.push(iteratee(list[index],index, list));
    }
    return mappedArray;
  }
  else if (list.constructor === Object){
    for (var key in list){
      mappedArray.push(iteratee(list[key],key,list));
    }
    return mappedArray;
  }
}

//functional

//declare a new array called mappedArray and set it empty intially
//call _.each(list, function(*that maps))
//anonymous function will take an element (each element of the array via each) and perform an iteratee function, pushing the result to mappedArray

_.map = function(list, iteratee){
  var mappedArray = [];
  _.each(list, function(element){
    mappedArray.push(iteratee(element));
  });
  return mappedArray;
}

//test examples
var arrayMap = [{person: 'Jack', number: 1}, {person: 'Joe', number:2}];
var listMap = {Jack: {number:1,color:'blue'}, Joe: {number:2, color: 'green'}};

console.log(_.map(arrayMap, function(element){return element.number;})); //[1,2]
console.log(_.map(listMap, function(element){return element.color;})); //['blue','green']

//_.reduce or inject or foldl
/*Also known as inject and foldl, reduce boils down a list of values into a single
value. Memo is the initial state of the reduction, and each successive step of
it should be returned by iteratee. The iteratee is passed four arguments: the
memo, then the value and index (or key) of the iteration, and finally a reference
to the entire list.

If no memo is passed to the initial invocation of reduce, the iteratee is not
invoked on the first element of the list. The first element is instead passed as
the memo in the invocation of the iteratee on the next element in the list.*/

_.reduce = function(list, iteratee, memo){
  _.each(list, function(element, index, list){
    if(memo === undefined){
      memo = element;
    }
    else{
      memo = iteratee(memo, element);
    }
  });
  return memo;
}

function reduce(collection, callback, startVal){
  each(collection, function(element){
    if(startVal === undefined){
      startVal = element;
    } else{
      startVal = callback(startVal, element);
    }
  });
  return startVal;
}
//if memo is undefined, store true in a new variable memoStatus
//invoke _.each function passing in list and an anonymous function (element, index, list)
//check to see if memoStatus is true
//if true, set memoStatus to false, and assign element to memo
//if memoStatus false, memo = iteratee(memo, element)

var arrayReduce = [4,5,6,7];
var listReduce = {a: 5, b: 7, c:-4};

console.log(reduce(arrayReduce, function(a,b){return a - b ;}));
// -> 22
console.log(reduce(listReduce, function(a,b){return a+b;}));
// -> 8

/*find
_.find(list, predicate, [context]) Alias: detect
Looks through each value in the list, returning the first one that passes a
truth test (predicate), or undefined if no value passes the test. The function
returns as soon as it finds an acceptable element, and doesn't traverse the
entire list.*/

//Using loop method
_.find = function(list, predicate){
  if (Array.isArray(list)){
    for (var i = 0; i < list.length; i++){
      if (predicate(list[i]) === true){
        return list[i];
      }
    }
    return undefined;
  }
  else if (list.constructor === Object){
    for (var key in list){
      if (predicate(list[key]) === true){
        return list[key];
      }
    }
    return undefined;
  }
}

//Using functional programming (****Bad solution - it works but iterates through entire collection)
_.find = function(collection, predicate){
  //use _.each(collection, function(element))
  //function(element) performs predicate(element) -> if true, then break and return element
  //else if all looped through, return undefined
  var truth;
  _.each(collection, function(element){
    if(predicate(element) && truth === undefined){
      truth = element;
    }
  });
  return truth;
}

//test cases
var even = _.find([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
console.log(even);
var seven = _.find([1, 2, 3, 4, 5, 6], function(num){ return num ===7; });
console.log(seven);
//check if object of array
//if array, loop through elements. If predicate(array[element]) === true, return array[element]
//else keep looping. If loop finishes with no return, then return undefined.
//if object, same deal

/*filter
_.filter(list, predicate, [context]) Alias: select
Looks through each value in the list, returning an array of all the values that
 pass a truth test (predicate).*/

 //looping solution
 //define new array to pass filtered values to
 //check if object or array
 //loop through either object or array, and perform predicate on each element, passing the elements that return true to the new array

 _.filter = function(list, predicate){
   var filtered = [];
   if (Array.isArray(list)){
     for (var i = 0; i < list.length; i++){
       if (predicate(list[i]) === true){
         filtered.push((list[i]));
       }
     }
     return filtered;
   }
   else if (list.constructor === Object){
     for (var key in list){
       if (predicate(list[key])===true){
         filtered.push(list[key]);
       }
     }
     return filtered;
   }
 }

 //functional programming solution

 //define new array
 //call each passing in list and an anonymous function that performs the filtering
 //after each concludes, return new array

 _.filter = function(list, predicate){
   var filtered = [];
   _.each(list, function(element){
     if (predicate(element) === true){
       filtered.push(element);
     }
   });
   return filtered;
 }

 //test cases
 var evens = _.filter([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
 var odds = _.filter({num1: 3, num2: 6, num3: 9}, function(num){ return num % 2 !== 0; });
 console.log(evens);
 console.log(odds);

/*where
_.where(list, properties)
Looks through each value in the list, returning an array of all the values
that contain all of the key-value pairs listed in properties.*/

//separate properties by using for in loop
//check the arguments to gather how many properties are passed
//loop through the properties...
//loop through the list checking if property exists at an element, we push that element to a new array
//this loops through every property passed eventually 'filtering' out all elements that don't have the specified properties

/*_.where = function(list, properties){
  var where = [];
  var propertiesArray = [];
  var propertyValue = [];
  for (var prop in arguments[1]){
    propertiesArray.push(prop);
    propertyValue.push(arguments[1][prop]);
  };
  for(var i = 0; i <list.length; i++){
    for (var j = 0; j < propertiesArray.length; j++){
            if ((propertiesArray[j] in list[i]) && (list[propertiesArray[j]] === propertyValue[j])){
              where.push(list[i]);
            }
          }
        }
        return where;

}

//test cases
console.log(_.where([{a: 'Lion', b: 'Tiger', c: 'Bear'}, {a:'Lion', b: 'Monkey', d: 'Bear'}], {a: 'Lion', c: 'Bear'}));*/

/*reject
_.reject(list, predicate, [context])
Returns the values in list without the elements that the truth test (predicate)
passes. The opposite of filter.*/

_.reject = function(list, predicate){
  //create a new array to pass the rejects into
  var rejectArray = [];
  //call _.each() passing in -> list, funtion(element)
  //this function(element) will perform the predicate function on each element and push the false results to the new array
  _.each(list, function(element){
    if (predicate(element) === false){
      rejectArray.push(element);
    }
  });
  return rejectArray;
}

var evens = _.reject([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
var odds = _.reject({num1: 3, num2: 6, num3: 9}, function(num){ return num % 2 !== 0; });
console.log(evens); // -> [1,3,5]
console.log(odds);// -> [6]

/*every
_.every(list, [predicate], [context]) Alias: all
Returns true if all of the values in the list pass the predicate truth test.*/

_.every = function (list, predicate){
  //check if object of array
  if (list.contructor === Array){
    for (var i = 0; i <array.length; i++){
      if (prediate(array[i])===false){
        return false;
      }
    }
    return true;
  }
  else if (list.constructor === Object){
    for(var key in list){
      if(predicate(list[key]) === false){
        return false;
      }
    }
    return true;
  }
  //if array, loop through array, if any prediate(list element) === false) -> return false
  //if object, loop through object, if any predicate(list[key]) === false -> return false
  //otherwise return true after loop concludes
}

/*invoke
_.invoke(list, methodName, *arguments)
Calls the method named by methodName on each value in the list. Any extra
arguments passed to invoke will be forwarded on to the method invocation.*/

/*_.invoke = function( list, methodName){
  //use _.map to loop through list -> pass list and function(element)
  //function(element) will perform methodName on each element
  var invoked = _.map(list, function(element){
    return element[methodName]();
  });
  return invoked;
}

//test cases
console.log(_.invoke([[5, 1, 7], [3, 2, 1]], 'sort'));*/
//-> [[1, 5, 7], [1, 2, 3]]

/*pluck
_.pluck(list, propertyName)
A convenient version of what is perhaps the most common use-case for map:
extracting a list of property values.*/

_.pluck = function(list, propertyName){
  //var plucked = _.map()
  //use _.map() -> pass in list and function(element)
  //function(element) will access the value at propertyName
  //_.map() will push the values of propertyName for each element
  //return plucked

  var plucked = _.map(list, function(element){
    return element[propertyName];
  });
  return plucked;
}

//test cases
var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
console.log(_.pluck(stooges, 'name'));
//=> ["moe", "larry", "curly"]

/*max_.max(list, [iteratee], [context])
Returns the maximum value in list. If an iteratee function is provided, it will
 be used on each value to generate the criterion by which the value is ranked.
 -Infinity is returned if list is empty, so an isEmpty guard may be required.*/

_.max = function(list, iteratee){
  //declare variable maxValue === null
  var maxValue;
  if (list.constructor === Array){
    maxValue = list[0];
    for (var i = 1; i < list.length; i++){
      if(iteratee(list[i]) > iteratee(maxValue)){
        maxValue = list[i];
      }
    }
  }
  else if (list.constructor === Object){
    var keyArray = Object.keys(list);
    maxValue = keyArray[0];
    for (var i = 1; i < keyArray.length; i++){
      if (iteratee(keyArray[i]) > iteratee(maxValue)){
        maxValue = keyArray[i];
      }
    }
  }
  return maxValue;
  //check if array or object
  //loop through either array or object and perform iteratee at each element
  //if iteratee(element) > maxValue then maxValue = iteratee(element)
}

//test cases

var stooges = [{name: 'moe', age: 20}, {name: 'larry', age: 40}, {name: 'curly', age: 30}];
console.log(_.max(stooges, function(stooge){ return stooge.age; }));
//-> {name: 'curly', age: 40}
var modArray = [22, 5, 10, 2, 23];
console.log(_.max(modArray, function(element){return element % 5}));
// -> 8

/*groupBy
_.groupBy(list, iteratee, [context])
Splits a collection into sets, grouped by the result of running each value
through iteratee. If iteratee is a string instead of a function, groups by the
property named by iteratee on each of the values.*/

_.groupBy = function(list, iteratee){
  //declare a new object to add groups to
  //loop through each element in the list and determine what group it belongs to determined by iteratee
  //use _.each() passing in list and function(element)
  //function(element) declare a group variable and set it equal to iteratee(element)
  //if the group variable exists in the object, then we push the element to object[group]
  //if it doesn't exist, we create a new property on object named 'group' and set it equal to [element]

  var grouped = {};
  _.each(list, function(element){
    var group = iteratee(element)
    if (grouped.hasOwnProperty(group)){
      grouped[group].push(element);
    }
    else{
      grouped[group] = [element]
    }
  });
  return grouped;
}




//Arrays

/*first
_.first(array, [n]) Alias: head, take
Returns the first element of an array. Passing n will return the first n
elements of the array.*/

//if n is in undefined then return the first element of the array
//else, loop through the array and push n elements to a new array and return it

_.first = function(array, n){
  var firstArray = [];
  if (typeof n === 'undefined'){
    return array[0];
  }
  else {
    for (var i = 0; i < n; i++){
      firstArray.push(array[i]);
    }
    return firstArray;
  }
}

//test examples
console.log(_.first([1,2,3,4,5]));
// -> 1
console.log(_.first([1,2,3,4,5], 3));
// -> [1,2,3]

/*initial
_.initial(array, [n])
Returns everything but the last entry of the array. Especially useful on the
arguments object. Pass n to exclude the last n elements from the result.*/

//if n is undefined, loop though the array and push elements to a new array, excluding the last entry of the array
//else, loop through the array and push elements to a new array, excluding the last n elements

_.initial = function(array, n){
  var initialArray = [];
  if (typeof n === 'undefined'){
    for (var i = 0; i < array.length - 1; i++){
      initialArray.push(array[i]);
    }
    return initialArray;
  }
  else {
    for (var i = 0; i < array.length - n; i++){
      initialArray.push(array[i]);
    }
    return initialArray;
  }
}

//test examples
console.log(_.initial([5,4,3,2,1]));
// -> [5,4,3,2]
console.log(_.initial([5,4,3,2,1],3));
// -> [5,4]

/*last
_.last(array, [n])
Returns the last element of an array. Passing n will return the last n elements of the array.*/

//if n is undefined return the last element of the array passed
// else loop through array passed, and unshift to a new array with last n values. Return the new array

_.last = function(array, n){
  var lastArray = [];
  if (typeof n === 'undefined'){
    return array[array.length-1];
  }
  else{
    for (var i = array.length - 1; i >= array.length - n; i--){
      lastArray.unshift(array[i]);
    }
    return lastArray;
  }
}

//test examples
console.log(_.last([5,4,3,2,1]));
// -> 1
console.log(_.last([5,4,3,2,1], 3));
// -> [3,2,1]

/*rest
_.rest(array, [index]) Alias: tail, drop
Returns the rest of the elements in an array. Pass an index to return the values
 of the array from that index onward.*/

 //if n is undefined, loop through the array push elements to a new array excluding the element at the first index
 //else loop through the array and push elements to a new array starting at the n index

 _.rest = function(array, n){
   var restArray = [];
   if (typeof n === 'undefined'){
     for (var i = 1; i < array.length; i++){
       restArray.push(array[i]);
     }
     return restArray;
   }
   else{
     for (var i = n; i < array.length; i++){
       restArray.push(array[i]);
     }
     return restArray;
   }
 }

 //test examples
 console.log(_.rest([5,4,3,2,1]));
 // -> [4,3,2,1]
 console.log(_.rest([5,4,3,2,1], 3));
 // -> [2,1]

/*compact
_.compact(array)
Returns a copy of the array with all falsy values removed. In
JavaScript, false, null, 0, "", undefined and NaN are all falsy.*/

//loop through the array and push values to a new array that pass an if statement

_.compact = function(array){
  var compactArray = [];
  for(var i = 0; i < array.length; i++){
    if (array[i] !== false && array[i] !== null && array[i] !== 0 && array[i] !== '' && array[i] !== undefined && isNaN(array[i]) === false){
      compactArray.push(array[i]);
    }
  }
  return compactArray;
}

//test examples
console.log(_.compact([0, 1, false, 2, '', NaN, 3]));
// -> [1,2,3]

/*flatten
_.flatten(array, [shallow])
Flattens a nested array (the nesting can be to any depth). If you pass shallow,
the array will only be flattened a single level. (NOTE shallow is not included in
this implmentation)*/

//define a new empty array
// define a function that loops through an array. For each element  check to see if array
//if not array, then push that element to the new array
//if the element is an array, use recursion to go through the function again passing in the element (arrays[i]) as the array argument
//return the function with the array passed as a paramter to flatten
//return the new array

_.flatten= function(array){
  var flattenArray = [];
  function flattenRecursion(arrays){
    for(var i = 0; i < arrays.length; i++){
      if (Array.isArray(arrays[i])===false){
      flattenArray.push(arrays[i]);
      }
      else{
        flattenRecursion(arrays[i]);
      }
    }
  }
  flattenRecursion(array);
  return flattenArray;
}

//test examples
console.log(_.flatten([1, [2], [3, [[4]]]]););
// -> [1,2,3]

/*without
_.without(array, *values)
Returns a copy of the array with all instances of the values removed.*/

//check arguments.length and store that value to a new variable
//loop through array and check if each element matches the arguments passed (loop for each arguement?)
//if there is a match then array = array.splice(array[i],1) (ended up using delete array[j] instead)
// [1,2,3,2,5]
_.without = function(array, values){
  for (var i = 1; i < arguments.length; i++){
    for(var j = 0; j < array.length; j++){
      if (array[j] === arguments[i]){
        delete array[j]; //retry using splice instead (not working...might try to loop backwards through the array instead)
      }
    }
  }
  var newArray = [];
  for (var k = 0; k < array.length; k++){
    if (array[k] !== undefined){
      newArray.push(array[k]);
    }
  }
  return newArray;
}

//test examples
console.log(_.without([1, 2, 1, 0, 3, 1, 4], 0, 1););
// -> [2,3,4]

/*union
_.union(*arrays)
Computes the union of the passed-in arrays: the list of unique items, in order,
 that are present in one or more of the arrays.*/

 //define new empty array
 //concatenate every array that is passed by looping through arguments.length and return new array
 //loop through the entire new array. For each element, i
 //loop through entire array (from the end) and remove(splice) any element, j that shares a value with i making sure to not remove i

 _.union = function(array){
   var arrayCon = [];
   var newArray = [];
   for(var arg = 0; arg <arguments.length; arg++){
     arrayCon = arrayCon.concat(arguments[arg]);
   }
   for (var i = 0; i < arrayCon.length; i++){
     for(var j = 0; j < arrayCon.length; j++){
       if (arrayCon[j] === arrayCon[i] && j !== i ){
         delete arrayCon[j];
       }
     }
   }
   for (var k = 0; k < arrayCon.length; k++){
     if(arrayCon[k] !== undefined){
       newArray.push(arrayCon[k]);
     }
   }
   return newArray;
 }

//test examples
console.log(_.union([1, 2, 3], [101, 2, 1, 10], [2, 1]));
// => [1, 2, 3, 101, 10])

/*range
_.range([start], stop, [step])
A function to create flexibly-numbered lists of integers, handy for each and
map loops. start, if omitted, defaults to 0; step defaults to 1. Returns a list
 of integers from start (inclusive) to stop (exclusive), incremented
 (or decremented) by step, exclusive. Note that ranges that stop before
 they start are considered to be zero-length instead of negative — if you'd
 like a negative range, use a negative step.*/

 //only the stop is given
 //start and stop are given
 //start, stop and step are given
 _.range = function(start, stop, step){
 //declare array
 var rangeArray = [];
 //check length of arguements
 if (arguments.length === 1){
   stop = arguments[0];
   for(var i = 0; i < stop; i++){
     rangeArray.push(i);
   }
 }
 else if(arguments.length === 2){
   for(var i = start; i < stop; i++){
     rangeArray.push(i);
   }
 }
 else if (arguments.length === 3){
   if(step > 0){
   for(var i = start; i < stop; i += step){
     rangeArray.push(i);
   }
 }
  else if(step < 0){
    for(var i = start; i > stop; i+= step){
      rangeArray.push(i);
    }
  }
 }
 return rangeArray;
 }

 console.log(_.range(10));
//=> [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
console.log(_.range(1, 11));
//=> [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
console.log(_.range(0, 30, 5));
//=> [0, 5, 10, 15, 20, 25]
console.log(_.range(0, -10, -1));
//=> [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
console.log(_.range(0));
 //if arguments length = 1
 //loop over the 'length of stop' non inclusive and push values to a new array incrementing by 1
 //if arguments length = 2 arguments[0] =start, stop = arguments[1]
 //loop over the length from start to stop incrementing by 1 (stop noninclusive)
 //if arguments length = 3 arguments[2] === step
 //loop over the length from start to stop, incrementing step