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
    program.parse(process.argv);

const options = program.opts();

if (!options.hostname || !options.key || !options.userid) {
    util.exit('Missing required parameters.');
}

if (!options.password && !options.passphrase) {
    util.exit('Please supply either password or passphrase.');
}

util.logInfo('===========');
util.logInfo('Your Hostname: ' + options.hostname);
util.logInfo('Your API key: ' + options.key);
util.logInfo('Your Password: ' + options.password);
util.logInfo('Your User ID: ' + options.userid);
util.logInfo('Your Passphrase: ' + options.passphrase);

securedContainer.initialize(options.hostname, options.key, {rootDirectory: './Absio', partitionDataByUser: true})
    .then(() => securedContainer.logIn(options.userid, options.password, options.passphrase))
    .then(() => util.logSuccess('Logged in successfully'))
    .catch(util.logError);
