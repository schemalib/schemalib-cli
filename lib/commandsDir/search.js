/*jshint esversion: 6 */

exports.command = 'search <keyword>';
exports.desc = 'Search for schemas in the schema registry/library';
exports.builder = function (yargs) {
    return yargs.commandDir('search_cmds')
};
exports.handler = function (argv) {};
