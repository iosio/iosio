import arg from 'arg';
import execa from 'execa';

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg({}, {argv: rawArgs.slice(2)});
    return {action: args._[0], dir: args._[1]};
}


export async function cli(args) {
    let {action, dir} = parseArgumentsIntoOptions(args);

    let subprocess;

    let cmd = `lerna exec --scope @iosio/${dir} -- rollup --c ../../rollup/${action}.js` + (action === 'dev' ? ' -w' : '');

    subprocess = execa.shell(cmd);
    //

    subprocess.stdout.pipe(process.stdout);
    if (subprocess.failed) {
        console.error('subprocess failed********************');
        return Promise.reject(new Error('Failed'));
    }

    (async () => {
        const {stdout} = await subprocess;
        // console.log('child output:', stdout);
    })();

}


