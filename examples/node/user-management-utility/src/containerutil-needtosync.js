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

if (!program.hostname || !program.key || !program.userid) {
    util.exit('Missing required parameters.');
}

util.logInfo('===========');
util.logInfo('Your Hostname: ' + program.hostname);
util.logInfo('Your API key: ' + program.key);
util.logInfo('Your User ID: ' + program.userid);

securedContainer.initialize(program.hostname, program.key, {rootDirectory: './Absio', partitionDataByUser: true})
    .then(() => securedContainer.needToSyncAccount(program.userid))
    .then(needToSync => util.logSuccess(needToSync ? 'Not synced' : 'Already synced'))
    .catch(util.logError);
