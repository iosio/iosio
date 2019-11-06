export default (options) => {
    let pkg = {
        name: (options.npm_namespace ? options.npm_namespace + "/" : "") + (options.npm_library_name || ''),
        version: "0.0.1",
        description: options.npm_library_description || '',
        "main": "lib/index.js",
        "module": "src/index.js",
        private: true,
        "scripts": {
            "start": "x start",
            "build": "x build",
            "build_lib": "x build_lib",
            "test": "echo \"No test specified\" && exit 0",
        },
        dependencies: {
            "@iosio/custom-elements-router": "^0.5.55",
            "@iosio/x": "^0.5.54"
        },
        devDependencies: {
            "@iosio/create-x-project": "^0.5.57"
        },
        xProjectConfig: {}
    };

    return JSON.stringify(pkg, null, '\t');
};