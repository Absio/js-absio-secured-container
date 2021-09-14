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

const options = program.opts();

if (!options.hostname || !options.key || !options.userid || !options.newpassword || !options.newpassphrase) {
    util.exit('Missing required parameters.');
}

if (!options.password && !options.passphrase) {
    util.exit('Please supply either password or passphrase.');
}

util.logInfo('===========');
util.logInfo('Your Hostname: ' + options.hostname);
util.logInfo('Your API key: ' + options.key);
util.logInfo('Your Current Password: ' + options.password);
util.logInfo('Your Current Passphrase: ' + options.passphrase);
util.logInfo('Your New Password: ' + options.newpassword);
util.logInfo('Your New Passphrase: ' + options.newpassphrase);
util.logInfo('Your New Reminder: ' + options.newreminder);

securedContainer.initialize(options.hostname, options.key, {rootDirectory: './Absio', partitionDataByUser: true})
    .then(() => securedContainer.logIn(options.userid, options.password, options.passphrase))
    .then(() => securedContainer.changeCredentials(options.newpassword, options.newpassphrase, options.newreminder))
    .then(userId => util.logSuccess('Credentials changed successfully'))
    .catch(util.logError);
