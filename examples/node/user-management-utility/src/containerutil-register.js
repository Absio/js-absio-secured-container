#!/usr/bin/env node
require('babel-polyfill');
const util = require('./util');
const program = require('commander');
const securedContainer = require('absio-secured-container');

program
    .option('-H, --hostname <hostname>', 'Hostname or IP of the server, complete with the protocol, such as: https://sandbox.absio.com')
    .option('-k, --key <key>', 'API key associated with the server.')
    .option('-p, --password <password>', 'The password used to encrypt the key file.')
    .option('-r, --reminder  <reminder>', 'The reminder should only be used as a hint to remember the passphrase. This string is stored in plain text and should not contain sensitive information.')
    .option('-s, --passphrase <passphrase>', 'Passphrase used for getting Key File from the server and for authenticating when the password is lost.')
    .parse(process.argv);

const options = program.opts();

if (!options.hostname || !options.key || !options.password || !options.reminder || !options.passphrase) {
    util.exit('Missing required parameters.');
}

util.logInfo('===========');
util.logInfo('Your Hostname: ' + options.hostname);
util.logInfo('Your API key: ' + options.key);
util.logInfo('Your Password: ' + options.password);
util.logInfo('Your Reminder: ' + options.reminder);
util.logInfo('Your Passphrase: ' + options.passphrase);

securedContainer.initialize(options.hostname, options.key, {rootDirectory: './Absio', partitionDataByUser: true})
    .then(() => securedContainer.register(options.password, options.reminder, options.passphrase))
    .then(userId => util.logSuccess(`Created user with ID: ${userId}`))
    .catch(util.logError);
