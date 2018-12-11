const program = require('commander');
const chalk = require('chalk');

exports.logInfo = message => {
    console.log(chalk.bold.cyan(message));
};

exports.logSuccess = message => {
    console.log(chalk.bold.green(message));
};

exports.logError = message => {
    console.log(chalk.bold.red(message));
};

exports.exit = message => {
    console.log(message);
    program.outputHelp();
    process.exit(1);
};