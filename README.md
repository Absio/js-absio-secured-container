# Absio Secured Container

Protect your application's sensitive data with Absio's Secured Containers.

This module is currently in **Beta** testing.  Please [contact us](#obtaining-an-api-key) if you would like to join this **Beta** testing.

## Index

* [Overview](#overview)
* [Getting Started](#getting-started)
* [Usage](#usage)
* [Support and Bug Reporting](#support-and-bug-reporting)
* [License Agreement](#license-agreement)
* [API](#api)

## Overview
We use AES256 [encryption](#encryption) with unique keys for each Absio Secured Container to protect your application's data.

### Asynchronous
* All Absio Secured Container functions return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
  * The standard [`.then()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then) and [`.catch()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) methods can be used to handle the promises.
  * Execute multiple asynchronous Absio Secured Container methods in parallel using [`Promise.all()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) or [`Promise.race()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race).
* Optionally use the async-await syntax enabled by [Babel](https://babeljs.io/) as shown in the [Usage](#usage) section.
* If this prevents you from using Absio Secured Containers in your application, then please [contact us](#support-and-bug-reporting).

### Users
* A user is an entity that has its own set of private keys.  
* Create users with the [`register()`](#registerpassword-reminder-passphrase---userid) function that returns a User ID.
* A User ID is the value used represent the user entity.
* A user's public keys are registered with an Absio API Server.
  * Public keys are publicly available to other users for granting access to containers.
  * Public keys are used by the server to validate user actions.
* Each user can [create](#createcontent-options---containerid) Absio Secured Containers that are uniquely [encrypted](#encryption).
* Optionally a user can grant other users [access](#container-object) to an Absio Secured Container and add unique permissions or lifespan controls.

### Key File
* A [user's](#users) Key File is an AES256 [encrypted](#encryption) file containing private keys and password reset.
* A [user's](#users) password is used to encrypt their private keys.
* A Key File contains both signing and derivation private keys.
* A passphrase can be provided to synchronize a Key File between devices and enable a secure password reset.

### Encryption
* A user's private keys are stored in an encrypted [Key File](#key-file).
  * The [Key File](#key-file) is encrypted with AES256 using a key derived from the user's password.
  * The encryption key is derived using the Password Based Key Derivation Function 2 (PBKDF2).
* Every Absio Secured Container has a unique set of secret keys.
  * Secret Keys are stored encrypted and used to securely access the container.
  * HMAC-SHA256 keys are used for content validation to mitigate content tampering.
  * AES256 keys are used to individually encrypt the header and content of the Absio Secured Container.
* The secret keys for an Absio Secured Container are uniquely encrypted for each user that can access the container.
  * This encryption of the secret keys uses Static-ephemeral Diffie-Hellman Key Exchange (DHKE) based upon a user's public derivation key.
  * This process encrypts the secret keys such that they can only be decrypted with the user's corresponding private derivation key.
  * Encrypted container keys are signed with the creator's private keys to mitigate Man-in-the-Middle attacks.


## Getting Started
After obtaining an API Key, use the [Quick Start](#quick-start) to quickly get started.

### Obtaining an API Key
This SDK requires a valid API Key that should be passed into the [initialize()](#initializeserverurl-apikey-options) method. Obtain an API Key by [contacting us here](https://www.absio.com/contact) or sending an email to [sales@absio.com](mailto:sales@absio.com).

### Module Import Support
We use [Rollup](https://github.com/rollup/rollup) to produce unique CommonJS and ES6 bundles for node and browser.  Our goal is to make using our SDK as easy as possible. [Contact us](#support-and-bug-reporting) if you experience any issues or have suggestions to improve this.

The `module` and `jsnext:main` fields of the `package.json` reference the CommonJS and ES6 specific bundles for Node.js.  The `browser` field of the `package.json` map to the corresponding browser bundles.  The browser bundles contains all external dependencies needed for execution, whereas the Node.js version does not.  

``` javascript
// ES6
import { register, create, initialize } from 'absio-secured-container';
```

``` javascript
// Node.js/CommonJS
var securedContainer = require('absio-secured-container');
```

If your project does not use a module bundling tool like [Browserify](http://browserify.org/) or [Rollup](https://github.com/rollup/rollup), then the dist/browser/index.min.js bundle can be imported directly in HTML and adds a `window.securedContainer` global.

``` html
<script src="node_modules/absio-secured-container/dist/browser/index.min.js"></script>
```

### Quick Start

The `userId`, `password`, and `passphrase` used below are the credentials for two existing users.  To simplify the example the users are called Alice and Bob. [Users](#users) can be created with the [`register()`](#registerpassword-reminder-passphrase---userid) method. For more details see the [Users](#users) section above.

1. Installation:

   ```
   npm install absio-secured-container
   ```

2. Import as regular module and initialize:

   ``` javascript
   var securedContainer = require('absio-secured-container');
   ```

3. Initialize the module and log in with an account:  

   ``` javascript
   await securedContainer.initialize('your.absioApiServer.com', yourApiKey);
   await securedContainer.logIn(alicesId, alicesPassword, alicesPassphrase);
   ```

4. Start creating Absio Secured Containers:

   ``` javascript
   const sensitiveData = new Buffer('Sensitive Data...000-00-0000...');
   const containerId = await securedContainer.create(sensitiveData, { access: [bobsId] });
   ```

5. Securely access these Absio Secured Containers from another system:

   ``` javascript
   await securedContainer.logIn(bobsId, bobsPassword, bobsPassphrase);

   // Access the container with the Container ID returned from create() or a Container Event.
   const container = await securedContainer.get(knownContainerId);
   ```

## Usage
The following usage examples require that the general setup in [Getting Started](#getting-started) has been completed.

#### Create
This is an example of creating a container that contains sensitive data.

``` javascript
const sensitiveData = new Buffer('Sensitive Data...000-00-0000...');

// Optional: Define a custom header that is bound to the content with encryption.
const containerHeader = {
    recordCount: 500,
    applicationEnforceableMetadata: {
        allowPrint: false,
        allowExport: false
    }
};

// Optional: Grant access to the container with permissions and/or expiration.
const containerAccess = {
    'userId': {
        expiration: new Date(2022),
        permissions: {
            access: {
                view: true
            },
            container: {
                decrypt: true,
                download: true
            }
        }
    }
};

// Create the container
const containerId = await securedContainer.create(sensitiveData, {
    access: containerAccess,
    header: containerHeader
});
```

#### Get

This demonstrates the ways to get containers.

``` javascript
// Get the content with a known ID
const container = await securedContainer.get(knownContainerId);

// The API Server creates an event for when a container is new, updated, deleted, or first accessed.
const latestEvents = await securedContainer.getLatestEvents();

// Events contain the corresponding container ID for getting the related container.
const eventContainerId = latestEvents[0].containerId;
const containerFromEvent = await securedContainer.get(eventContainerId);

// Optionally can be filtered to return only the latest events of a given container type and/or event action.
const latestUpdatedOfType = await securedContainer.getLatestEvents({
    containerType: 'exampleType',
    eventAction: 'updated'
});
```


#### Update

The [update()](#updateid-options) method can be used to update fields specified in the options.  Only the fields specified will be updated.  To clear a value, this must be explicitly set.

``` javascript
// Get the container securely.
const container = await securedContainer.get(knownContainerId);

// Add access with full permissions and no expiration.
container.access['userIdForAddedPermission'] = {
    permissions: {
        access: {
            view: true,
            modify: true
        },
        container: {
            decrypt: true,
            download: true,
            modifyType: true,
            upload: true
        }
    }
};

// Update the container.
await securedContainer.update(knownContainerId, {
    access: container.access,
    content: new Buffer('updated content'),
    header: {},
    type: 'redefinedContainerType'
});
```

This shows redefining only the type of a container with known ID.  The type is the only field of the container that will be changed in this update call.

``` javascript
await securedContainer.update(knownContainerId, { type: 'redefinedContainerType' });
```

#### Delete

The container with the specified ID will be permanently deleted.

``` javascript
await securedContainer.deleteContainer(knownContainerId);
```

## Support and Bug Reporting

Please [contact us](https://github.com/Absio/absio-secured-container/issues) if you experience any issues using this module.  Use the project's [Github issue tracker](https://github.com/Absio/absio-secured-container/issues) to report all issues.

## License Agreement

See the LICENSE file of the module.

## API
* [Container](#container)
  * [Container Object](#container-object)
  * [Container Event Object](#container-event-object)
  * [create(content[, options])](#createcontent-options---containerid)
  * [deleteContainer(id)](#deletecontainerid)
  * [get(id[, options])](#getid-options---container)
  * [getLatestEvents([options])](#getlatesteventsoptions-----container-event--)
  * [update(id[, options])](#updateid-options)
* [General](#general)
  * [hash(stringToHash) ](#hashstringtohash---hashedstring)
  * [initialize(serverUrl, apiKey[, options])](#initializeserverurl-apikey-options)
* [User Accounts](#user-accounts)
  * [changeBackupCredentials(currentPassphrase, currentPassword, newReminder, newPassphrase)](#changebackupcredentialscurrentpassphrase-currentpassword-newreminder-newpassphrase)
  * [changePassword(currentPassphrase, currentPassword, newPassword)](#changepasswordcurrentpassphrase-currentpassword-newpassword)
  * [deleteUser()](#deleteuser)
  * [getBackupReminder(userId)](#getbackupreminderuserid---reminder-for-the-backup-passphrase)
  * [logIn(userId, password, passphrase[, options])](#loginuserid-password-passphrase-options)
  * [logOut()](#logout)
  * [register(password, reminder, passphrase)](#registerpassword-reminder-passphrase---userid)
  * [resetPassword(userId, passphrase, newPassword)](#resetpassworduserid-passphrase-newpassword)

## Container

### Container Object
``` javascript
{
    access: {
        userIdWithAccess: {
            expiration: <null or Date()>,
            keyBlob: 'Base64EncodedStringOfEncryptedKeyBlob'
            permissions: {
                access: {
                    view: true,
                    modify: false,
                },
                container: {
                    decrypt: true,
                    download: true,
                    modifyType: false,
                    upload: false
                }
            }
        },
        ...
    },
    content: Buffer(),
    created: Date(),
    header: {},
    id: 'container ID',
    modified: Date(),
    modifiedBy: 'user ID that modified',
    owner: 'user ID of owner',
    securedLength: 12345,
    type: 'container type'
}
```

---

### Container Event Object

``` javascript
{
  action: "Always one of 'accessed', 'added', 'deleted', or 'updated'.",
  changes : "Information about what has changed. For example: { fieldThatChanged: 'updatedValue' }",
  appName: "The name of the application responsible for the action, optionally specified in the initialize() method.",
  date: "ISO formatted date string corresponding to when the event occurred.",
  eventId: "An integer ID value for the event.",
  containerId: "The ID for container that this event relates to.",
  lastModified: "ISO formatted date string corresponding to when the the container was last modified.",
  containerType: "The type of the container as specified upon creation or last update.",
  relatedUserId: "If this event relates to another user, this field will be set to that user's GUID.  Currently only applies to 'accessed' actions.",
}
```

---

### `create(content[, options])` -> `'containerId'`

Creates an encrypted container with the provided `content`. The container will be uploaded to the API server and access will be granted to the specified users.  

The container will never expire for the owner.  The owner is automatically granted full permission to the container, unless a limited permission is defined in `access` for the owner.

Returns a Promise that resolves to the new container's ID.

Throws an Error if the connection is unavailable or an access userId is not found.

Parameter   | Type  | Description
:-----------|:------|:-----------
`content` | [Buffer](https://nodejs.org/dist/latest-v6.x/docs/api/buffer.html) | Node.js [Buffer](https://nodejs.org/dist/latest-v6.x/docs/api/buffer.html) for the data to be stored in the container.
`options` | Object [optional] | See table below.

Option | Type  | Default | Description
:------|:------|:--------|:-----------
`access` | Array of user IDs (String) or [Access Information](#access-information-object) for setting permissions and expiration | `{}` | Access will be granted to the users in this Array with any specified permissions or expiration.
`header` | Object | `{}` | This will be serialized with `JSON.Stringify()`, independently encrypted, and can be retrieved prior to downloading and decrypting the full content. Use this to store any data related to the content.
`type` | String | `null` | A string used to categorize the container on the server.

### Access Information Object
``` javascript
{
    'userIdGrantedAccess': { // If an array of user IDs is specified, then these are the default permissions.
        expiration: null, // This will never expire, define a Date for this access to expire.
        permissions: {
            access: {
                view: true,
                modify: false,
            },
            container: {
                decrypt: true,
                download: true,
                modifyType: false,
                upload: false
            }
        }
    }
}

```

---

### `deleteContainer(id)`

Deletes the container from the server and revokes access for all users, unless specified in options.

Returns a Promise.

Throws an Error if the ID is not found or a connection is unavailable.

Parameter   | Type  | Description
:------|:------|:-----------
`id` | String | The ID of the container to delete.

---

### `get(id[, options])` -> [container](#container-object)

Gets the Absio Secured Container and decrypts it for usage. By default it downloads the latest version of the container and includes the content.  See the options for overriding this behavior.

Returns a Promise that resolves to a [container](#container-object)

Throws an Error if the container or connection is unavailable.

Parameter   | Type  | Description
:------|:------|:-----------
`id` | String | The ID of the container to update
`options` | Object [optional] | See table below.

Option | Type  | Default | Description
:------|:------|:--------|:-----------
`includeContent` | boolean | `true` | Set to `false` to prevent downloading and decrypting content.  This is helpful when the content is very large.

---

### `getLatestEvents([options])` -> [`[ { Container Event } ]`](#container-event-object)

Gets all new container events since the last call of this method, unless specified with `startingEventId` in `options`. Options can be used to change the criteria for the container events returned by this method.

Returns a Promise that resolves to an Array of [container events](#container-event-object).

Throws an Error if the connection is unavailable.

Parameter   | Type  | Description
:------|:------|:-----------
`options` | Object [optional] | See table below.

Option | Type  | Default | Description
:------|:------|:--------|:-----------
`containerType` | String | `undefined` | Only events of the specified container type will be returned. Type is a string used to categorize containers on the server.
`containerId` | String | `undefined` | Filter the results to only include events related to the specified container ID.
`eventAction` | String | `'all'` | All container actions are included in the results by default. Possible values are: `'all'`, `'accessed'`, `'added'`, `'deleted'`, or `'updated'`
`startingEventId` | Number | `-1` | 0 will start from the beginning and download all events for the current user with the specified criteria.  Use the `eventId` field of the [Container Event](#container-event-object) to start from a known event. -1 will download all new since last call.

---

### `update(id[, options])`

Updates the container with the specified ID. At least one optional parameter must be provided for an update to occur.

Returns a Promise.

Throws an Error if the connection is unavailable or an ID is not found.

Parameter   | Type  | Description
:------|:------|:-----------
`id` | String | The ID of the container to update
`options` | Object [optional] | See table below.

Option | Type  | Default | Description
:------|:------|:--------|:-----------
`access` | Array of user IDs (String) or [accessInformation](#access-information-object) for setting permissions and expiration | `undefined` | The access granted to the container on upload. If not specified the currently defined access will be left unchanged.
`content` | [Buffer](https://nodejs.org/dist/latest-v6.x/docs/api/buffer.html) | `undefined` | The content to update.
`header` | Object | `undefined` | This will be serialized with `JSON.stringify()`, independently encrypted, and can be retrieved prior to downloading and decrypting the full content. Use this to store any data related to the content.
`type` | String | `undefined` | A string used to categorize the container on the server.

---

## General

### `hash(stringToHash)` -> `'hashedString'`
Produces a sha256 hash of the specified String.

Returns a string with the hashed value.

Parameter   | Type  | Description
:------|:------|:-----------
`stringToHash` | String | The string used for producing the hash.

---

### `initialize(serverUrl, apiKey[, options])`

This method must be called first to initialize the module. See the [Obtaining an API Key](#obtaining-an-api-key) section for more information about the API Key parameter.

Returns a Promise.

Parameter   | Type  | Description
:------|:------|:-----------
`serverUrl` | String | The URL of the API server.
`apiKey` | String | The API Key is required for using the API server.  See the [Obtaining an API Key](#obtaining-an-api-key) section for more information about the API Key parameter.
`options` | Object [optional] | See table below.

Option | Type  | Default | Description
:------|:------|:--------|:-----------
`applicationName` | String | `''` | The API server uses the application name to identify different applications.
`rootDirectory` | String | `'./'` | By default the root directory for storing data will be the current directory.  Only encrypted data is stored here.

---

## User Accounts

### `changeBackupCredentials(currentPassphrase, currentPassword, newReminder, newPassphrase)`

Change the backup credentials for the account.  Use a secure value for the passphrase as it can be used to reset the user's password.

Returns a Promise.

Throws an Error if the `currentPassphrase` or `currentPassword` is incorrect.  

Parameter   | Type  | Description
:-----------|:------|:-----------
`currentPassphrase` | String | The `currentPassphrase` setup during registration of the account.
`currentPassword` | String | The current password for the user.
`newReminder` | String | The new backup reminder for the user's passphrase.  The reminder is publicly available in plain text.  Do not include sensitive information or wording that allows the passphrase to be easily compromised.
`newPassphrase` | String | The new backup passphrase for the user.  Use a secure value for this.  This can be used to reset the password for the user's account.

---

### `changePassword(currentPassphrase, currentPassword, newPassword)`

Change the password for the current user.  The current `passphrase` is required for updating the backup.

Returns a Promise.

Throws an Error if the `currentPassphrase` or `currentPassword` is incorrect.

Parameter   | Type  | Description
:-----------|:------|:-----------
`currentPassphrase` | String | The `currentPassphrase` is set up during registration of the account.  This is used to reset the password.
`currentPassword` | String | The current password for the user.
`newPassword` | String | The new password for the user.

---

### `deleteUser()`

**Important:** All data for the current user will be deleted from the server and obfuscated file system.  This user will be permanently deleted.  Take caution using this method as there is no recovery mechanism.

Returns a Promise.

Throws an exception if the connection is unavailable.

---

### `getBackupReminder(userId)` -> `'Reminder for the backup passphrase'`

Gets the publicly accessible reminder for the user's backup passphrase.  If no ID is provided, the user ID for the currently logged in user will be used.

Returns a Promise that resolves to the user's reminder.

Throws an exception if the connection is unavailable.

Parameter   | Type  | Description
:-----------|:------|:-----------
`userId` | String | A string ID representing the user.

---

### `logIn(userId, password, passphrase[, options])`

Decrypts the key file containing the user's private keys with the provided password.  If the decryption succeeds, then a private key will be used to authenticate with the server.  If the key file is not cached locally, the `passphrase` is used to download the key file.

Returns a Promise.

Throws an Error if the `password` or `passphrase` are incorrect, the `userId` is not found, or a connection is unavailable. In the last case the server authentication will be attempted again automatically when any method is called requiring a connection.

Parameter   | Type  | Description
:-----------|:------|:-----------
`userId` | String | The userId value is returned at registration.  Call `register()` to register a user.
`password` | String | The password used to decrypt the key file.
`passphrase` | String | The `passphrase` is used retrieve the key file from the server.

Option | Type  | Default | Description
:------|:------|:--------|:-----------
`cacheLocal` | boolean | `true` | By default we cache the encrypted key file in the local file system for offline access and greater efficiency.  Set to `false` to prevent this from being cached.

---

### `logOut()`

Clears any user data cached in memory after awaiting any pending background operations. In a Node.js environment this closes the database.

Returns a Promise.

---

### `register(password, reminder, passphrase)` -> `'userId'`

**Important:** The `password` and `passphrase` should be kept secret.  We recommend using long and complex values with numbers and/or symbols.  Do not store them publicly in plain text.

Generates private keys and registers a new user on the API server.  This user's private keys are encrypted with the `password` to produce a key file.  The `passphrase` is used to reset the password and download the key file.

Returns a Promise that resolves to the new user's ID.

Throws an Error if the connection is unavailable.

Parameter   | Type  | Description
:-----------|:------|:-----------
`password` | String | The password used to encrypt the key file.
`reminder` | String | The reminder should only be used as a hint to remember the `passphrase`. This string is stored in plain text and should not contain sensitive information.
`passphrase` | String | The `passphrase` can be used later to reset the password or to allow logging in from another system.

---

### `resetPassword(userId, passphrase, newPassword)`
If a user's password is forgotten, then use this method to reset a user's password. Call `getBackupReminder(userId)` to get the reminder for the `passphrase`.

Returns a Promise.

Throws an Error if the `passphrase` is incorrect or user ID is not found.  If the Key File is not cached locally, then an Error will be thrown if the connection is unavailable.

Parameter   | Type  | Description
:-----------|:------|:-----------
`userId` | String | A string ID representing the user.
`passphrase` | String | The `passphrase` is set up during registration of the account.  This is used to reset the password.
`newPassword` | String | The new password for the user.
