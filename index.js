const deasync       = require('deasync');
const commandsDir   = __dirname + '/lib/commandsDir';
const yargs         = require('yargs');
const chalk         = require('chalk');

function startCli() {

    yargs.commandDir(commandsDir)
        .usage('Usage: $0 <cmd>')
        .demand(1)
        .fail(function ( msg, err ) {
            if ( err && err.stack ) {
                console.error(chalk.red.bold('ERROR:',msg))
                console.error('----------')
                console.error(err.stack)
                process.exit(1)
            }
            else {
                yargs.getUsageInstance().showHelp();
                console.error(chalk.red.bold("[ERROR]:"), msg);
                process.exit(1);
            }
        })
        .help(false)
        .version()
        .recommendCommands()
        .argv;
}

startCli();
