/*jshint esversion: 6 */

exports.command = 'generate <command>';
exports.desc = 'Generates boilerplate for specific platform <command> from the schema provided';
exports.aliases = ['g'];
exports.builder = function (yargs) {
    return yargs.commandDir('generate_cmds')
};
exports.handler = function (argv) {};
