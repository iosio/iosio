# @iosio/babel-plugin-jcss

<img src="https://img.shields.io/npm/v/@iosio/babel-plugin-jcss.svg?style=flat-square"/>

> custom babel plugin for template string css autoprefixing and minifying

## Installation 

```sh
npm install babel-plugin-jcss --save-dev
```
## Usage

Include the following in your babelrc or babel.config.js file

```js
module.exports = {
  "plugins":[
    [
        "@iosio/babel-plugin-jcss",
         {
             "browsers": ["last 2 versions"], //overrides
             "postCssOptions":  {}
         }
     ]
  ]
};
```

Babel will look for the tag 'jcss' with a tagged string, run the post css and minifying and remove the tag

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

If you need a mock, you can this. It simply returns the combined template result as a single string.
```js
function taggedTemplate(strings, ...values) {
    return strings.map((string, index) => `${string}${values[index] || ''}`).join('');
}
```



