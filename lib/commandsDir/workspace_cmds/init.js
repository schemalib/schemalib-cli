/*jshint esversion: 6 */

const Workspace         = require("../../src/workspace");
const inquirer          = require("inquirer");
const chalk             = require("chalk");


exports.command = 'init [dirPath]';
exports.desc = 'Initializes the provided [dirPath] as schema workspace. If [dirPath] provided then initializes the path, and if not then initializes the current directory.';
exports.builder = {
    force: {
      alias: 'f',
      default: false
    }
};
exports.handler = function (argv) {
    let workspace = new Workspace();

    if (argv.force === true) { 
        workspace.createWorkspaceConfig(argv.dirPath);
        console.log(chalk.yellow.bold("[DONE]: ")+"workspace.json initialized with default settings!");
    }
    else {
        let confData = {};

        inquirer.prompt({
            type: 'list',
            name: 'registry',
            default: 'no',
            message: 'Do you have a schemalib registry username?',
            choices: ['yes', 'no']
        }).then(function (answer) {
            if (answer.registry == 'yes') {
                // todo: we need to pull the other author info from the registry and prefill it 
                return inquirer.prompt({
                    type: 'input',
                    name: 'username',
                    message: 'Enter your schemalib registry username:'
                }).then(function (answer) {
                    confData.username = answer.username;
                });
            } 
            else {
                return inquirer.prompt([{
                    type: 'input',
                    name: 'authorName',
                    message: 'Enter author name (used when creating new schemas):'
                },
                {
                    type: 'input',
                    name: 'authorEmail',
                    message: 'Enter author email (used when creating new schemas):'
                },
                {
                    type: 'input',
                    name: 'authorWebsite',
                    message: 'Enter author website (used when creating new schemas):'
                }
                ]).then(function (answers) {
                    confData.authorName = answers.authorName;
                    confData.authorEmail = answers.authorEmail;
                    confData.authorWebsite = answers.authorWebsite;
                });  
            }

        })
        .then(function () {
            workspace.createWorkspaceConfig(argv.dirPath,confData);
            console.log(chalk.yellow.bold("[DONE]: ")+"workspace.json initialized!");
        });  
    }
   
};