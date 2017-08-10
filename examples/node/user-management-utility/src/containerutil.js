#!/usr/bin/env node
require('babel-polyfill');
const util = require ('./output.js');
let pkg = require('./../package.json');
let program = require('commander');
let chalk = require('chalk');

program.on('--help', function (){
    console.log('');
    console.log(chalk.bold.red('Important: ') + chalk.bold.green('The password and backupphrase should be kept secret.'));
    console.log(chalk.bold.green('We recommend using long and complex values with numbers and/or symbols. Do not store them publicly in plain text.'));
    console.log(chalk.bold.green('Generates private keys and registers a new user on the API server.'));
    console.log(chalk.bold.green('This user\'s private keys are encrypted with the password to produce a key file. '));
    console.log(chalk.bold.green('The backupphrase is used to reset the password and download the key file. '));
    console.log(chalk.bold.cyan.underline('Our web-based user creation utility can also be used to securely generate static users.'));
    console.log('');
});



program
    .version(pkg.version)
    .command('register', 'Register a user')
    .command('resetpassword', 'Reset the user\'s password')
    .command('login', 'Perform a login to test your password and passphrase')
    .command('deleteuser', 'Delete the user')
    .command('getreminder', 'Get reminder for the backup passphrase of a user')
    .command('changebackupphrase', 'Change backup passphrase of a user');

program.parse(process.argv);


if(!process.argv.slice(2).length) {
    console.log('Please provide a command, such as: registerUser');
    program.outputHelp();
    process.exit(1);
}
