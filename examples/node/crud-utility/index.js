#!/usr/bin/env node
"use strict";

require('babel-polyfill');
const securedContainer = require('absio-secured-container');
const chalk       = require('chalk');
const clear       = require('clear');
const CLI         = require('clui');
const Spinner     = CLI.Spinner;
const inquirer    = require('inquirer');
const fs          = require('fs');
const path        = require('path');
const figlet      = require('figlet');
const _           = require('lodash');
const moment      = require('moment');
const open        = require('open');

securedContainer.initialize('https://sandbox.absio.com', 'c6b769ac-f7e9-43eb-96e2-dd6e07756149')
    .catch((error) => console.log(chalk.red(error)));


const commands = {
  login: 'Login',
  exit: 'Exit',
  loadFileIntoSystem: 'Load File into System',
  showFileById: 'Show File by ID',
  showFilesInOfs: 'Show Files in OFS',
  processEvents: 'Process Events',
  logout: 'Logout',
  tryAgain: 'Try Again',
  homeScreen: 'Home Screen',
  updateAccess: 'Update Access',
  delete: 'Delete',
  updateContent: 'Update Content',
  open: 'Open',
  showFileScreen: 'Show File Screen',
  grantAccessForNewUser: 'Grant Access For New User',
  updateAccessForExistingUser: 'Update Access For Existing User',
}

let availableIds = [];
let loggedInUserId = '';

const filterEventsId = (events) => {
    // available actions for events 'all', 'accessed', 'added', 'deleted', or 'updated'
    
    let deletedEvents = events.filter((elem, index, array) => {
        return elem.action === 'deleted';
    });
    
    let deletedIds = deletedEvents.map((element) => {
        return element.containerId;
    });

    let allIds = events.map((element) => {
        return element.containerId;
    });

    return _.difference(_.uniq(allIds), deletedIds);
}

const processEvents = () => {
  const status = new Spinner('Processing events ...');
  status.start();

  securedContainer.getLatestEvents({startingEventId: 0})
  .then((events) => {
      availableIds = filterEventsId(events);
      status.stop();
      homeMenu();
  })
  .catch((error) => {
    status.stop();
    logError(error.message);
    homeMenu();
  })
}

const exitFromApp = () => {
  process.exit();  
}

const logError = (errorMessage) => {
    console.log(chalk.red(errorMessage));
}

const logOut = () => {
    const status = new Spinner('Logging out....');
    status.start();

    securedContainer.logOut()
    .then(() => {
      status.stop();
      topMenu();
    })
    .catch((error) => {
      status.stop();
      logError(error.message);
      homeMenu();
   });
}

const loginWithCredentials = () => {
    const loginQuestions = [
      {
        type: 'input',
        name: 'userId',
        message: 'Enter userId',
        validate: (value) => {
          if (value.length) {
            return true;
          } else {
            return 'Please enter userId';
          }
        }
      },
      {
        type: 'password',
        name: 'password',
        message: 'Enter password',
        validate: (value) => {
          if (value.length) {
            return true;
          } else {
            return 'Please enter password';
          }
        }
      },
      {
        type: 'password',
        name: 'passphrase',
        message: 'Enter passphrase',
        validate: (value) => {
          if (value.length) {
            return true;
          } else {
            return 'Please enter passphrase';
          }
        }
      }
    ];
    inquirer.prompt(loginQuestions)
    .then((answers) => {
        const status = new Spinner('Authentication with server...');
        status.start();

        securedContainer.logIn(answers.userId, answers.password, answers.passphrase)
        .then(() => {
          loggedInUserId = answers.userId;
          status.stop();
          homeMenu();
        })
        .catch((error) => {
          status.stop();
          logError(error.message);
          topMenu();
      });
    });
}

const showFilesInOfs = () =>{
  let options = [commands.homeScreen].concat(availableIds);

  inquirer.prompt(
  {
    type: 'list',
    name: 'optionValue',
    message: 'Please choose an option',
    choices: options
  })
  .then((answers) => {
      switch(answers.optionValue){
        case commands.homeScreen:
          homeMenu();
        break;
        default:
          showFileInfo(answers.optionValue);
      }
  });
}

