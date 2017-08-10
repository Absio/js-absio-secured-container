#!/usr/bin/env node
require('babel-polyfill');
const util = require ('./output');
let program = require('commander');
let chalk = require('chalk');
let securedContainer = require('absio-secured-container');

program
    .option('-H, --hostname <hostname>', 'Hostname or IP of the server, complete with the protocol, such as: https://sandbox.absio.com')
    .option('-k, --key <key>', 'API key associated with the server')
    .option('-u, --userid  <userid>', 'User ID.')
    .parse(process.argv);

if (!program.hostname || !program.key || !program.userid) {
    console.log(chalk.bold.green('Missing required parameters.'));
    program.outputHelp();
    process.exit(1);
}

try{
    util.logResult("===========");
    util.logResult("Your Hostname: " + program.hostname);
    util.logResult("Your API key: " + program.key);
    util.logResult("Your User ID: " + program.userid);
    securedContainer.initialize(program.hostname, program.key, {rootDirectory: './Absio'})
        .then(function() {
            securedContainer.getBackupReminder(program.userid)
                .then(function(promise) {
                    util.logResult("Reminder for the backup passphrase is: " + promise);
                });
        });
}
catch(e){
    util.logErrorMessage(e);
}
