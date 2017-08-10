#!/usr/bin/env node
require('babel-polyfill');
const util = require ('./output');
let program = require('commander');
let chalk = require('chalk');
let securedContainer = require('absio-secured-container');

program
    .option('-H, --hostname <hostname>', 'Hostname or IP of the server, complete with the protocol, such as: https://sandbox.absio.com')
    .option('-k, --key <key>', 'API key associated with the server')
    .option('-p, --password <password>', 'The password used to encrypt the key file.')
    .option('-r, --reminder  <reminder>', 'The reminder should only be used as a hint to remember the backupPassphrase. This string is stored in plain text and should not contain sensitive information.')
    .option('-b, --backupphrase  <backuphrase>', 'The backupphrase can be used later to reset the password or to allow logging in from another system.')
    .parse(process.argv);

if (!program.hostname || !program.key || !program.password || !program.reminder || !program.backupphrase) {
    console.log(chalk.bold.green('Missing required parameters.'));
    program.outputHelp();
    process.exit(1);
}

try{
    util.logResult("===========");
    util.logResult("Your Hostname: " + program.hostname);
    util.logResult("Your API key: " + program.key);
    util.logResult("Your Password: " + program.password);
    util.logResult("Your Reminder: " + program.reminder);
    util.logResult("Your Backup Passphrase: " + program.backupphrase);

    securedContainer.initialize(program.hostname, program.key, {rootDirectory: './Absio'})
        .then(function() {
            securedContainer.register(program.password, program.reminder, program.backupphrase)
                .then(function(userId) {
                    util.logResult("Create user with ID: " + userId);
                });
        });
}
catch(e){
    util.logErrorMessage(e);
}
