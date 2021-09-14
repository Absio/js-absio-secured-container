#!/usr/bin/env node
require('babel-polyfill');
const util = require('./util');
const program = require('commander');
const securedContainer = require('absio-secured-container');

program
    .option('-H, --hostname <hostname>', 'Hostname or IP of the server, complete with the protocol, such as: https://sandbox.absio.com')
    .option('-k, --key <key>', 'API key associated with the server')
    .option('-u, --userid  <userid>', 'User ID.')
    .parse(process.argv);

const options = program.opts();

if (!options.hostname || !options.key || !options.userid) {
    util.exit('Missing required parameters.');
}

util.logInfo('===========');
util.logInfo('Your Hostname: ' + options.hostname);
util.logInfo('Your API key: ' + options.key);
util.logInfo('Your User ID: ' + options.userid);

securedContainer.initialize(options.hostname, options.key, {rootDirectory: './Absio', partitionDataByUser: true})
    .then(() => securedContainer.needToSyncAccount(options.userid))
    .then(needToSync => util.logSuccess(needToSync ? 'Not synced' : 'Already synced'))
    .catch(util.logError);
