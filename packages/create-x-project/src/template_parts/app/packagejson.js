export default (options) => {
    let pkg = {
        name: (options.npm_namespace ? options.npm_namespace + "/" : "") + (options.npm_library_name || ''),
        version: "0.0.1",
        description: options.npm_library_description || '',
        "main": "lib/index.js",
        "module": "src/index.js",
        private: true,
        "scripts": {
            "start": "create-x-project start",
            "build": "create-x-project build",
            "build_lib": "create-project build_lib",
            "test": "echo \"No test specified\" && exit 0",
        },
        dependencies: {

           "@iosio/x": "^0.5.52",
            "@iosio/obi": "^0.5.52",
            "@iosio/util": "^0.5.52",
            "@iosio/custom-elements-router": "^0.5.52",
        },
        devDependencies: {
            "@iosio/create-x-project": "^0.5.53"
        },
        xProjectConfig: {}
    };

    return JSON.stringify(pkg, null, '\t');
};