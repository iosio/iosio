# babel-plugin-minify-tagged-templates

> custom babel plugin for minifying tagged template strings

## Installation 

```sh
npm install babel-plugin-minify-tagged-templates --save-dev
```

## Usage

Include the following in your babel config, early in your plugins list. 

```js
  "plugins":[
    "babel-plugin-minify-tagged-templates",
    
  ]
```

No import necessary.

Babel will look for the tag 'minify' with a tagged string, minify the string 
and then remove the tag before processing the rest of the code.

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

If you need a mock for non babel transpiled code, you can use something like this. 
It simply returns the combined template result as a single string.

```js
function minify(strings, ...values) {
    return strings.map((string, index) => `${string}${values[index] || ''}`).join('');
}
```
