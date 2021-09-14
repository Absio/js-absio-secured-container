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

const options = program.opts();

if (!options.hostname || !options.key || !options.userid || !options.oldpassword || !options.passphrase) {
    util.exit('Missing required parameters.');
}

util.logInfo('===========');
util.logInfo('Your Hostname: ' + options.hostname);
util.logInfo('Your API key: ' + options.key);
util.logInfo('Your Password For Cached Key File: ' + options.oldpassword);
util.logInfo('Your Passphrase: ' + options.passphrase);
util.logInfo('Your Password: ' + options.password);

securedContainer.initialize(options.hostname, options.key, {rootDirectory: './Absio', partitionDataByUser: true})
     // If to log in using only password, Key File will be taken from the cache bypassing server
    .then(() => securedContainer.logIn(options.userid, options.oldpassword))
     // User is logged in using cached Key File. Now try to sync Key File from the server using up to date passphrase/password.
    .then(() => securedContainer.synchronizeAccount(options.passphrase, options.password))
    .then(() => util.logSuccess('Account synchronized successfully'))
    .catch(util.logError);
