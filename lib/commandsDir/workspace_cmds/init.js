/*jshint esversion: 6 */

const Workspace         = require("../../src/workspace");
const inquirer          = require("inquirer");

exports.command = 'init [dirPath]';
exports.desc = 'Initializes the provided [dirPath] as schema workspace. If [dirPath] provided then initializes the path, and if not then initializes the current directory.';
exports.builder = {
};
exports.handler = function (argv) {
    let workspace = new Workspace();
    workspace.createWorkspaceConfig(argv.dirPath);
   
};