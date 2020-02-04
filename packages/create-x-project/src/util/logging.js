import kleur, {
    //Colors
    black,
    red,
    green,
    yellow,
    blue,
    magenta,
    cyan,
    white,
    gray,
    grey,

//Backgrounds
    bgBlack,
    bgRed,
    bgGreen,
    bgYellow,
    bgBlue,
    bgMagenta,
    bgCyan,
    bgWhite,

//Modifiers
    reset,
    bold,
    dim,
    italic,
    underline,
    inverse,
    hidden,
    strikethrough,
} from 'kleur';

export const stdout = console.log.bind(console);
export const stderr = console.error.bind(console);
export const logError = function (err) {
    const error = err.error || err;
    const description = `${error.name ? error.name + ': ' : ''}${error.message ||
    error}`;
    const message = error.plugin
        ? `(${error.plugin} plugin) ${description}`
        : description;

    stderr(red().bold(message));

    if (error.loc) {
        stderr();
        stderr(`at ${error.loc.file}:${error.loc.line}:${error.loc.column}`);
    }

    if (error.frame) {
        stderr();
        stderr(dim(error.frame));
    } else if (err.stack) {
        const headlessStack = error.stack.replace(message, '');
        stderr(dim(headlessStack));
    }

    stderr();
};

const logTypes = {
    out: stdout,
    err: stderr,
};
const logger = type => (...args) => {
    let arg1 = args[0];
    typeof arg1 === 'function' ? logTypes[type](arg1(kleur)) : logTypes[type](...args);
};

export const log = {
    out: (...args) => logger('out')(...args),
    err: (...args) => logger('err')(...args),
    Error: logError
};