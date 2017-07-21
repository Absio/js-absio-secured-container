# Absio Secured Container

Protect your application's sensitive data with Absio Secured Containers.

This module is currently in **Beta**.  Please [contact us](#obtaining-an-api-key) if you would like to join this **Beta** program.

## Index

* [Overview](#overview)
* [Getting Started](#getting-started)
* [Usage](#usage)
* [Support and Bug Reporting](#support-and-bug-reporting)
* [License Agreement](#license-agreement)
* [API](#api)
* [Examples](#examples)

## Overview

### Absio Technology

Absio offers a set of tools that developers can use to protect application data throughout its lifecycle—from creation to deletion, everywhere it exists—without having to manage keys, add hardware, increase latency or rely on a third-party service for access to data. Absio’s cross-platform, Serverless Encryption technology automatically encrypts any type of unstructured data object (file or stream) generated or processed by an application prior to being stored or transmitted, each with its own unique key. Data content keys are uniquely encrypted for each user given access to the data, allowing user-specific access and permissions to be added or revoked at any time without needing to re-encrypt the data object. All key generation and management is performed automatically on the device running the application and not by a central key server. Encrypted data objects and content keys can be stored locally in an obfuscated file system to reduce network latency impacts and enable local content to be decrypted and encrypted while offline. Absio technology automatically obfuscates file names and types and randomizes the folder structure, enabling keys and content to be stored locally without putting data at risk.

In addition, developers can use Absio tools to associate classification, audit history, policy and other metadata from any source, enabling software applications to consume this information and 1) process and update metadata without providing access to, or decrypting content, and/or 2) restrict who, how, where, and for how long decrypted content can be used. For data sharing, Absio technology provides an automated public key infrastructure, and a portable (installable anywhere), extensible, zero-knowledge server application for authentication, content/key exchange, sync, and backup.

### Absio Technology Components

The Absio developer toolset consists of cross platform-capable software development kits (SDKs), each with a simple application programming interface ([API](#api)), and a portable server application ([Absio API Server Application](#absio-api-server-application)). The Absio SDK is currently available in JavaScript (Browser and Node.js) and C#. SDKs for Swift, Java and Python will be available late summer 2017. The Absio Server Application is written in Python and can be deployed by the organization via a Python package, RPM, VM or Docker container. All communication with the Absio Server Application is handled by the SDK methods, so no separate API calls are required. 

### Goals

Several goals were identified and met in the creation of Absio's developer toolset: 
* Simple [API](#api)
* Flexible architecture
* Serverless Encryption - key generation and encryption at the application
* Automatic key generation and management
* Bound metadata - encrypted with content (See the header portion of an [Absio Secured Container](absio-secured-containers) for more details)
* Associated metadata - stored in database and related to content (See the type field under the [Containers](#containers) section for more details)
* Offline access (See [Obfuscating File System](#obfuscating-file-system))
* Strong, safe and verifiable [encryption](#encryption)

### Absio API Server Application

* The Absio API Server Application is used for identity management in the Absio ecosystem through usage and distribution of public keys.
* [Users](#users) are registered through the SDK and their public keys are stored on the Absio API Server Application, accessible to all other registered Users.
* Container access is stored on the Absio API Server Application.
* The Absio API Server Application tracks and distributes Container-related events when [Container](#containers) are:
  * Accessed
  * Created
  * Deleted (access or content removed)
  * Updated

### Absio Secured Containers

* An Absio Secured Container (ASC) is the fundamental encrypted data structure in the Absio ecosystem.
  * A [Container's](#containers) header and content are part of the encrypted data.
    * Header
      * The header is any information about the content that is private or sensitive (should be encrypted) or that needs to remain with the data wherever it goes.
      * The header will be serialized with `JSON.stringify()`. Thus, it is optimally represented as JSON.
      * The header can be independently decrypted without downloading and/or decrypting the content.
    * Content
      * The content is the data payload of the [Container](#containers).
      * While there are no limitations on maximum container size, your performance and experience may vary depending on platform limitations.

### Containers

* A Container is the data construct when retrieving data from the SDK.
  * `access` is a dictionary of User IDs to access information.  Access information describes a [User's](#users) access to the Container. See the [Access Information Object](#access-information-object) section for more details.
    * `expiration` is when the [User's](#users) access to the Container will expire.
    * `keyBlob` is the [User's](#users) encrypted key for decrypting the content and header (from an Absio Secured Container into the Container structure).  The `keyBlob` must be present to decrypt the Absio Secured Container.
    * `permissions` are the access and Container rules for the [User](#users).  Permissions pertain to a [User's](#users) ability to perform operations against the [Absio API Server Application](#absio-api-server-application).  See the [permissions](possible-permissions-in-an-access-information-object) section below for more details.
      * Access-related permissions
	        * `view` - If true, the `access` list will contain all [User](#users) access information, otherwise it will only contain the logged in [User's](#users) access.
	        * `modify` - If true, this [User](#users) is allowed to modify the access list.  This should be false if the view permission is false.
      * Container-related permissions
	        * `decrypt` - If true, this [User](#users) will have a valid `keyBlob` field in the access. The `keyBlob` must be present to decrypt the [Absio Secured Container](#absio-secure-containers). 
	        * `download` - If true, the download URL for the Absio Secured Container will be returned. The Container cannot be downloaded from the Absio API Server Application without this permission. 
	        * `viewType` - If true, the Container type will be returned from the [Absio API Server Application](#absio-api-server-application).
	        * `modifyType` - If true, the [User](#users) is allowed to modify the type of the Container.
	        * `upload` - If true, the [User](#users) is allowed to update the header and content of the Container.  Updating the header and content will cause the [Absio Secured Container](#absio-secure-containers) to be re-keyed. The `upload` permission should not be added without the `view` permission, or a User will not be able to access the Container.
      * Known permission error cases:  Below are some permissions states that may have adverse effects.
	        * `view` is `false` and `modify` is `true`.  The [User](#users) can update the access list, but will not know the other [Users](#users) with current access.  Thus, the update could potentially remove all access from the current access list (aside from the User performing the operation).
	        * `view` is `false` and `upload` is `true` and `modify` is `true`.  The [User](#users) can update the access list and content, but will not know the other [Users](#users) with current access.  Thus, the update could potentially remove all access from the current access list (aside from the User performing the operation).
	        * `view` is `true` and `upload` is `true` and `modify` is `false`.  This operation will be rejected by the [Absio API Server Application](#absio-api-server-application).  Since uploading content requires re-keying the data, all access must be updated (each User with access will get a new `keyBlob`).  Since they cannot `modify` access, it will be rejected.
	        * `upload` is `false`.  Calls to [update()](#updateid-options) will be rejected by the [Absio API Server Application](#absio-api-server-application). 
	        * `upload` is `true` and `modifyType` is `false`.  Calls to [update()](#updateid-options) that include the `type` will be rejected by the Absio API Server Application.
	        * `download` is `false` or `decrypt` is `false`. If the data is not cached locally in the [OFS](#obfuscating-file-system), calls to [get()](#getid-options---container) will return a [Container](#containers) with `content` and `header` null.
  * `content` is the decrypted data payload (decrypted from the Absio Secured Container using the User's `keyBlob`).  See the [Absio Secured Containers](#absio-secure-containers) section for more details.
  * `header` is the decrypted header (decrypted from the Absio Secured Container using the User's `keyBlob`).  The header is treated as JSON.  See the [Absio Secured Containers](#absio-secure-containers) section for more details.
  * `type` is a string used to categorize the Container on the [Absio API Server Application](#absio-api-server-application).  The type is not stored encrypted (the database can be encrypted if desired).  It can be any string.  It can be used to process Container events without needing to download and decrypt the Container.
  * Other Fields
    * `created` is the date/time a Container was created in ISO-8601 format.
    * `id` is the unique ID of the Container.  All Container operations are performed using the `id`.
    * `modifiedAt` is the date/time the Container was last modified in ISO-8601 format.
    * `modifiedBy` is the ID of the User that last modified the Container.
    * `createdBy` is the ID of the User that created the Container.
    * `length` is the length (in bytes) of the encrypted [Absio Secured Container](#absio-secure-containers).

### Users

* A User is an entity with a set of private keys.
* Create Users with the [`register()`](#registerpassword-reminder-passphrase---userid) function that returns a User ID.
* A User ID is the value used to represent the User entity.
* A User's public keys are registered with the [Absio API Server Application](#absio-api-server-application).
  * Public keys are publicly available to other Users for granting access to Containers.
  * Public keys are used by the [Absio API Server Application](#absio-api-server-application) to validate User actions.
* Each [User](#users) can [create](#createcontent-options---containerid) [Absio Secured Containers](#absio-secure-containers) that are uniquely [encrypted](#encryption).
* Optionally, a User can grant other Users [access](#container-object) to an [Absio Secured Container](#absio-secure-containers) and add unique permissions or lifespan controls.

### Key File

* A [User's](#users) Key File is an AES256 [encrypted](#encryption) file containing private keys and password reset information.
* A [User's](#users) password is used to encrypt their private keys.
* A Key File contains both signing and derivation private keys.
* A passphrase can be provided to synchronize a Key File between devices and enable a secure password reset.
* A Key File can optionally be stored locally in the [Obfuscating File System](#obfuscating-file-system).
* By default, User Key Files are backed up on the [Absio API Server Application](#absio-api-server-application).

### Obfuscating File System

If the application using the SDK supports file storage (Node.js typically does, whereas JavaScript in the browser has limited file storage), then the SDK can be used for local storage.  The local storage acts as a cache allowing for offline access of data, as well improved performance (no need to request the keys and content from the [Absio API Server Application](#absio-api-server-application)).  Local storage is performed in the Obfuscating File System (OFS).  The OFS creates random, nonsensical paths within the root directory for all files.  This serves to remove any identifiable attributes (file name and associated content), ruining the economics of an attempt to target specific files for brute-force decryption.  Optionally, the content within the OFS can be segregated by User ID.  See the [initialize()](#initializeserverurl-apikey-options) method for more about the flag for setting up data segregation.

### Encryption

* A [User's](#users) private keys are stored in an encrypted [Key File](#key-file).
  * The [Key File](#key-file) is encrypted with AES256 using a key derived from the [User's](#users) password.
  * The encryption key is derived with Password Based Key Derivation Function 2 (PBKDF2).
* Every [Absio Secured Container](#absio-secure-containers) has a unique set of secret keys.
  * HMAC-SHA256 digests are used for content validation to mitigate content tampering.
  * AES256 keys are used to individually encrypt the header and content of the [Absio Secured Container](#absio-secure-containers).
* The secret keys for an [Absio Secured Container](#absio-secure-containers) are uniquely encrypted for each [User](#users) that can access the [Container](#containers).
  * This encryption of the secret keys uses Static-ephemeral Diffie-Hellman Key Exchange (DHKE) based upon a [User's](#users) public derivation key.
  * This process encrypts the secret keys such that they can only be decrypted with the [User's](#users) corresponding private derivation key.
  * Encrypted [Container](#containers) keys are signed with the creator's private keys to mitigate Man-in-the-Middle attacks.


## Getting Started

After [Obtaining an API Key](#obtaining-an-api-key), reference the [Quick Start](#quick-start) section to begin adding [Absio Secured Containers](#absio-secure-containers) to your application.

### Obtaining an API Key

The Absio SDK requires a valid API Key that must be passed into the [initialize()](#initializeserverurl-apikey-options) method. Obtain an API Key by [contacting us here](https://www.absio.com/contact) or sending an email to [sales@absio.com](mailto:sales@absio.com). An API key should be considered private and protected as such.

### Asynchronous

* All [Absio Secured Container](#absio-secure-containers) functions return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
  * The standard [`.then()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then) and [`.catch()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) methods can be used to handle the promises.
  * Execute multiple asynchronous Absio Secured Container methods in parallel using [`Promise.all()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) or [`Promise.race()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race).
* Optionally use the async-await syntax enabled by [Babel](https://babeljs.io/) as shown in the [Usage](#usage) section.
* If this prevents you from using [Absio Secured Containers](#absio-secure-containers) in your application, please [contact us](#support-and-bug-reporting).

### Module Import Support

We use [Rollup](https://github.com/rollup/rollup) to produce unique CommonJS and ES6 bundles for node and browser.  Our goal is to make using our SDK as easy as possible. [Contact us](#support-and-bug-reporting) if you experience any issues or have suggestions to improve this.

The `module` and `jsnext:main` fields of the `package.json` reference the CommonJS and ES6 specific bundles for Node.js.  The `browser` field of the `package.json` map to the corresponding browser bundles.  The browser bundle contains all external dependencies needed for execution, whereas the Node.js version does not.  

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

The `userId`, `password`, and `passphrase` used below are the credentials for two existing users.  To simplify the example, the [Users](#users) are called Alice and Bob. [Users](#users) can be created with the [`register()`](#registerpassword-reminder-passphrase---userid) method. For more details, see the [Users](#users) section above.

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

4. Start creating [Absio Secured Containers](#absio-secure-containers):

   ``` javascript
   const sensitiveData = new Buffer('Sensitive Data...000-00-0000...');
   const containerId = await securedContainer.create(sensitiveData, { access: [bobsId] });
   ```

5. Securely access these [Absio Secured Containers](#absio-secure-containers) from another system:

   ``` javascript
   await securedContainer.logIn(bobsId, bobsPassword, bobsPassphrase);

   // Access the container with the Container ID returned from create() or a Container Event.
   const container = await securedContainer.get(knownContainerId);
   ```

## Usage
The following usage examples require that the general setup in [Getting Started](#getting-started) has been completed.

### Container Providers

By default, [Absio Secured Containers](#absio-secure-containers) can come from one of two locations.  The [Obfuscating File System](#obfuscating-file-system) (if local storage is used) or the [Absio API Server Application](#absio-api-server-application) (if a connection exists and server storage is used).  To help accommodate the different requirements that customers will have, three different [Absio Secured Container](#absio-secure-containers) providers were created to help manage User intent on [Container](#containers) source and destination location.  Each of the providers are described below.

#### Local Container Provider

Use this provider to create, read, update and delete [Absio Secured Containers](#absio-secure-containers) from local storage ([Obfuscating File System](#obfuscating-file-system)).  Using this provider, you cannot grant/modify access to other [Users](#users) in the system.  All create, update and delete operations only affect the local storage for the authenticated [User](#users).  There is no event system for local storage.  

#### Server Container Provider

Use this provider to create, read, update and delete [Absio Secured Containers](#absio-secure-containers) from the [Absio API Server Application](#absio-api-server-application).  Using this provider, you can grant/modify access to other [Users](#users) in the system.  All create, read, update and delete operations will be tracked by the [Absio API Server Application](#absio-api-server-application) for the relevant [User](#users).  Use the event system on the [Absio API Server Application](#absio-api-server-application) to retrieve the events.  See [getLatestEvents([options])](#getlatesteventsoptions-----container-event--) for more detail on events.  This is the default provider when you do not have local storage (browser).

<b>NOTE:</b> If the system running the SDK has local storage (not a browser), the SDK will still cache all public signing and derivation keys in the [Obfuscating File System](#obfuscating-file-system).

#### Server Cache Local Container Provider

Use this provider for the best user experience. This provider acts similar to the [Server Container Provider](#server-container-provider), but also uses the local storage as a [Absio Secured Container](#absio-secure-containers) cache to facilitate faster read times and allow for offline access.  This is the default provider when you have local storage (not in a browser).

##### Container Create

All created [Containers](#containers) and associated keys are stored on the [Absio API Server Application](#absio-api-server-application) and cached locally ([Obfuscating File System](#obfuscating-file-system)).  If the [Absio API Server Application](#absio-api-server-application) cannot be reached, the whole transaction will be aborted.

##### Container Read

If available, [Containers](#containers) will be pulled from the cache (local storage - [Obfuscating File System](#obfuscating-file-system)).  If not available, [Containers](#containers) will be pulled from the [Absio API Server Application](#absio-api-server-application).  When a [Container](#containers) is pulled from the [Absio API Server Application](#absio-api-server-application), the [Container](#containers) and associated keys will be stored in the [Obfuscating File System](#obfuscating-file-system).

##### Container Update

All updated [Containers](#containers) and associated keys are stored on the [Absio API Server Application](#absio-api-server-application) and cached locally ([Obfuscating File System](#obfuscating-file-system)).  If the [Absio API Server Application](#absio-api-server-application) cannot be reached, the whole transaction will be aborted.

##### Container Delete

All deleted [Containers](#containers) and associated keys are removed locally ([Obfuscating File System](#obfuscating-file-system)) and on the [Absio API Server Application](#absio-api-server-application).  If the [Absio API Server Application](#absio-api-server-application) cannot be reached, the whole transaction will be aborted.

#### Changing Container Providers

By default, if you have access to local storage (not running in a browser) the [Server Cache Local Container Provider](#server-cache-local-container-provider) is used.  Otherwise, the [Local Container Provider](#local-container-provider) is used.  Below is an example on how to change to the [Server Container Provider](#server-container-provider)

``` javascript
securedContainer.setCurrentProvider(securedContainer.providers.serverContainerProvider);
```

### Create
This is an example of creating a [Container](#containers) that contains sensitive data.

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

// Optional: Grant access to the Container with permissions and/or expiration.
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

### Get

This demonstrates the ways to get [Containers](#containers).

``` javascript
// Get the Container with a known ID
const container = await securedContainer.get(knownContainerId);

// The Absio API Server Application creates an event for when a Container is new, updated, deleted, or first accessed.
const latestEvents = await securedContainer.getLatestEvents();

// Events contain the corresponding Container ID for getting the related Container.
const eventContainerId = latestEvents[0].containerId;
const containerFromEvent = await securedContainer.get(eventContainerId);

// Optionally can be filtered to return only the latest events of a given Container type and/or event action.
const latestUpdatedOfType = await securedContainer.getLatestEvents({
    containerType: 'exampleType',
    eventAction: 'updated'
});
```


### Update

The [update()](#updateid-options) method can be used to update fields specified in the options.  Only the fields specified will be updated.  To clear a value, this must be explicitly set.

``` javascript
// Get the Container securely.
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
            viewType: true,
            modifyType: true,
            upload: true
        }
    }
};

// Update the Container.
await securedContainer.update(knownContainerId, {
    access: container.access,
    content: new Buffer('updated content'),
    header: {},
    type: 'redefinedContainerType'
});
```

This shows redefining only the type of a [Container](#containers) with known ID.  The type is the only field of the [Container](#containers) that will be changed in this update call.

``` javascript
await securedContainer.update(knownContainerId, { type: 'redefinedContainerType' });
```

### Delete

Permanently remove access to a [Container](#containers) for the authenticated [User](#users).<br><br>
<b>NOTE:</b> This does not delete the content for all [Users](#users) with access.  See the [deleteContainer(id)](#deletecontainerid) method for more details.

``` javascript
await securedContainer.deleteContainer(knownContainerId);
```

## Support and Bug Reporting

Please [contact us](https://github.com/Absio/absio-secured-container/issues) if you experience any issues using this module.  Use the project's [Github issue tracker](https://github.com/Absio/absio-secured-container/issues) to report all issues.

## License Agreement

See the LICENSE file of the module.

## API

Information about the [available functions](#available-functions) of the Absio SDK (such as data requirements, error codes, etc) can be found below, followed by a list of the [available functions](#available-functions) organized by subject.

### Data Requirements and Details

* Dates
  * All dates returned from the API are ISO-8601 formatted.
  * All dates passed into the API should be ISO-8601 formatted.
* Header
  * The header will be serialized with `JSON.Stringify()`.  Thus, it is best represented as JSON.
  
### Available Functions

* [Container](#container)
  * [Access Information Object](#access-information-object)
  * [Container Object](#container-object)
  * [Container Event Object](#container-event-object)
  * [create(content[, options])](#createcontent-options---containerid)
  * [deleteContainer(id)](#deletecontainerid)
  * [get(id[, options])](#getid-options---container)
  * [getLatestEvents([options])](#getlatesteventsoptions-----container-event--)
  * [update(id[, options])](#updateid-options)
  * [setCurrentProvider(storageProvider)](#setcurrentproviderstorageprovider)
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

### Access Information Object

The Access Information Object is used by the [create()](#createcontent-options---containerid), [update()](#updateid-options) and [get()](#getid-options---container) methods to define a [User's](#users) access to a [Container](#containers).  The key is the [User's](#users) ID, and the value contains the [User's](#users) access for this [Container](#containers).  The access consists of an optional expiration, the encrypted container key and the specific [permissions](possible-permissions-in-an-access-information-object).

The [create()](#createcontent-options---containerid) and [update()](#updateid-options) methods allow access to be defined as a list of [User](#users) IDs.  When the access is defined in this manner, the [permissions](possible-permissions-in-an-access-information-object) defined in the code block below will be the defaults for the [Users](#users) specified in the array.  

In the [get()](#getid-options---container) method, access is part of the returned [Container](#container-object) object.  In the [getLatestEvents()](#getlatesteventsoptions-----container-event--) method, access can be in the changes field.  Access for these methods is always defined as the object shown below.

Unless a permission is explicitly defined, the [User](#users) creating or updating the [Container](#containers) will be given full permissions to the [Container](#containers) without an expiration.

#### Attributes of an Access Information Object

The following table outlines the access attributes for a specific [User](#users) for a specific [Container](#containers).

| Attribute | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
|'expiration' | Date | null | This is date/time when a [User's](#users) access will expire.  If null, the access will not expire. <br><br><b>NOTE:</b> this must be defined as an ISO formatted date and will also be returned as one.
|'keyBlob' | String | null | The base 64 encoded string of the encrypted key blob.
|'permissions' | Object | null | The specific permissions for this [User](#users)/[Container](#containers). See the [JSON example](#json-example-of-access-for-a-user) for the format of the permissions object and below for the permissions definitions.

#### Possible Permissions in an Access Information Object

The following table defines the possible permissions in an [Access Information Object](#access-information-object) for a [User](#users) who is granted access to a [Container](#container-object).  These permissions are rules for the [Absio API Server Application](#absio-api-server-application) to enforce.  The permissions define how the [Absio API Server Application](#absio-api-server-application) will respond to create, read, update and delete operations for a given [Container](#container-object).  Therefore, the SDK and server will be enabled or disabled from performing certain operations based on these permissions as well.  For instance, if the `container.download` property is `false` for a [User](#users) and they request the [Container](#container-object) with the [get()](#getid-options---container)  method, the [Container](#container-object) returned to the [User](#users) will not have the decrypted content or header since the [Absio API Server Application](#absio-api-server-application) will not return the content URL to the SDK.

| Permission  | Creator's Default | Other User's Default | Description |
|:------------|:----------------|:---------------------|:-----------
|`access.view` | `true` | `true` | Permission to view the full access list containing all other [User's](#users) IDs, expiration dates, and permissions.  Set to `false` to prevent a [User](#users) from seeing other [Users'](#users) access information for the [Container](#containers).
|`access.modify` | `true` | `false` | Permission to add, remove, or update all [Users'](#users) access to a [Container](#containers).  Set to `true` to allow a [User](#users) to modify access to the [Container](#containers).  <br><br><b>NOTE:</b> you should also set `access.view` to `true` if this is `true`.  Otherwise, the [User](#users) can modify the access list, but not include others who have access.
|`container.decrypt` | `true` | `true` | Permission to access the key blob required for this [User](#users) to decrypt the [Container](#containers).  Set to `false` to prevent a [User](#users) from being able to decrypt the [Container's](#containers) content and header.
|`container.download` | `true` | `true` | Permission to allow a [User](#users) to download the encrypted [Container's](#containers) data.  Set to `false` to prevent a [User](#users) from accessing the encrypted [Container](#containers) data.
|`container.viewType` | `true` | `false` | Permission to view the [Container's](#containers) `type` field.  Set to `true` to allow a [User](#users) to see the [Container's](#containers) `type` field.
|`container.modifyType` | `true` | `false` | Permission to modify the [Container's](#containers) `type` field.  Set to `true` to allow a [User](#users) to make changes to a [Container's](#containers) `type` field (in events and [Container](#containers) requests).
|`container.upload` | `true` | `false` | Permission to upload changes to the [Container's](#containers) content and header.  Set to `true` to allow a [User](#users) to upload changes to the content and header of a [Container](#containers).  <br><br><b>NOTE:</b> If setting `access.modify` to true, `access.view` and `access.modify` should also be set to `true`. Otherwise this combination of permissions will be rejected by the SDK and server. 

#### JSON Example of Access for a User

``` javascript
{
    'userIdGrantedAccess': {
        expiration: null, // This will never expire. Define a Date for this access to expire.
        permissions: {
            access: {
                view: true,
                modify: false,
            },
            container: {
                decrypt: true,
                download: true,
                viewType: true,
                modifyType: false,
                upload: false
            }
        }
    }
}
```

---

### Container Object

The [Container](#containers) consists of the access, the content, the header and additional metadata.  The attributes of a [Container](#containers) are defined below, as well as an example of the JSON representation.  This object is returned from the [get()](#getid-options---container) method.

#### Attributes of a Container

| Attribute | Type | Default Value | Description |
| :-------- | :--- | :------------ | :---------- |
|'access' | Object | null | A dictionary of [User](#users) ID to the [Access Information Object](#access-information-object) for that [User](#users).  <br><br><b>NOTE:</b> If a [User](#users) did not create the [Container](#containers) and/or does not have `access.view` permission, they will only see the access for their [User](#users) ID.
|'content' | Buffer | null | The decrypted content (payload) portion of the [Absio Secured Container](#absio-secured-containers).  <br><br><b>NOTE:</b> If this is null, the content was not included/decrypted or the authenticated [User](#users) does not have the `container.download` and/or `container.decrypt` permission.
|'created' | Date | null | ISO formatted date/time when a [Container](#containers) was created.  <br><br><b>NOTE:</b> This field will be null if the authenticated [User](#users) does not have the `container.download` permission. 
|'header' | string/JSON | null | The decrypted header (metadata) portion of the [Absio Secured Container](#absio-secured-containers).  The header is JSON.  <br><br><b>NOTE:</b> If this is null, the content was not included/decrypted or the authenticated [User](#users) does not have the `container.download` and/or `container.decrypt` permission.
|'id' | String | null | The ID of the [Container](#containers).
|'modifiedAt' | Date | null | ISO formatted date/time when a [Container](#containers) was last modified.  If the [Container](#containers) has never been modified, this will be null.  <br><br><b>NOTE:</b> This field will be null if the authenticated [User](#users) does not have the `container.download` permission. 
|'modifiedBy' | String/GUID | null | The [User](#users) Id who last modified the [Container](#containers).  If the [Container](#containers) has never been modified this will be null.  <br><br><b>NOTE:</b> This field will be null if the authenticated [User](#users) does not have `access.view` permission.
|'createdBy' | String/GUID | null | The [User](#users) Id for the [User](#users) who created this [Container](#containers).  <br><br><b>NOTE:</b> This field will be null if the authenticated [User](#users) does not have the `access.view` permission.
|'length' | integer | null | The length in bytes of the encrypted [Absio Secured Container](#absio-secured-containers).  <br><br><b>NOTE:</b> This field will be null if the authenticated [User](#users) does not have the `container.download` permission.
|'type' | String | null | The categorical type of the [Container](#containers).  <br><br><b>NOTE:</b> This field will be null if the authenticated [User](#users) does not have the `container.download` permission.

#### JSON Example of a Container

``` javascript
{
    access: {
        userIdWithAccess: {
            expiration: 'ISO formatted date string',
            keyBlob: 'Base64EncodedStringOfEncryptedKeyBlob'
            permissions: {
                access: {
                    view: true,
                    modify: false,
                },
                container: {
                    decrypt: true,
                    download: true,
                    viewType: true,
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
    modifiedAt: Date(),
    modifiedBy: 'user ID that modified',
    createdBy: 'user ID of creator',
    length: 12345,
    type: 'container type'
}
```

---

### Container Event Object

The [Absio API Server Application](#absio-api-server-application) tracks all [Container](#containers) actions (accessed, added, updated and deleted) related to [Absio Secured Containers](absio-secured-containers).  Calls to the [getLatestEvents()](#getlatesteventsoptions-----container-event--) return a list of Container Event Objects.  The attributes of these objects are defined below, along with some sample JSON.

#### Container Event Object Attributes

| Attribute | Type | Default Value | Description |
| :-------- | :--- | :------------ | :---------- |
|'action' | String | not null | Always one of `accessed`, `added`, `deleted`, or `updated`.
|'changes' | Dictionary | null | Information about what has changed. For example { `fieldThatChanged` `updatedValue` }
|'clientAppName' | String | null | The name of the application responsible for the action, optionally specified in the initialize() method.
|'containerExpiredAt' | Date | null | ISO-formatted [Container](#containers) expiration date if the [Container](#containers) has expired. 
|'containerId' | String/GUID | not null | The [Container](#containers) ID that this event relates to, if type is `container`. 
|'containerModifiedAt' | Date | null | ISO formatted date string corresponding to when the [Container](#containers) content property was last modified. It does not change when updating access, header or type (it will be null). 
|'containerType' | String | null | The [Container](#containers) type as specified upon creation or last update. 
|'date' | Date | not null | ISO formatted date string corresponding to when the event occurred.
|'eventId' | int | not null | An integer ID value for the event.
|'relatedUserId' | String/GUID | not null | If this event relates to another [User](#users), this field will be set to that [User's](#users) ID.
|'type' | String | not null | The event type, always one of `container` or `keysFile`.

#### Container Event Object Example JSON

``` javascript
{
    action: 'updated',
    changes: { 
        fieldThatChanged: 'updatedValue',
        ...
    },
    clientAppName: 'My App Name',
    containerId: '4cc66990-e4e1-4e06-8f4c-0aeb15d1f712',
    containerModifiedAt: '2017-06-13T22:10:23.859Z',
    containerType: 'The Changed Type',
    date: '2017-06-14T22:10:23.859Z',
    eventId: '5005',
    relatedUserId: '910084d7-b5b4-477e-880d-f8f8adf79160',
    type: 'container',
}
```

---

### `create(content[, options])` -> `'containerId'`

Creates an [Absio Secured Container](#absio-secured-containers) with the provided `content`. The [Container](#containers) will be uploaded to the [Absio API Server Application](#absio-api-server-application) and access will be granted to the specified [Users](#users).  If local storage is being utilized, the [Absio Secured Container](#absio-secured-containers) and associated `access` will also be stored in the [Obfuscating File System](#obfuscating-file-system).

The [Container](#containers) will never expire for the creator.  The creator is automatically granted full permission to the [Container](#containers), unless a limited permission is defined in `access` for the creator.

Returns a Promise that resolves to the new [Container's](#containers) ID.

Throws an Error if the connection is unavailable or an access [User](#users) Id is not found.

Parameter   | Type  | Description
:-----------|:------|:-----------
`content` | [Buffer](https://nodejs.org/dist/latest-v6.x/docs/api/buffer.html) | Node.js [Buffer](https://nodejs.org/dist/latest-v6.x/docs/api/buffer.html) for the data to be stored in the [Container](#containers).
`options` | Object [optional] | See table below.

Option | Type  | Default | Description
:------|:------|:--------|:-----------
`access` | Array of [User](#users) IDs (String) or [Access Information](#access-information-object) for setting permissions and expiration | `{}` | Access will be granted to the [Users](#users) in this array with any specified permissions or expiration.
`header` | Object | `{}` | This will be serialized with `JSON.Stringify()`, independently encrypted, and can be retrieved prior to downloading and decrypting the full content. Thus, it is optimal to pass in JSON.  Use this to store any data related to the content. 
`type` | String | `null` | A string used to categorize the [Container](#containers) on the [Absio API Server Application](#absio-api-server-application).


---

### `deleteContainer(id)`

This revokes the authenticated user's access to the [ASC](#absio-secured-containers) from the [Absio API Server Application]. If local storage is being utilized, the [ASC](#absio-secured-containers) and associated `access` will also be removed from the [OFS](#obfuscating-file-system). If the authenticated user is the only user with access, then the content will be deleted from the [Absio API Server Application](#absio-api-server-application) as well.<br><br>
<b>NOTE:</b> If you want the content to be deleted, you must first remove all other users' access and then call delete.  This will result in no users having access and the content being removed locally and on the server.

Returns a Promise.

Throws an Error if the ID is not found or a connection is unavailable.

Parameter   | Type  | Description
:------|:------|:-----------
`id` | String | The ID of the [Container](#containers) to delete.

---

### `get(id[, options])` -> [container](#container-object)

Gets the [Absio Secured Container](#absio-secured-containers) and decrypts it for use. If local storage is being utilized, the SDK will first check the [Obuscating File System](#obfuscating-file-system).  If not using local storage or the [Absio Secured Container](#absio-secured-containers) is not found, the latest version is downloaded from the [Absio API Server Application](#absio-api-server-application).  By default, the content is included (downloaded and decrypted).  See the options below for overriding this behavior.

Returns a Promise that resolves to a [Container](#container-object).

Throws an Error if the [Container](#containers) or connection is unavailable.

Parameter   | Type  | Description
:------|:------|:-----------
`id` | String | The ID of the [Container](#containers) to get.
`options` | Object [optional] | See table below.

Option | Type  | Default | Description
:------|:------|:--------|:-----------
`includeContent` | boolean | `true` | Set to `false` to prevent downloading and decrypting content.  This is helpful when the content is very large.

---

### `getLatestEvents([options])` -> [ { Container Event } ](#container-event-object)

Gets all new [Container](#containers) events since the last call of this method, unless specified with `startingEventId` in `options`. Options can be used to change the criteria for the [Container events](#container-event-object) returned by this method.  The events are retrieved from the [Absio API Server Application](#absio-api-server-application).

Returns a Promise that resolves to an array of [Container events](#container-event-object).

Throws an Error if the connection is unavailable.

Parameter   | Type  | Description
:------|:------|:-----------
`options` | Object [optional] | See table below.

Option | Type  | Default | Description
:------|:------|:--------|:-----------
`containerType` | String | `undefined` | Only events of the specified [Container](#containers) type will be returned. Type is a string used to categorize [Containers](#containers) on the [Absio API Server Application](#absio-api-server-application).
`containerId` | String | `undefined` | Filter the results to only include events related to the specified [Container](#containers) ID.
`eventAction` | String | `'all'` | All [Container](#containers) actions are included in the results by default. Possible values are: `'all'`, `'accessed'`, `'added'`, `'deleted'`, or `'updated'`.
`startingEventId` | Number | `-1` | 0 will start from the beginning and download all events for the current [User](#users) with the specified criteria.  Use the `eventId` field of the [Container event](#container-event-object) to start from a known event. -1 will download all new since last call.

---

### `update(id[, options])`

Updates the [Absio Secured Container](#absio-secured-containers) with the specified ID. At least one optional parameter must be provided for an update to occur.  This will update the [Absio Secured Container](#absio-secured-containers) and `access` on the [Absio API Server Application](#absio-api-server-application) and in the [Obfuscating File System](#obfuscating-file-system) if local storage is being utilized.

Returns a Promise.

Throws an Error if the connection is unavailable or an ID is not found.

Parameter   | Type  | Description
:------|:------|:-----------
`id` | String | The ID of the [Container](#containers) to update.
`options` | Object [optional] | See table below.

Option | Type  | Default | Description
:------|:------|:--------|:-----------
`access` | Array of [User](#users) IDs (String) or [accessInformation](#access-information-object) for setting permissions and expiration | `undefined` | The access granted to the [Container](#containers) on upload. If not specified, the currently defined access will be left unchanged.
`content` | [Buffer](https://nodejs.org/dist/latest-v6.x/docs/api/buffer.html) | `undefined` | The content to update.
`header` | Object | `undefined` | This will be serialized with `JSON.stringify()`, independently encrypted, and can be retrieved prior to downloading and decrypting the full content. Thus, it is optimal to pass in JSON.  Use this to store any data related to the content.
`type` | String | `undefined` | A string used to categorize the [Container](#containers) on the [Absio API Server Application](#absio-api-server-application).

---

### `setCurrentProvider(storageProvider)`

Sets the current [Container Provider](#container-providers) to the specified one. This is used to instruct the SDK where to get [Containers](#containers) from, as well as where to store them.

Parameter   | Type  | Description
:------|:------|:-----------
`storageProvider` | module | The provider to use for all [Container](#containers) storage.

---

## General

### `hash(stringToHash)` -> `'hashedString'`
Produces a sha256 hash of the specified String.

Returns a String with the hashed value.

Parameter   | Type  | Description
:------|:------|:-----------
`stringToHash` | String | The string used for producing the hash.

---

### `initialize(serverUrl, apiKey[, options])`

This method must be called first to initialize the module. See the [Obtaining an API Key](#obtaining-an-api-key) section for more information about the API Key parameter.

Returns a Promise.

Parameter   | Type  | Description
:------|:------|:-----------
`serverUrl` | String | The URL of the [Absio API Server Application](#absio-api-server-application).
`apiKey` | String | The API Key is required for using the [Absio API Server Application](#absio-api-server-application).  See the [Obtaining an API Key](#obtaining-an-api-key) section for more information about the API Key parameter.
`options` | Object [optional] | See table below.

Option | Type  | Default | Description
:------|:------|:--------|:-----------
`applicationName` | String | `''` | The [Absio API Server Application](#absio-api-server-application) uses the application name to identify different applications.
`passphraseValidator` | Function | Function that enforces a passphrase must be at least 8 characters, and include at least 1 uppercase letter, 1 lowercase letter, and 1 number. | A Function that takes a String passphrase parameter and returns a Boolean value indicating whether the passphrase is valid.
`passwordValidator` | Function | Function that enforces a password must be at least 8 characters, and include at least 1 uppercase letter, 1 lowercase letter, and 1 number. | A Function that takes a String password parameter and returns a Boolean value indicating whether the password is valid.
`reminderValidator` | Function | `(reminder) => true`, returns true for any reminder. | A Function that takes a String reminder parameter and returns a Boolean value indicating whether the reminder is valid.
`rootDirectory` | String | `'./'` | By default the root directory for storing data will be the current directory.  Only encrypted data is stored here.

---

## User Accounts

### `changeBackupCredentials(currentPassphrase, currentPassword, newReminder, newPassphrase)`

Change the backup credentials for the account.  Use a secure value for the passphrase as it can be used to reset the [User's](#users) password.  This operation causes the [Key File](#key-file) to be re-encrypted.  The new copy of the [Key File](#key-file) will be pushed to the [Absio API Server Application](#absio-api-server-application).  If local storage is being utilized, it will also be saved in the [Obfuscating File System](#obfuscating-file-system).

Returns a Promise.

Throws an Error if the `currentPassphrase` or `currentPassword` is incorrect.  

Parameter   | Type  | Description
:-----------|:------|:-----------
`currentPassphrase` | String | The `currentPassphrase` set up during registration of the account.
`currentPassword` | String | The current password for the [User](#users).
`newReminder` | String | The new backup reminder for the [User's](#users) passphrase.  The reminder is publicly available in plain text.  Do not include sensitive information or wording that allows the passphrase to be easily compromised.
`newPassphrase` | String | The new backup passphrase for the [User](#users).  Use a secure value for this.  This can be used to reset the password for the [User's](#users) account.

---

### `changePassword(currentPassphrase, currentPassword, newPassword)`

Change the password for the current [User](#users).  The current `passphrase` is required for updating the backup.  This operation causes the [Key File](#key-file) to be re-encrypted.  The new copy of the [Key File](#key-file) will be pushed to the [Absio API Server Application](#absio-api-server-application).  If local storage is being utilized, it will also be saved in the [Obfuscating File System](#obfuscating-file-system).

Returns a Promise.

Throws an Error if the `currentPassphrase` or `currentPassword` is incorrect.

Parameter   | Type  | Description
:-----------|:------|:-----------
`currentPassphrase` | String | The `currentPassphrase` is set up during registration of the account.  This is used to reset the password.
`currentPassword` | String | The current password for the [User](#users).
`newPassword` | String | The new password for the [User](#users).

---

### `deleteUser()`

**Important:** All data for the current [User](#users) will be deleted from the [Absio API Server Application](#absio-api-server-application) and from the [Obfuscating File System](#obfuscating-file-system) if local storage is used in any way.  This [User](#users) will be permanently deleted.  Take caution using this method as there is no recovery mechanism.

Returns a Promise.

Throws an exception if the connection is unavailable.

---

### `getBackupReminder(userId)` -> `'Reminder for the backup passphrase'`

Gets the publicly accessible reminder for the [User's](#users) backup passphrase.  If no ID is provided, the [User](#users) ID for the currently authenticated [User](#users) will be used.  This operation causes the [Key File](#key-file) to be re-encrypted.  The new copy of the [Key File](#key-file) will be pushed to the [Absio API Server Application](#absio-api-server-application).  If local storage is being utilized, it will also be saved in the [Obfuscating File System](#obfuscating-file-system).

Returns a Promise that resolves to the [User's](#users) reminder.

Throws an exception if the connection is unavailable.

Parameter   | Type  | Description
:-----------|:------|:-----------
`userId` | String | A string ID representing the [User](#users).

---

### `logIn(userId, password, passphrase[, options])`

Decrypts the [Key File](#key-file) containing the [User's](#users) private keys with the provided password.  If the decryption succeeds, then a private key will be used to authenticate with the [Absio API Server Application](#absio-api-server-application).  If the [Key File](#key-file) is not cached locally in the [Obfuscating File System](#obfuscating-file-system), the `passphrase` is used to download it from the [Absio API Server Application](#absio-api-server-application).  If local storage is being used, the downloaded [Key File](#key-file) will be stored in the [Obfuscating File System](#obfuscating-file-system).

Returns a Promise.

Throws an Error if the `password` or `passphrase` are incorrect, the `userId` is not found, or a connection is unavailable. If the password is correct and a connection is unavailable, then calling `logIn()` again is not required.  Authentication with the [Absio API Server Application](#absio-api-server-application) will be attempted again automatically on the next call that requires it.

Parameter   | Type  | Description
:-----------|:------|:-----------
`userId` | String | The [User](#users) ID value is returned at registration.  Call `register()` to register a [User](#users).
`password` | String | The password used to decrypt the [Key File](#key-file).
`passphrase` | String | The `passphrase` used to retrieve the [Key File](#key-file) from the [Absio API Server Application](#absio-api-server-application).

Option | Type  | Default | Description
:------|:------|:--------|:-----------
`cacheLocal` | boolean | `false` | By default, the encrypted [Key File](#key-file) is not cached locally.  Set to `true` to enable using the cache for offline access and greater efficiency.  When set to true, the encrypted [Key File](#key-file) will be stored and accessed using the local file system in Node.js and using HTML 5 Local Storage in the browser.

---

### `logOut()`

Clears any [User](#users) data cached in memory after awaiting any pending background operations. In a Node.js environment, this closes the database.

Returns a Promise.

---

### `register(password, reminder, passphrase)` -> `'userId'`

**Important:** The `password` and `passphrase` should be kept secret.  Do not store them publicly in plain text.  By default, the password and passphrase must be at least 8 characters, and include at least 1 uppercase letter, 1 lowercase letter, and 1 number.  To override this behavior or to add a reminder validation, see the optional validator parameters of the [initialize()](#initializeserverurl-apikey-options) method.

Generates private keys and registers a new [User's](#users) on the [Absio API Server Application](#absio-api-server-application).  The [User's](#users) private keys are encrypted with the `password` to produce a [Key File](#key-file).  The `passphrase` is used to reset the password and download the [Key File](#key-file) from the [Absio API Server Application](#absio-api-server-application).  If local storage is utilized, the [Key File](#key-file) is also saved in the [Obfuscating File System](#obfuscating-file-system).

Returns a Promise that resolves to the new [User's](#users) ID.

Throws an Error if the connection is unavailable.

Parameter   | Type  | Description
:-----------|:------|:-----------
`password` | String | The password used to encrypt the [Key File](#key-file).
`reminder` | String | The reminder should only be used as a hint to remember the `passphrase`. This String is stored in plain text and should not contain sensitive information.
`passphrase` | String | The `passphrase` can be used later to reset the password or to allow logging in from another system.

---

### `resetPassword(userId, passphrase, newPassword)`
Use this method to reset a [User's](#users) password. Call `getBackupReminder(userId)` to get the reminder for the `passphrase`.  This operation causes the [Key File](#key-file) to be re-encrypted.  The new copy of the [Key File](#key-file) will be pushed to the [Absio API Server Application](#absio-api-server-application).  If local storage is being utilized, it will also be saved in the [Obfuscating File System](#obfuscating-file-system).

Returns a Promise.

Throws an Error if the `passphrase` is incorrect or [User](#users) ID is not found.  If the [Key File](#key-file) is not cached locally, then an error will be thrown if the connection is unavailable.

Parameter   | Type  | Description
:-----------|:------|:-----------
`userId` | String | A String ID representing the [User](#users).
`passphrase` | String | The `passphrase` is set up during registration of the account.  This is used to reset the password.
`newPassword` | String | The new password for the [User](#users).

---

## Examples

Visit our [Examples](https://github.com/Absio/absio-secured-container/tree/master/examples) page on GitHub to find [Node](https://github.com/Absio/absio-secured-container/tree/master/examples/node) and [Browser](https://github.com/Absio/absio-secured-container/tree/master/examples/browser) specific examples.