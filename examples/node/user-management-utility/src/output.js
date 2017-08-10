let chalk = require('chalk');

exports.logResult = (result) => {
    console.log(chalk.bold.cyan(result));
};

exports.logErrorMessage = (errorMessage)=>{
    console.log(chalk.red(errorMessage));
};