/*jshint esversion: 6 */

const convict           = require ('convict');
const findup            = require ('findup-sync');
const Base              = require('./base');
const fs                = require('fs');
const path              = require('path');

let convictSchema = {
            username: {
                doc: "Username ( login ) for the schemalib registry",
                format: "*",
                default: undefined
            },
            registry: {
                doc: "Url of the registry server, default is: http://registry.schemalib.com",
                format: "url",
                default: "http://registry.schemalib.com"
            },
            authorName: {
                doc: "Default author name to use when creating new schemas",
                format: String,
                default: undefined
            },
            authorWebsite: {
                doc: "Default author name to use when creating new schemas",
                format: "url",
                default: undefined
            },
            authorEmail: {
                doc: "Default author name to use when creating new schemas",
                format: "email",
                default: undefined
            }
        };

class Workspace extends Base { 

    constructor(cmd = null, options = {}) {
        super({
            'debug':  false,
            'workspaceFileName': 'workspace.json'
        },
        options);

        this.config = convict(convictSchema);
        this.workspaceDir = null;
    }

    
    /**
     * Loads the workspace.json configuration and sets the workspace up
     * 
     * @param String [cmd=null] 
     * @returns convict
     * 
     * @memberOf Workspace
     */
    loadWorkspaceConfig (cmd = null) {

        let configPath = null;
        if (cmd === null) {
            configPath = findup(this.options.workspaceFileName,{ nocase: true});
        }
        else {
            configPath = findup(this.options.workspaceFileName,{cwd: cmd, nocase: true});
        }

        if (configPath === null) {
            this._error("Could not find workspace.json in or around the path: " + cmd);
            return false;
        }
        else {
            this.config.loadFile(configPath);
            this.workspaceDir = path.dirname(configPath);
            return this.config;
        }
        
    }


    /**
     * 
     * 
     * @param String [cmd=null] directory path where workspace config will be generated 
     * @param Object [config={}] object with default properties that will be used to set the workspace config
     * @returns Bool
     * 
     * @memberOf Workspace
     */
    
    createWorkspaceConfig (cmd = null, config = {}) {

        let pathFile = this.options.workspaceFileName;

        if (cmd === null) {
            pathFile = pathFile;
        }
        else {
            pathFile = cmd + path.sep + pathFile;
        }


        this.config.load(config);

        try {
            fs.writeFileSync(pathFile, this.config.toString());
            return true;
        } catch (err) {
            this._error("Problem writing " + pathFile + " : " + err.message);
            return false;
        }

    }

    getWorkspaceConfig () {
        return this.config.toString();
    }

}

module.exports      = Workspace;