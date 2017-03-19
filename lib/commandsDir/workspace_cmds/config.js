/*jshint esversion: 6 */

const Workspace         = require("../../src/workspace");
const inquirer          = require("inquirer");
const chalk             = require("chalk");


exports.command = 'config';
exports.desc = 'Manages the current workspace config, if no flags set then it displays the current workspace.json settings.';
exports.builder = {
};
exports.handler = function (argv) {
    let workspace = new Workspace();

    workspace.loadWorkspaceConfig();
    console.log(chalk.yellow.bold("[DONE]: ")+"workspace.json properties shown \n\r",workspace.  getWorkspaceConfig ());
   
};