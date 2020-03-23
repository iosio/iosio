# babel-plugin-minify-tagged-templates

> custom babel plugin for minifying tagged template strings

## Installation 

```sh
npm install babel-plugin-minify-tagged-templates --save-dev
```

## Usage

Include the following in your babel config 

```js
  "plugins":[
    "babel-plugin-minify-tagged-templates",
    
  ]
```

Babel will look for the tag 'minify' with a tagged string, minify the string and then remove the tag

```js
export const main = minify`   
        <main>
            <h1>minify me</h1>
        </main>
`;
```

Results will look something like this

```js
export const main = `<main><h1>minify me</h1></main>`;
```



