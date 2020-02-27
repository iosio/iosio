# @iosio/elemental

> composable web component mixins, base classes and utilities.


## Installation
```sh 
npm install @iosio/elemental
```
## Features
This module provides a collection of utilities frequently used when rolling your own web components, 
such as mixin-like plugins that add functionality to your component without having to extend super classes 
or bundling large libraries.

The following are a few consumables that are ready to go. 
Compose them together or create your own using the composer function.
(See the source files for more goods!)

## Plugins

#### Plugin Usage
import composer and the plugin and wrap your  and read the docs on what methods are available  
```js
import {composer, somePlugin, someOtherPlugin } from '@iosio/elemental';

const UpgradedElement = composer(somePlugin, someOtherPlugin);
class Upgraded extends UpgradedElement(HTMLElement){}
//or
const Element = composer(somePlugin, someOtherPlugin)(HTMLElement);
customElements.define('upgraded-element', class extends Element{})
//or
class Upgrade extends composer(somePlugin, someOtherPlugin)(HTMLElement){}
//...
```

### reactiveProps
The reactive props plugin adds propType checking and conversion, 
```js
import {reactiveProps, composer} from '@iosio/elemental';


```

