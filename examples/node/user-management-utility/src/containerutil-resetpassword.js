#!/usr/bin/env node
require('babel-polyfill');
const util = require ('./output');
let program = require('commander');
let chalk = require('chalk');
let securedContainer = require('absio-secured-container');

program
    .option('-H, --hostname <hostname>', 'Hostname or IP of the server, complete with the protocol, such as: https://sandbox.absio.com')
    .option('-k, --key <key>', 'API key associated with the server')
    .option('-u, --userid  <newpass>', 'User ID.')
    .option('-n, --newpass  <newpass>', 'New password.')
    .option('-b, --backupphrase  <backuphrase>', 'The backupphrase can be used later to reset the password or to allow logging in from another system.')
    .parse(process.argv);

if (!program.hostname || !program.key || !program.newpass || !program.userid || !program.backupphrase) {
    console.log(chalk.bold.green('Missing required parameters.'));
    program.outputHelp();
    process.exit(1);
}

try{
    util.logResult("===========");
    util.logResult("Your Hostname: " + program.hostname);
    util.logResult("Your API key: " + program.key);
    util.logResult("Your UserID: " + program.userid);
    util.logResult("Your Backup Passphrase: " + program.backupphrase);
    util.logResult("Your New password: " + program.newpass);
    securedContainer.initialize(program.hostname, program.key, {rootDirectory: './Absio'})
        .then(function() {
            securedContainer.resetPassword(program.userid, program.backupphrase, program.newpass)
                .then(function(obj) {
                    util.logResult("= Your password has been changed =");
                });
        });
}
catch(e){
    util.logErrorMessage(e);
}
