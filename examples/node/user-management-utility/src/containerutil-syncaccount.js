#!/usr/bin/env node
require('babel-polyfill');
const util = require('./util');
const program = require('commander');
const securedContainer = require('absio-secured-container');

program
    .option('-H, --hostname <hostname>', 'Hostname or IP of the server, complete with the protocol, such as: https://sandbox.absio.com.')
    .option('-k, --key <key>', 'API key associated with the server.')
    .option('-u, --userid  <userid>', 'User ID.')
    .option('-c, --oldpassword <oldpassword>', 'Password for the Key File which is cached.')
    .option('-s, --passphrase <passphrase>', 'User passphrase.')
    .option('-p, --password <password>', 'User password.')
    .parse(process.argv);

if (!program.hostname || !program.key || !program.userid || !program.oldpassword || !program.passphrase) {
    util.exit('Missing required parameters.');
}

util.logInfo('===========');
util.logInfo('Your Hostname: ' + program.hostname);
util.logInfo('Your API key: ' + program.key);
util.logInfo('Your Password For Cached Key File: ' + program.oldpassword);
util.logInfo('Your Passphrase: ' + program.passphrase);
util.logInfo('Your Password: ' + program.password);

securedContainer.initialize(program.hostname, program.key, {rootDirectory: './Absio', partitionDataByUser: true})
     // If to log in using only password, Key File will be taken from the cache bypassing server
    .then(() => securedContainer.logIn(program.userid, program.oldpassword))
     // User is logged in using cached Key File. Now try to sync Key File from the server using up to date passphrase/password.
    .then(() => securedContainer.synchronizeAccount(program.passphrase, program.password))
    .then(() => util.logSuccess('Account synchronized successfully'))
    .catch(util.logError);
