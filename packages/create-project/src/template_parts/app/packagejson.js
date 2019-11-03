export default (options) => {

    let pkg = {
        name: (options.npm_namespace ? options.npm_namespace + "/" : "") + (options.npm_library_name || ''),
        version: "0.0.1",
        description: options.npm_library_description || '',
        "main": "src/index.js",
        private: true,
        "scripts": {
            "start": "create-x-app start",
            "build": "create-x-app build",
            "test": "echo \"No test specified\" && exit 0",
        },
        dependencies: {
            "@iosio/x": "latest",
            "@iosio/obi": "latest",
            "@iosio/util": "latest",
            "@iosio/custom-elements-router": "latest",
        },
        devDependencies: {
            "@iosio/create-x-app": "^0.5.32"
        },
        cxa_config: {}
    };

    return JSON.stringify(pkg, null, '\t');
};

