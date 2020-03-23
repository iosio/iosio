'use strict';

/* inspired by: https://github.com/art-bazhin/babel-plugin-postcss-template-literals */


const regex = /____EXPR_ID_(\d+)____/g;

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
    tag: 'minify',
    replace: ''
};

module.exports = function ({types: t}) {
    return {
        visitor: {
            TaggedTemplateExpression(path, {opts, file}) {
                opts = Object.assign({}, DEFAULT_OPTIONS, opts);

                if (path.node.tag.name !== opts.tag) return;
                if (opts.replace) {
                    path.node.tag.name = opts.replace;
                }

                let quasis = path.node.quasi.quasis;
                let exprs = path.node.quasi.expressions;

                let string = quasis.reduce((acc, quasi, i) => {
                    let expr = exprs[i] ? getExprId(i) : '';
                    return acc + quasi.value.raw + expr;
                }, '');

                let processed = string.split('\n').join(' ').replace(/  +/g, ' ');

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

