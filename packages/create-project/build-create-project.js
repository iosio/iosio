const fse = require('fs-extra');

let create_project = require('./package.json');


console.log('building "create-project"');

/*

           "@iosio/x": "^${version}",
            "@iosio/obi": "^${version}",
            "@iosio/util": "^${version}",
            "@iosio/custom-elements-router": "^${version}",
 */


const string = `\
export default (options) => {
    let pkg = {
        name: (options.npm_namespace ? options.npm_namespace + "/" : "") + (options.npm_library_name || ''),
        version: "0.0.1",
        description: options.npm_library_description || '',
        "main": "lib/index.js",
        "module": "src/index.js",
        private: true,
        "scripts": {
            "start": "create-project start",
            "build": "create-project build",
            "build:lib": "create-project build_lib",
            "test": "echo \\"No test specified\\" && exit 0",
        },
        dependencies: {
 
           "@iosio/x": "^0.5.38",
            "@iosio/obi": "^0.5.38",
            "@iosio/util": "^0.5.38",
            "@iosio/custom-elements-router": "^0.5.38",
        },
        devDependencies: {
            "@iosio/create-project": "^0.5.41"
        },
        cxa_config: {}
    };

    return JSON.stringify(pkg, null, '\\t');
};`;

fse.outputFile(__dirname + '/src/template_parts/app/packagejson.js', string);