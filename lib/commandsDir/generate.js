
exports.command = 'generate <command>';
exports.desc = 'Generates boilerplate for specific platform from the schema provided';
exports.builder = function (yargs) {
    return yargs.commandDir('generate_cmds')
};
exports.handler = function (argv) {};
