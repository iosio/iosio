# @iosio/obi


> mini observable

## Installation 
```sh
npm install @iosio/obi --save
```

## Usage
```js

import {obi} from '@iosio/obi';

let sharedState = obi({color: 'red'});

sharedState.$onChange(() => {
    console.log('state changed')
})

sharedState.color = 'blue';

//logs: state changed

//---------

//only enumerable properties are iterated through 
Object.keys(sharedState).forEach((key)=>{
    console.log(key)
})
//logs: color 

```
### License

[MIT]

[MIT]: https://choosealicense.com/licenses/mit/
