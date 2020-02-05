# @iosio/create-x-project

> Cli for generating, developing and bundling modern web apps and libraries

Awesome for building preact/react or web component libraries and apps! 

Features:
- all the rollup and babel stuff is figured out for you behind the scenes
- live reloading dev server
- optional multiBuildApp mode for legacy browsers using System es module shims.
- conditional polyfills for web apps
- file/image asset bundling
- post css loader
- minifies and autoprefixes css template tag literals with keyword 'jcss'.
- minifies tag template literals using keyword 'minify'
- multi project configurations
- ..and more


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
(x is just an alias to create-x-project command)

#### x start
starts the dev server at port:3000 and watches for file changes: src > build.

#### x build_app
creates a production build for a web application: src > build.

#### x build_lib
creates a production library as a npm installable es module: src > lib.

#### x serve_build
serves up the build


## Command line options
#### --cwd
change the current working directory
```sh
x start --cwd some/other/directory
```
#### --project
selects a override options from your configuration object

#### --app_env
Specify which envs to use in your config
```sh
x start --project demo --app_env dev
```
#### --help
List cli options



## Configuration (optional)
Define optional configuration JSON object in package.json as xProjectConfig
```json
{ 
  "name": "my_app",
  "verson": "1.0.0",
  "xProjectConfig":{
    ...
  }
} 
```
You may instead export default a configuration object from xProjectConfig.js 
at the root of the project directory
```js
// xProjectConfig.js
module.exports = {
    ...
}
```

### Configuration Properties
```js
export default {
    
    //js entry point
    // may pass an array, comma separated string or glob patter "src/*"
    input: /*default*/ '/src/index.js', 
    
    //location of index.html file. entry (input) script is automatically inserted at build time
    html: /*default*/ '/src/index.html',
    
    //location where the dev build is placed and served from
    output: /*default*/ '/build', // will output to /lib by default when the command build_lib is used
    
    //browserlist target browsers
    browsers: /*default*/ undefined, // looks for browserlist in package.json if none provided
    
    //browserlist specific to css auto prefixer in case it differs from js
    cssBrowsers: /*default*/ browsers, //uses the browsers option if none provided
    
    //if true, creates an additional legacy build that is conditionally loaded for older browsers  
    multiBuildApp: /*default*/ undefined,
    
    //set to false to disable conditional polyfills 
    polyfills: /*default*/true,

    //compresses code using terser
    compress: /*default*/ true, 
    
    // specify the output format. uses 'modern' and 'system' for multi build apps
    format: /*default*/ 'modern', // umd,es,iife... see rollup docs for more info on supported formats
    
    //jsx pragma
    jsx: /*default*/ 'h',
    //jsx pragmaFrag
    jsxFragment: /*default*/ 'Fragment',
    
    //set sourcemap to false to disable sourcemapping
    sourcemap: /*default*/ true, 
    
    //Enforce undefined global context and add "use strict"
    strict: /*default*/ undefined,
    
    //node or web
    target: /*default*/ 'web',
    
    // pass an array of files to copy from input to output
    // ex: ['node_modules/@iosio/fuse-worker/lib/fuse.worker.js', 'src/imgs/favicon.co']
    copyConfig: /*default*/ undefined, 
    
    //Replace constants with hard-coded values
    define: /*default*/ undefined, // 'API_KEY=1234,hello="asdf"'
    
    //Specify globals dependencies, or 'none'
    globals: /*default*/ undefined,

    //specify external dependencies or 'none'. 'none' bundles everything
    external: /*default*/ undefined, // pass comma separated values 'chartist,some,external,dependency' 
            
    //alias imported dependencies
    alias: /*default*/ undefined, //ex: 'react=preact/compat',

    //live reloading dev server. see https://browsersync.io/docs/options for more info.
    devServer: /*default*/ undefined, 
    /*
        {
            historyApiFallback,//(default: true) set this to false for non SPA builds
            baseDir, // uses the the primary config 'output' option
            // all other options map to browsersync config. see browsersync docs 
        }
    */   
    
    //environment variables. see next section for explanation 
    envs: /*default*/ undefined
}

```

### Environment Variables
Define environment variables in the config object under 'envs' as an object where the key represents the environment 
you are serving/building. You may use the '--app_env' flag to set this via script/command line'

```js
// example:
xProjectConfig: { 
    
    envs: {
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
To apply the env variables, add the env name to the second argument on the x cli command:
```sh
x build prod
```
you may now access the env vars in your js files:
```js
fetch(process.env.API_URL + '/get-stuff');
console.log(process.env.API_URL)
//build prod logs: 'http://app.prod.com/api/get-stuff'
```

### jcss
minify and auto prefix css tagged template literals as so
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
### minify
minify tagged template literals as so
```js
//no import required, just use the keyword "minify" and the bundler will 
// remove it and leave just the string. 
const minified_string = minify`
   <div>
        remove white space
   </div>
`;

//output
const minified_string = `<div>remove white space</div>`;
```
### project overrides
By passing and option to the flag '--project', you can override the options in the config object. 
The options under the specified project will be prioritized over the other properties.
```json
"xProjectConfig": {
    "project": {
        "demo": {
            "input": "demo/src/index.js",
            "html": "demo/src/index.html",
            "output": "demo/build"
        }
    },
    "input": "src/*"
}
```
Running the following in the command line will build an app to 'demo/build'
```sh
x build_app --project demo
```