const deleteContainer = (fileId) => {
  inquirer.prompt([{
    type: 'confirm',
    name: 'shouldBeDeleted',
    message: 'Are you sure you want to delete this file',
    default: false
  }])
  .then((answers) => {
    if(answers.shouldBeDeleted){
      const status = new Spinner('Deleting container ...');
      status.start();

      securedContainer.deleteContainer(fileId)
      .then((result) => {
        status.stop();
        console.log(chalk.red('container deleted'));
        homeMenu();
      })
      .catch((error) => {
        status.stop();
        logError(error.message);
        showFileInfo(fileId);
      })
    }
    else{
        showFileInfo(fileId);
    }
  });
}

const updateContainerAccess = (container) => {
    inquirer.prompt(
      {
        type: 'list',
        name: 'optionValue',
        message: 'Update Access of Container',
        choices: [
          commands.grantAccessForNewUser,
          commands.updateAccessForExistingUser,
          commands.showFileScreen
        ]
    })
    .then((answers) => {
      switch(answers.optionValue){
        case commands.grantAccessForNewUser:
            grantMoreAccess()
            .then((accessSettings) => {
                const userId =  _.first(_.keys(accessSettings));
                updateAccessForUser(container, userId, accessSettings); 
            })
          break;
        case commands.updateAccessForExistingUser:
          selectUserForAccessUpdate(container);
          break;
        case commands.showFileScreen:
          showFileInfo(container.id);
          break;
      }
    })
}

const selectUserForAccessUpdate = (container) =>{
  let userList = [];

  for(let userId in container.access){
    userList.push(userId);
  }

  inquirer.prompt(
      {
        type: 'list',
        name: 'userId',
        message: 'Please select userId for updating Access',
        choices: userList,
        paginated: true,
    })
    .then((answers) => {
        const userPermissions = container.access[answers.userId].permissions;
        grantMoreAccess(userPermissions, answers.userId)
        .then((accessSettings) => {
            updateAccessForUser(container, answers.userId, accessSettings);            
        })
    })
}

const updateAccessForUser = (container, userId, newPermissions) => {

  if(!container.access[userId]){
     container.access[userId] = { }
  }

  container.access[userId] = newPermissions[userId];


  let status = new Spinner('Updating permissions ...')
  status.start();

  securedContainer.update(container.id, { access: container.access })
  .then(() => {
      status.stop();
      showFileInfo(container.id);
  })
  .catch((error) => {
      status.stop();
      logError(error.message);
      showFileInfo(container.id);
  })
}

const drawContainerInfo = (container) => {
    console.log(chalk.green('container id: ' + container.id));
    console.log(chalk.yellow('-- Header --'));
    
    for(let prop in container.header){
      console.log(chalk.yellow(prop)+ ": " + chalk.gray(container.header[prop]));
    }
    console.log(chalk.yellow('--------'));
    console.log(chalk.cyan('-- Type --'));
    console.log(chalk.cyan(container.type));
    console.log(chalk.cyan('--------'));

    console.log(chalk.magenta('-- Access List --'));
    for(let prop in container.access){
      console.log(chalk.green('Access granted to user id: ' + prop)); 
      let dateToShow = container.access[prop].expiration;
      if(dateToShow){
          dateToShow = new Date(dateToShow).toLocaleString();
      }
      console.log(chalk.red('Expire : ' + dateToShow));
      for(let accessProp in container.access[prop].permissions){
          console.log(chalk.magenta(accessProp + ':'));
          for(let accessKey in container.access[prop].permissions[accessProp]){
            console.log(chalk.cyan('\t' + accessKey + ': ') + chalk.magenta(container.access[prop].permissions[accessProp][accessKey]));
          }
      }
    }
}

