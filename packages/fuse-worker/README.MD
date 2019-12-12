# @iosio/fuse-worker

> Delegates fuse.js fuzzy search to a worker thread.


## Installation
```sh
npm install @iosio/fuse-worker
```
Requires configuring your build system to copy the worker file from node_modules 
to the root of the build destination where the application is served from.

Copy path: 'node_modules/@iosio/fuse-worker/lib/fuse.worker.js'

(As of now, version 3.4.5 of fuse.js is bundled with the worker file)


## Usage

To create a new fuse worker, import FuseWorker and call the factory function that creates and connects to a web worker.
```js
import {FuseWorker} from '@iosio/fuse-worker';

const fuse = FuseWorker({
    workerURL: './path/to/fuse.worker.js', // defaults to './fuse.worker.js'.
    list: [], //optionally pass the list to perform the search in, or set the list using fuse.set({list}) .
    options: {}, //optionally merge options into the default fuse.js options config or use fuse.set({options}) .
})
```

**fuse options:** See https://fusejs.io/ for more info on fuse.js and the available options. The following is what 
exists as the default options.
```js
let options = {
    shouldSort: true,
    minMatchCharLength: 1,
    findAllMatches: true,
    keys: ['name'],
    maxPatternLength: 50,
    threshold: 0.4,
    distance: 1000,
    location: 0,
    ...options //any options you pass will be merged in here
};
```

**fuse.set** As stated above, the list and options on the fuse worker instance may be updated by calling fuse.set
```js

fuse.set({
    list: [...your_new_list_to_search_in],
    options: {...any_new_options}
});
```

**fuse.search** To perform a search, call fuse.search passing a string text value as the first argument and a callback 
function as the second argument.
```js
fuse.search('some value to search for', (results) => {
    console.log('the results from fuse.js', results)
});
```




