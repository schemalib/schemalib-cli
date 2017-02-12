#!/usr/bin/env node

const deasync       = require('deasync');
const commandsDir   = require('path').dirname(require.main.filename) + 'src/commandsDir';
const yargs         = require('yargs');
const color         = require('chalk');

function startCli() {

    yargs.commandDir(commandsDir)
        .usage('Usage: $0 <cmd>')
        .demand(1)
        .fail(function ( msg, err ) {
            if ( err && err.stack ) {
                console.error('ERROR:')
                console.error(msg)
                console.error(err.stack)
                process.exit(1)
            }
            else {
                yargs.getUsageInstance().showHelp();
                console.error(color.red.bold("[ERROR]:"), msg);
                process.exit(1);
            }
        })
        .help(false)
        .version()
        .recommendCommands()
        .argv;
}

startCli();
