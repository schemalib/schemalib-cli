/*jshint esversion: 6 */

exports.command = 'workspace <command>';
exports.desc = 'Manages the local workspace where schema will be managed';
exports.aliases = ['w'];
exports.builder = function (yargs) {
    return yargs.commandDir('workspace_cmds')
};
exports.handler = function (argv) {};