# @iosio/obi

> mini observable object

Obi extends the functionality of objects to provide change detection.


The goal of this module is to provide a straight forward and interoperable option for state management without the bloat. 
This module aims to provide a minimal and focused approach with the least amount of magic behind the scenes.

## Installation 
```sh
npm install @iosio/obi --save
```

## Usage
To create state who's properties you want to observe, pass an object to obi and store the returned value to a variable.
This adds non enumerable properties to the object, and its nested objects, which can be used to subscribe to changes.
```js
import {obi} from '@iosio/obi';

let $state = obi({
    foo: 'bar',
    arr: ['a', 'b', 'c'],
    $i: 'will not trigger update when i change', 
    some: {
        nested: 'value',
        other: 'nested value'
    },
});
```
#### Root level changes
$onChange is a property that exists on all objects nested within the state tree.
To subscribe to changes on the root properties of an object, pass a callback to $onChange. 
```js
const unsubscribe = $state.$onChange((state, paths) => {
    console.log('state changed: ', paths)
});
$state.foo = 'baz';
//logs: state changed: ['foo']
$state.some.nested = '*'; // does not trigger callback - see: Nested object property changes
//unsubscribe() //option to cancel subscription
```

#### Nested object property changes
To subscribe to a specific object layer within a state tree, utilize its dedicated $onChange property.
```js
$state.some.$onChange((state, paths) => {
    console.log('state changed: ', paths)
});
$state.some.nested = 'update';
//logs: state changed: ['some.nested']
$state.foo = 'hello';
//value is updated but does not trigger change on the 'some' branch
```
To subscribe to changes on values nested any layer deep within the state tree, pass a callback to $onAnyChange.
```js
$state.$onAnyChange((state, paths) => {
    console.log('state changed: ', paths)
});
// *note* destructuring works here because the 'nested' property is still dot-walked out to.
// see 'Notes to be mindfu'l of section
let {some} = $state;
some.nested = 'newValue'; 
//logs: state changed: ['some.nested']
```
#### Selecting specific properties to detect changes on
Import select and pass the obi object to the first argument. In the second argument, pass an array containing 
string values that represent the property paths you want to be notified about, 'dot-walking' out to any nested value 
if need be;
```js
import {select} from '@iosio/obi';

const watchNested = select($state, ['foo','some.nested']);

watchNested.$onChange((state, paths) => {
    console.log('state changed: ', paths)
});
$state.foo = 'bang';
//logs: state changed: ['foo']
$state.some.nested = 'only I shall trigger the update!'; 
//logs: state changed: ['some.nested']
```

#### Batching multiple updates at once
In addition to the available $onChange property, $merge also exists as a non enumerable property that allows for 
batching multiple updates.  
```js
$state.some.$onChange((state, paths) => {
    console.log('state changed: ', paths)
});
//pass an object to merge into the nested branch
$state.some.$merge({
    nested: 'updated',
    other: 'updated'
});
//will only trigger one update
//logs: state changed: ['some.nested', 'some.other']
//or a function to perform any operations with a single subsequent update trigger
$state.some.$merge(() => {
    $state.some.nested = 'updated again';
    $state.some.other = 'updated again';
});
//will only trigger one update
//logs: state changed: ['some.nested', 'some.other']
```


#### Notes to be mindful of
In order to ensure the callback is triggered, you must 'dot-walk' out at least once to the property when making assignments.
```js
//DON'T DO THIS
// destructuring to a single property will *not trigger the $onChange callback when assigning a new value.
let {foo} = $state; 
foo = 'baz'; // value is updated but no callback triggered;

//DO THIS 
$state.foo = 'baz'; // will trigger change detection
```

Updating arrays 
```js
$state.arr.push('d'); // mutations on arrays will not trigger updates
$state.arr = [...$state.arr]; //use the spread operator to trigger the update.
```

Properties that begin with '$' will not trigger change callbacks when updated.
```js
$state.$i = 'updated';
//value is updated but does not trigger change callback.
```

Functions may be included on the state object.
```js
let $state = obi({
    foo: 'bar',
    getSetFoo: () =>{
        api.getFoo().then(data=>{
            $state.foo = data
        })
    }
});
```

Call $getState to retrieve the object state as a whole (for example: console logging or form submission purposes) 
while excluding any non stateful properties like functions.  
```js
console.log($state.$getState());
/*
    logs: 
{
    foo: 'bar',
    arr: ['a', 'b', 'c'],
    $i: 'will not trigger update when i change', 
    some: {
        nested: 'value',
        other: 'nested value'
    },
}
*/
```

#### Under the hood
Obi uses Object.defineProperty over Proxy for a few reasons. Given that Proxy provides suitable functionality, 
there are still some small nuances that exist with it that end up not setting its benefits far apart from what 
Object.defineProperty provides when utilizing it solely for detecting object property changes. Not to mention 
there is only a partial polyfill for Proxy that does not cover all bases for legacy browsers. 
   
#### TODO
- add tests

### License

[MIT]

[MIT]: https://choosealicense.com/licenses/mit/