const showFileInfo = (fileId) => {

  const status = new Spinner('Loading container ...');
  status.start();

  securedContainer.get(fileId)
  .then((container) => {
        status.stop();
        drawContainerInfo(container);
        inquirer.prompt(
        {
          type: 'list',
          name: 'optionValue',
          message: 'Please choose an option',
          choices: [
            commands.updateAccess,
            commands.delete,
            commands.updateContent,
            commands.open,
            commands.homeScreen
          ]
        })
        .then((answers) => {
          switch(answers.optionValue){
            case commands.updateAccess:
              updateContainerAccess(container);
            break;
            case commands.delete:
              deleteContainer(fileId);
            break;
            case commands.updateContent:
              updateContainerContent(fileId);
            break;
            case commands.open:
                openFileWithDefaultProgram(container);
            break;
            case commands.homeScreen:
              homeMenu();
            break;
          }
      });
  })
  .catch((error) => {
    status.stop();
    logError(error.message);
    homeMenu();
  })  
}

const openFileWithDefaultProgram = (container) => {
  try{
      if(container.access[loggedInUserId].permissions.container.download){
        inquirer.prompt(
          {
            type: 'input',
            name: 'path',
            message: 'Enter the path of folder, where to save and open File',
            validate: (value) => {
              if (value.length) {
                try {
                   const isDir = fs.statSync(value).isDirectory();

                    if(isDir) {
                        return true;
                    }
                }
                catch(error) {
                  logError(error.message);
                }
                return 'Please enter valid the path of folder';
              } 
              else {
                return 'Please enter valid the path of folder';
              }
            }
          })
          .then((answers) => {
                let pathToFile = path.join(answers.path, container.header.contentFileName);
                fs.writeFileSync(pathToFile, container.content);
                open(pathToFile);
                showFileInfo(container.id);
          }).catch((error) => {
              logError(error.message);
              showFileInfo(container.id);
          });
      }
      else{
        logError("Sorry, this file can't be opened due to permission restriction. ");
        showFileInfo(container.id);
      }
  }
  catch(error){
    logError(error.message);
    showFileInfo(container.id);
  }
}

const filePathForUpdateInvalid = (fileName, fileId) => {
    inquirer.prompt(
      {
        type: 'list',
        name: 'optionValue',
        message: fileName + ' is not a valid File',
        choices: [
          commands.tryAgain,
          commands.showFileScreen
        ]
    })
    .then((answers) => {
      switch(answers.optionValue){
        case commands.tryAgain:
          updateContainerContent(fileId);
          break;
        case commands.showFileScreen:
          showFileInfo(fileId);
          break;
      }
  });
}

const updateContainerContent = (fileId) => {

 inquirer.prompt(
    {
      type: 'input',
      name: 'path',
      message: 'Enter the path of the File',
      validate: (value) => {
        if (value.length) {
          return true;
        } else {
          return 'Please enter the path of the File';
        }
      }
    })
    .then((answers) => {
        if(fs.existsSync(answers.path)){
          getHeaderAndContentType(true)
          .then((result) => {
              const status = new Spinner('Updating container ...');
              status.start();

              let customOptions = createOptionsObject(result, answers.path);
              customOptions.content = fs.readFileSync(answers.path);

              securedContainer.update(fileId, customOptions )
              .then(() => {
                  status.stop();
                  showFileInfo(fileId);
              })
              .catch((error) => {
                  status.stop();
                  logError(error.message);
                  showFileInfo(fileId);
              })
          })
        }
        else{
          filePathForUpdateInvalid(answers.path, fileId)
        }
    });
}

const showFileById = () =>{
  inquirer.prompt(
    {
      type: 'input',
      name: 'fileId',
      message: 'Enter the ID of the Container you want to view:',
      validate: (value) => {
        if (value.length) {
          return true;
        } 
        else {
            return 'Please enter the ID of the Container you want to view.'; 
        }
      }
  }).then((answers) => {
      showFileInfo(answers.fileId);
  });
}

