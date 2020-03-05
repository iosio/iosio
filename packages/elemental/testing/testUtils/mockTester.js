
const expect = (target) => ({
    toBe: (expectedValue) => {
        if (target !== expectedValue) {
            throw new Error(`expected: ${String(expectedValue)} but received ${target}`)
        }
    }
});


const it = (string, cb) => {
    let msg;
    try {
        cb();
        msg = string;
    } catch (e) {
        console.error(string, e, `💩`);
    }
    msg && console.log("√ " + msg)
};
