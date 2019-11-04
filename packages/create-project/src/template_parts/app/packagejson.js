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
            "test": "echo \"No test specified\" && exit 0",
        },
        dependencies: {

           "@iosio/x": "^0.5.47",
            "@iosio/obi": "^0.5.47",
            "@iosio/util": "^0.54.47",
            "@iosio/custom-elements-router": "^0.5.47",
        },
        devDependencies: {
            "@iosio/create-project": "^0.5.47"
        },
        cxa_config: {}
    };

    return JSON.stringify(pkg, null, '\t');
};