const pathToFileInvalid = (fileName) => {
    inquirer.prompt(
      {
        type: 'list',
        name: 'optionValue',
        message: fileName + ' is not a valid File',
        choices: [
          commands.tryAgain,
          commands.homeScreen
        ]
    })
    .then((answers) => {
      switch(answers.optionValue){
        case commands.tryAgain:
          loadFileIntoSystem()
        break;
        case commands.homeScreen:
          homeMenu();
        break;
      }
  });
}

const loadFileIntoSystem = () => {
  let pathToFile;
  let options;
  let permissions;

  inquirer.prompt({
      type: 'input',
      name: 'path',
      message: 'Enter the path of the File',
      validate: (value) => {
        if (value.length) {
          return true;
        } else {
          return 'Please enter the path of the File';
        }
      }
  })
  .then((answers) => {
        if(fs.existsSync(answers.path)){
          pathToFile = answers.path;
          getHeaderAndContentType()
          .then((result) => {
              options = createOptionsObject(result, answers.path);
              if(result.grantMoreAccess){
                  grantMoreAccess()
                  .then((accessSettings) => {
                    permissions = accessSettings;
                     addNewContainer(pathToFile, options, permissions);
                  });
              }
              else{
                 addNewContainer(pathToFile, options, permissions);
              }
          })
        }
        else{
          pathToFileInvalid(answers.path);
        }
  });
}

const addNewContainer = (pathToFile, options, permissions) => {
    const status = new Spinner('Loading data into system ...');
    status.start();

    createContainer(pathToFile, options, permissions)
    .then((result) => {
      status.stop();
      homeMenu();
    })
    .catch((error) => {
      status.stop();
      logError(error.message);
      homeMenu();
    });
}

const createOptionsObject = (rawOptions, filepath) => {
  const customOptions = {
    header:{
      headerContent: rawOptions.headerContent,
      contentFileName: path.basename(filepath)
    },
    type: rawOptions.containerType
  }
  return customOptions;
}

const createContainer = (filePath, customOptions, permissions) => {
  return new Promise((resolve, reject) => {

      let data;
      try {
          data = fs.readFileSync(filePath);
      }
      catch(error) {
         reject(error);
      }

      let options = {
        header: customOptions.header,
        type: customOptions.type
      }

      if(permissions) {
        options.access = permissions;
      }
      
      securedContainer.create(data, options)
      .then(() => {
         resolve(true);
      })
      .catch((error) => {
        reject(error);
      })
  });
} 

const getHeaderAndContentType = (doNotAskAboutAccess) => {
      let questions  = [
          {
            type: 'input',
            name: 'headerContent',
            message: 'Enter header content here:',
            validate: (value) => {
              if (value.length) {
                return true
              } else {
                return 'Please enter header content';
              }
            },
          },
          {
            type: 'input',
            name: 'containerType',
            message: 'Enter type here:',
          }
      ];

      if(!doNotAskAboutAccess){
          questions.push({
              type: 'confirm',
              name: 'grantMoreAccess',
              message: 'Whould you like to grant (more) Access ?',
              default: false
          });
      }

     return inquirer.prompt(questions);
}

const availablePermissions  = {
  access:{
    view: 'view',
    modify: 'modify'
  },
  container:{
    decrypt: 'decrypt',
    download: 'download',
    modifyType:'modifyType',
    upload: 'upload'
  }
}

const getExistingAccessModifiers = (permissions) => {
  let permissionsList = [];
  for(let prop in permissions){
    permissionsList.push(new inquirer.Separator('-- '+ prop +' permissions --'));
    for(let modifier in permissions[prop]){
        permissionsList.push({name: modifier, checked: permissions[prop][modifier]});
    }
  }
  return permissionsList;
}

const getAccessModifiers = () => {
  let permissionsList = [];

  permissionsList.push(new inquirer.Separator('-- access permissions --'));
  permissionsList.push(availablePermissions.access.view);
  permissionsList.push(availablePermissions.access.modify);
  permissionsList.push(new inquirer.Separator('-- container permissions --'));
  permissionsList.push(availablePermissions.container.decrypt);
  permissionsList.push(availablePermissions.container.download);
  permissionsList.push(availablePermissions.container.modifyType);
  permissionsList.push(availablePermissions.container.upload);

  return permissionsList;
}

