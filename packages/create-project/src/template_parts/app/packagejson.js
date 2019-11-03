export default (options) => {

    let pkg = {
        name: (options.npm_namespace ? options.npm_namespace + "/" : "") + (options.npm_library_name || ''),
        version: "0.0.1",
        description: options.npm_library_description || '',
        "main": "src/index.js",
        private: true,
        "scripts": {
            "start": "create-project start",
            "build": "create-project build",
            "build_lib": "create-project build_lib",
            "test": "echo \"No test specified\" && exit 0",
        },
        dependencies: {
            "@iosio/x": "^0.5.38",
            "@iosio/obi": "^0.5.38",
            "@iosio/util": "^0.5.38",
            "@iosio/custom-elements-router": "^0.5.38",
        },
        devDependencies: {
            "@iosio/create-project": "^0.5.39"
        },
        cxa_config: {}
    };

    return JSON.stringify(pkg, null, '\t');
};

