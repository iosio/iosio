export const options = {

    //microbundle
    entry : 'a.js,b.js(/src/index.js)',
    output: 'dist',
    format: '(modern,es,cjs,umd)',
    watch: false,
    target: 'node or web - (web)',
    external: 'modules,to,not,bundle or none',
    globals: 'globalDep or none react=preact',
    compress: 'minify (null)',
    strict: '',
    name: 'name exposed to umd',
    cwd: 'alternative command working dirctory (".")',
    sourcemap: 'generate source map (true)',
    raw: 'show raw bytes (false)',
    jsx: 'pragma (h)',
    jsxFragment: 'Fragment pragma (Fragment)',
    tsconfig: 'path to custom tsconfig.json',

    //other microbundle options
    source: "src/foo.js",         // Your source file (same as 1st arg to microbundle)
    main: "dist/foo.js",        // output path for CommonJS/Node
    module: "dist/foo.mjs",     // output path for JS Modules
    unpkg: "dist/foo.umd.js",

    //other properties

    //my options
    devServer: {},
};