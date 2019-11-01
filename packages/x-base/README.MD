# @iosio/x-base


> for creating @iosio/x and @iosio/x-preact


```js
import {h, render} from "preact";
import {setProperty} from "@iosio/xact";

import {createBase} from "@iosio/x-base";


const {x} = createBase({h, render, setProperty});

const App = x('test-element', ({Host, CSS})=>(
    <Host>
        <CSS/>

        <h1>test element</h1>
    </Host>
));


render(<App/>, document.body)

```

### License

[MIT]

[MIT]: https://choosealicense.com/licenses/mit/
