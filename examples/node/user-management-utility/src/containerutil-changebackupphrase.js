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
    .option('-p, --password <password>', 'The password used to encrypt the key file.')
    .option('-b, --backupphrase  <backuphrase>', 'The backupphrase can be used later to reset the password or to allow logging in from another system.')
    .option('-s, --newphrase  <newphrase>', 'New phrase.')
    .option('-r, --newreminder  <newreminder>', 'New reminder.')
    .parse(process.argv);

if (!program.hostname || !program.key || !program.password || !program.userid || !program.backupphrase || !program.newphrase || !program.newreminder) {
    console.log(chalk.bold.green('Missing required parameters.'));
    program.outputHelp();
    process.exit(1);
}

try{
    util.logResult("===========");
    util.logResult("Your Hostname: " + program.hostname);
    util.logResult("Your API key: " + program.key);
    util.logResult("Your User ID: " + program.userid);
    util.logResult("Your Password: " + program.password);
    util.logResult("Your Backup Passphrase: " + program.backupphrase);
    util.logResult("Your New Backup Passphrase: " + program.newphrase);
    util.logResult("Your New Reminder: " + program.newreminder);

    securedContainer.initialize(program.hostname, program.key, {rootDirectory: './Absio'})
        .then(function() {
            securedContainer.logIn(program.userid, program.password, program.backupphrase)
                .then(function(promise) {
                    securedContainer.changeBackupCredentials(program.backupphrase, program.password, program.newreminder, program.newphrase)
                    util.logResult("= The backup phrase and reminder has been changed =");
                });
        });
}
catch(e){
    util.logErrorMessage(e);
}
