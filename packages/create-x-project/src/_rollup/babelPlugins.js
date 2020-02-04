export const babelPlugins = (cssBrowsers = ['last 2 versions']) => [
    ['@iosio/babel-plugin-jcss', {browsers: cssBrowsers}],
    ['@iosio/babel-plugin-minify-html-literals'],
    "transform-inline-environment-variables",
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    ['bundled-import-meta', {importStyle: 'baseURI'}],
    ["@babel/plugin-transform-react-jsx", {pragma: 'h', pragmaFrag: "Fragment"}],
    ["@babel/plugin-proposal-class-properties", {"loose": true}],
];
