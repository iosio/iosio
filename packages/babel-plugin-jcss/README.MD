# babel-plugin-jcss

> custom babel plugin for template string css autoprefixing and minifying

## Installation 

```sh
npm install babel-plugin-jcss --save-dev
```

## Usage

Include the following in your babel config, early in your plugins list. 

```js
  "plugins":[
    "@iosio/babel-plugin-jcss",
  ]
```
No import necessary 

Babel will look for the tag 'jcss' with a tagged string, run the post css, minify the string and remove the tag 
before processing the rest of the code.

```js
export const styles = jcss`   
        :host{
            display:flex;
            align-items:center;
            user-select:none;
        }
`;
```

Results will look something like this

```js
export const styles = `:host{display:flex;align-items:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}`;
```

If you need a mock for non babel transpiled code, you can use something like this. 
It simply returns the combined template result as a single string.

```js
function jcss(strings, ...values) {
    return strings.map((string, index) => `${string}${values[index] || ''}`).join('');
}
```



