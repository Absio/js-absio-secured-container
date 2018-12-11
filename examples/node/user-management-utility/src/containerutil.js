#!/usr/bin/env node
require('babel-polyfill');
const util = require('./util.js');
const pkg = require('./../package.json');
const program = require('commander');
const chalk = require('chalk');

program.on('--help', function () {
    console.log('');
    console.log(chalk.bold.red('Important: ') + chalk.bold.green('The password and passphrase should be kept secret.'));
    console.log(chalk.bold.green('We recommend using long and complex values with numbers and/or symbols. Do not store them publicly in plain text.'));
    console.log(chalk.bold.green('Generates private keys and registers a new user on the API server.'));
    console.log(chalk.bold.green('This user\'s private keys are encrypted with the password to produce a key file.'));
    console.log(chalk.bold.green('The passphrase is used for getting Key File from the server and for authenticating when the password is lost.'));
    console.log(chalk.bold.cyan.underline('Our web-based user creation utility can also be used to securely generate static users.'));
    console.log('');
});


program
    .version(pkg.version)
    .command('register', 'Register a user')
    .command('login', 'Perform a login to test your password and passphrase')
    .command('deleteuser', 'Delete the user')
    .command('getreminder', 'Get reminder for the backup passphrase of a user')
    .command('changecredentials', 'Change credentials for a user')
    .command('needtosync', 'Check if the Key File needs to be synced')
    .command('syncaccount', 'Pull the Key File from the server and load it into memory and optionally into the cache');

program.parse(process.argv);


if (!process.argv.slice(2).length) {
    util.exit('Please provide a command, such as: registerUser');
}
