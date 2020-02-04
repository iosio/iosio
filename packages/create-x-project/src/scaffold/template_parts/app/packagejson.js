const {version} = require('../../../../package.json');

export default (options) => {
    let pkg = {
        name: options.packageName,
        version: "0.0.1",
        description: '',
        "main": "lib/index.js",
        "module": "src/index.js",
        private: true,
        "scripts": {
            "start": "x start",
            "build": "x build_app",
            "build_lib": "x build_lib",
            "serve_build": "x serve_build",
            "test": "exit 0",
        },
        devDependencies: {
            "@iosio/create-x-project": version
        },
        xProjectConfig: {}
    };

    return {
        file: 'package.json',
        content: JSON.stringify(pkg, null, '\t')
    }
};