const grantMoreAccess = (existingPermissions, userId) => {
    return new Promise((resolve) => {
      let questions = [
      {
        type: 'input',
        name: 'userId',
        message: 'Enter user id to be granted access:',
        validate: (value) => { 
          if (value.length) {
            return true;
          } else {
            return 'Please enter userId';
          }
        }
      },
      {
        type: 'input',
        name: 'expirationDate',
        message: 'Enter expire time in folowing format YYYY-MM-DD HH:mm [optional field]',
        validate: (value) => {
          if(value.length <= 0){
            return true;
          }
          else{
              if(moment(value, 'YYYY-MM-DD HH:mm').isValid())
              {
                  if(moment(value, 'YYYY-MM-DD HH:mm').isSameOrBefore(new Date().getTime())){
                      return 'Please enter valid date or leave it empty'
                  }
                  else{
                      return true;
                  }
              }
              else{
                return 'Please enter valid date format or leave it empty';
              }
          }
       }
      },
      {
        type:'checkbox',
        name: 'permissions',
        message: 'Please select permissions ',
        choices: existingPermissions ? getExistingAccessModifiers(existingPermissions) : getAccessModifiers()
      }];

      if(existingPermissions){
        questions.splice(0,1);
      }

      inquirer.prompt(questions)
      .then((answers) => {
        let accessPermissions = getPermissionsProps(answers.permissions, availablePermissions.access);
        let containerPermissions = getPermissionsProps(answers.permissions, availablePermissions.container);
        let permissions = {};
        const userIdToSetPermissionsFor = existingPermissions ? userId : answers.userId;

        if(!permissions[userIdToSetPermissionsFor]){
          permissions[userIdToSetPermissionsFor] = {};
        }

        permissions[userIdToSetPermissionsFor] = {
          permissions:{
            access: accessPermissions,
            container: containerPermissions
          }
        }

        if(answers.expirationDate){
            permissions[userIdToSetPermissionsFor].expiration = moment(answers.expirationDate, 'YYYY-MM-DD HH:mm').toDate();
        }

        resolve(permissions)
      });
    });
}

const getPermissionsProps = (arrayOfSelectedProps, permissionsObject) => {
  let permissions = {};
  for(let prop in permissionsObject) {
        permissions[permissionsObject[prop]] = _.includes(arrayOfSelectedProps, permissionsObject[prop]) ? true: false;
  }
  return permissions;
}

const homeMenu = () => {
  inquirer.prompt(
  {
    type: 'list',
    name: 'optionValue',
    message: 'Please choose an option',
    choices: [
      commands.loadFileIntoSystem,
      commands.showFileById,
      commands.showFilesInOfs,
      commands.processEvents,
      commands.logout,
      commands.exit
    ],
    pageSize: 6
  })
  .then((answers) => {
    switch(answers.optionValue){
      case commands.loadFileIntoSystem:
        loadFileIntoSystem();
        break;
      case commands.showFileById:
        showFileById();
      break;
      case commands.showFilesInOfs:
        showFilesInOfs();
      break;
      case commands.processEvents:
        processEvents();
      break;
      case commands.logout:
        logOut();
      break;
      case commands.exit:
        exitFromApp();
      break;
    }
  });
}

const topMenu = () =>{
  inquirer.prompt(
  {
    type: 'list',
    name: 'optionValue',
    message: 'Please choose an option',
    choices: [
      commands.login,
      commands.exit
    ]
  })
  .then((answers) => {
    switch(answers.optionValue){
      case commands.login:
        loginWithCredentials();
        break;
      case commands.exit:
        exitFromApp();
        break;
    }
  });
}

const initApp = () => {
  clear();
  console.log(
    chalk.cyan(
      figlet.textSync('Absio', { horizontalLayout: 'full' })
    )
  );
  console.log(chalk.cyan('Secured Container CRUD Utility\n'));
  topMenu();
};

initApp();