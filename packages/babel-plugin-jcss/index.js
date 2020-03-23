'use strict';

/*
    inspired by: https://github.com/art-bazhin/babel-plugin-postcss-template-literals
*/

const postcss = require('postcss');
var flexBubFixes = require('postcss-flexbugs-fixes');
const autoprefixer = require('autoprefixer')
const postcssPresetEnv = require('postcss-preset-env');
const CleanCSS = require('clean-css');

const cleanCSS = new CleanCSS({
    compatibility: 'ie8',
    rebase: false,
    inline: ['none'],
    level: {
        1: {
            all: false,
            optimizeBackground: true, // controls `background` property optimizations; defaults to `true`
            optimizeBorderRadius: true, // controls `border-radius` property optimizations; defaults to `true`
            optimizeFilter: true, // controls `filter` property optimizations; defaults to `true`
            optimizeFont: true, // controls `font` property optimizations; defaults to `true`
            optimizeFontWeight: true, // controls `font-weight` property optimizations; defaults to `true`
            optimizeOutline: true, // controls `outline` property optimizations; defaults to `true`
            removeEmpty: false, // controls removing empty rules and nested blocks; defaults to `true`
            removeNegativePaddings: false, // controls removing negative paddings; defaults to `true`
            removeQuotes: true, // controls removing quotes when unnecessary; defaults to `true`
            removeWhitespace: true, // controls removing unused whitespace; defaults to `true`
            replaceMultipleZeros: false, // contols removing redundant zeros; defaults to `true`
            replaceTimeUnits: true, // controls replacing time units with shorter values; defaults to `true`
            replaceZeroUnits: true, // controls replacing zero values with units; defaults to `true`
            roundingPrecision: false, // rounds pixel values to `N` decimal places; `false` disables rounding; defaults to `false`
            selectorsSortingMethod: false, // denotes selector sorting method; can be `'natural'` or `'standard'`, `'none'`, or false (the last two since 4.1.0); defaults to `'standard'`
            specialComments: 'all', // denotes a number of /*! ... */ comments preserved; defaults to `all`
            tidyAtRules: false, // controls at-rules (e.g. `@charset`, `@import`) optimizing; defaults to `true`
            tidyBlockScopes: false, // controls block scopes (e.g. `@media`) optimizing; defaults to `true`
            tidySelectors: false, // controls selectors optimizing; defaults to `true`,
            semicolonAfterLastProperty: false, // controls removing trailing semicolons in rule; defaults to `false` - means remove
        },
    },
});

function customMinifyCSS(originalCSS) {
    const result = cleanCSS.minify(originalCSS);
    if (result.warnings.length > 0 || result.errors.length > 0) {
        console.log(result.warnings, result.errors)
        return originalCSS.trim();
    }
    return result.styles;
}

const regex = /____EXPR_ID_(\d+)____/g;

// function handlePlugin(pluginArg) {
//     if (Array.isArray(pluginArg)) {
//         return require(pluginArg[0]).apply(null, pluginArg.slice(1));
//     } else if (typeof pluginArg === 'string') {
//         return require(pluginArg);
//     } else {
//         return pluginArg;
//     }
// }

function buildQuasisAst(t, quasis) {
    return quasis.map((quasi, i) => {
        let isTail = i === quasis.length - 1;
        return t.templateElement({raw: quasi, cooked: quasi}, isTail);
    });
}

function splitExpressions(css) {
    let found = regex.exec(css);
    let matches = [];

    while (found) {
        matches.push(found);
        found = regex.exec(css);
    }

    let reduction = matches.reduce(
        (acc, match) => {
            let [placeholder, exprIndex] = match;
            acc.quasis.push(css.substring(acc.prevEnd, match.index));
            acc.exprs.push(exprIndex);
            acc.prevEnd = match.index + placeholder.length;
            return acc;
        },
        {prevEnd: 0, quasis: [], exprs: []}
    );

    reduction.quasis.push(css.substring(reduction.prevEnd, css.length));

    return {
        quasis: reduction.quasis,
        exprs: reduction.exprs
    };
}

function getExprId(i) {
    return `____EXPR_ID_${i}____`;
}


const DEFAULT_OPTIONS = {
    tag: 'jcss',
    replace: ''
};

module.exports = function ({types: t}) {
    return {
        visitor: {
            TaggedTemplateExpression(path, {opts, file}) {
                opts = Object.assign({}, DEFAULT_OPTIONS, opts);
                let postCssOpts = Object.assign(
                    {},
                    {from: file.opts.filename},
                    opts.postCssOptions
                );

                if (path.node.tag.name !== opts.tag) return;
                if (opts.replace) {
                    path.node.tag.name = opts.replace;
                }

                let quasis = path.node.quasi.quasis;
                let exprs = path.node.quasi.expressions;

                let css = quasis.reduce((acc, quasi, i) => {
                    let expr = exprs[i] ? getExprId(i) : '';
                    return acc + quasi.value.raw + expr;
                }, '');

                let processed = postcss([
                    autoprefixer({
                        flexbox: true,
                        overrideBrowserslist: opts.browsers && opts.browsers
                    }),
                    flexBubFixes()
                ]).process(css, postCssOpts).css;

                processed = customMinifyCSS(processed);

                let split = splitExpressions(processed);
                let quasisAst = buildQuasisAst(t, split.quasis);
                let exprsAst = split.exprs.map(exprIndex => exprs[exprIndex]);

                path.node.quasi.quasis = quasisAst;
                path.node.quasi.expressions = exprsAst;

                path.replaceWith(
                    t.TemplateLiteral(quasisAst, exprsAst)
                );
            }
        }
    };
};

