module.exports = {
    "commonjsConfig": {
        "include": /\/node_modules\//
    },
    "devInput": "dev/index.js",
    "html": "dev/index.html",
    // "copyConfig": [
    //     "src/fuse.worker.js"
    // ]
    "input": ["src/index.js", "src/fuse.worker.js"]
};