#!/usr/bin/env node
require('babel-polyfill');
const util = require('./util');
const program = require('commander');
const securedContainer = require('absio-secured-container');

program
    .option('-H, --hostname <hostname>', 'Hostname or IP of the server, complete with the protocol, such as: https://sandbox.absio.com.')
    .option('-k, --key <key>', 'API key associated with the server.')
    .option('-u, --userid  <userid>', 'User ID.')
    .option('-p, --password <password>', 'Current user password.')
    .option('-s, --passphrase <passphrase>', 'Current user passphrase.')
    .option('-w, --newpassword <newpassword>', 'New user password.')
    .option('-a, --newpassphrase <newpassphrase>', 'New user passphrase.')
    .option('-r, --newreminder  <newreminder>', 'New reminder.')
    .parse(process.argv);

if (!program.hostname || !program.key || !program.userid || !program.newpassword || !program.newpassphrase) {
    util.exit('Missing required parameters.');
}

if (!program.password && !program.passphrase) {
    util.exit('Please supply either password or passphrase.');
}

util.logInfo('===========');
util.logInfo('Your Hostname: ' + program.hostname);
util.logInfo('Your API key: ' + program.key);
util.logInfo('Your Current Password: ' + program.password);
util.logInfo('Your Current Passphrase: ' + program.passphrase);
util.logInfo('Your New Password: ' + program.newpassword);
util.logInfo('Your New Passphrase: ' + program.newpassphrase);
util.logInfo('Your New Reminder: ' + program.newreminder);

securedContainer.initialize(program.hostname, program.key, {rootDirectory: './Absio', partitionDataByUser: true})
    .then(() => securedContainer.logIn(program.userid, program.password, program.passphrase))
    .then(() => securedContainer.changeCredentials(program.newpassword, program.newpassphrase, program.newreminder))
    .then(userId => util.logSuccess('Credentials changed successfully'))
    .catch(util.logError);
