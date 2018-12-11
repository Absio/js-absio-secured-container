#!/usr/bin/env node
require('babel-polyfill');
const util = require('./util');
const program = require('commander');
const securedContainer = require('absio-secured-container');

program
    .option('-H, --hostname <hostname>', 'Hostname or IP of the server, complete with the protocol, such as: https://sandbox.absio.com.')
    .option('-k, --key <key>', 'API key associated with the server.')
    .option('-u, --userid  <userid>', 'User ID.')
    .option('-p, --password <password>', 'The password used to encrypt the key file.')
    .option('-s, --passphrase <passphrase>', 'Passphrase used for getting Key File from the server and for authenticating when the password is lost.')
    .parse(process.argv);

if (!program.hostname || !program.key || !program.userid) {
    util.exit('Missing required parameters.');
}

if (!program.password && !program.passphrase) {
    util.exit('Please supply either password or passphrase.');
}

util.logInfo('===========');
util.logInfo('Your Hostname: ' + program.hostname);
util.logInfo('Your API key: ' + program.key);
util.logInfo('Your Password: ' + program.password);
util.logInfo('Your User ID: ' + program.userid);
util.logInfo('Your Passphrase: ' + program.passphrase);

securedContainer.initialize(program.hostname, program.key, {rootDirectory: './Absio', partitionDataByUser: true})
    .then(() => securedContainer.logIn(program.userid, program.password, program.passphrase))
    .then(() => securedContainer.deleteUser())
    .then(() => util.logSuccess(`User ${program.userid} has been deleted`))
    .catch(util.logError);
