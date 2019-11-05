# @iosio/create-x-project

> Zero configuration cli for generating, developing and bundling modern web apps and libraries

Currently supports building @iosio/x, @iosio/x-preact, and preact apps with jsx transpiling. 
Includes conditional polyfill loading and optional multi build for legacy browsers using System es module shims.


Other features:
- jcss - minifies and autoprefixes css template tag literals.
- optional autogeneration of dynamic imports for lazyLoading pages
- file/image asset bundling
- post css loader
- live reloading dev server


## Installation
```sh
mkdir my_app
cd my_app
npx @iosio/create-x-project
```
or 
```sh
npm install -g @iosio/create-x-project
mkdir my_app
cd my_app
create-x-project
```
follow the prompts then run npm/yarn install.

## Commands

#### npm start
starts the dev server at port:3000 and watches for file changes: src > build.
(runs cli command "create-x-project start" in package.json)

#### npm run build
creates a production build for a web application: src > build.
(runs cli command "create-x-project build" in package.json)

#### npm run build_lib
creates a production library as a npm installable es module: src > lib.
(runs cli command "create-x-project build_lib" in package.json)


## Configuration (optional)
Define optional configuration JSON object in package.json as xProjectConfig, 
or as a separate file at the root of the project directory called xProjectConfig.json
```json
{ 
  "name": "my_app",
  "xProjectConfig":{
  }
} 
```
You may instead export default a configuration object from xProjectConfig.js 
at the root of the project directory
```js
export default {
    ...
}
```

### Configuration Properties
```js
export default {
    
    //js entry point
    input: /*default*/ '/src/index.js',
    
    //alternative entry point for developing demos alongside a lib
    devInput: /*default*/ '/src/index.js', //ex: '/demo/index.js',
    
    //location of index.html file. *currently this is required 
    html: /*default*/ '/index.html',
    
    //location where the dev build is placed and served from
    devOutputDir: /*default*/ '/build',
    
    //location where the production build is placed (removes and replaces dev output)
    buildOutputDir: /*default*/ '/build',
    
    //location where the library build is placed
    libOutputDir: /*default*/ '/lib',
    
    //browserlist 
    browsers: /*default*/ ['chrome 78'],
    
    //browserlist specific to css auto prefixer in case it differs from js
    cssBrowsers: /*default*/['chrome 78'],
    
    //if true, creates a legacy build that is conditionally loaded for older browsers  
    multiBuild: /*default*/ undefined,
    
    //the port that the development build is served from
    port: /*default*/ 3000,
    
    //the host that the dev build is served from
    host: /*default*/ 'localhost',
    
    //if true, will include external dependencies into the library build
    includeExternalDeps: /*default*/ undefined,
    
    //alias imported dependencies
    alias: /*default*/ undefined, //ex: 'React=preact,someModule=../../someModule',
    
    //if using any commonjs packages, pass a configuration object
    commonjsConfig: /*default*/ undefined, 
    
    //environment variables. see next section for explanation 
    APP_ENV: /*default*/ undefined
}

```

### Environment Variables
Define environment variables in the config object under APP_ENV as an object where the key represents the environment 
you are serving/building.

```js
// example:
{
    
    APP_ENV: {
        dev: {
            API_URL: 'http://app.dev.com/api',
            SOME_OTHER_ENDPOINT: 'https://someotherendpoint.com'
        },
        prod:{
            API_URL: 'http://app.prod.com/api',
            SOME_OTHER_ENDPOINT: 'https://someotherendpoint.com'
        }
    }
}
```
To apply the env variables, add the env name to the second argument on the create-x-project cli command:
```sh
create-x-project build prod
```
you may now access the env vars in your js files:
```js
fetch(process.env.API_URL + '/get-stuff');
//build prod output: 'http://app.prod.com/api/get-stuff'
```


### jcss
minify and auto prefix tagged template literals as so
```js
//no import required, just use the keyword "jcss" and the bundler will 
// remove it and process the css. 
const minified_and_autoprefixed_css_string = jcss`
    .noSelect{
        user-select: none;
    }
`;

//You may configure the target browsers on the browsers property of the config object.
//Depending on the target, the output might look something like this:
const minified_and_autoprefixed_css_string = `.noSelect{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}`;

```

### Lazy Pages (intended for @iosio/custom-elements-router)
To dynamically generate lazyMap and pathMap objects, create a lazyPages directory under your src: src/lazyPages/
```sh 
src
  |_ lazyPages
            |_ index-page.js
            |_ login-page.js 
```
in each file, default export a custom element defined as the name of the file
```js
import {x,h} from '@iosio/x';
export default x('index-page', ()=><h1>index page</h1>);
```
start the app and you should now see a file called dynamicImports.js.
 
**note**: restart the dev server when new pages are added
 
 
```sh 
src
  |_ lazyPages
            |_ dynamicImports.js
            |_ index-page.js
            |_ login-page.js 
```

exported from dynamicImports.js are configuration objects used for routing.

```js
//dynamicImports.js
export const lazyMap = {
"index-page": () => import("./index-page.js"),
"login-page": ()=> import("./login-page.js")
}

//index-page will default to "/"
//and -page is removed from all url paths 
export const pathMap = {
	"/": "index-page",
	"/login": "login-page"
}

```
import the objects and configure the @iosio/custom-elements-router


