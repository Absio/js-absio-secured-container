# Absio Secured Containers

Protect your application's sensitive data with Absio Secured Containers.

## Index

* [About](#about)
* [API](#api)

## About

For deails about the [technology](http://docs.absio.com/#technologyabsio_technology), the [quickstart](http://docs.absio.com/#quickstartapi_key) (usage), [support](http://docs.absio.com/#supportsupport) and the [licensing](http://docs.absio.com/#licenselicense) please see the [Absio Documenation Site](http://docs.absio.com).

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
  * [getMetadata(id)](#getmetadataid---container)
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
Containers are the method by which data is passed between users securely.

Crucial to utilizing a container is understanding 'access'.  This specifies details such as with whom the container should be shared, what access and permissions are enabled, if the access should be revoked at a particular time, etc.

Containers have headers and content.  Headers are intended to include metadata information.  They could contain client-enforceable controls such as "is this recipient allowed to print"? or identifiers that help tie the content back to something your system understands. The only restriction is that the header must be JSON serializable.

The content is assumed to be a file body. However, it too could be more JSON, or XML, or any other type of data. The content is intended to be just that - the data.

Other metadata exists for containers that is not wrapped up and protected by encryption. This information includes the date the container was created, when it was modified, the 'type', and the length of the container.

### Access Information Object

The Access Information Object is used by the [create()](#createcontent-options---containerid), [update()](#updateid-options) and [get()](#getid-options---container) methods to define a user's access to a container.  The key is the user's ID, and the value contains the user's access for this container.  The access consists of an optional expiration, the encrypted container key and the specific [permissions](possible-permissions-in-an-access-information-object).

The [create()](#createcontent-options---containerid) and [update()](#updateid-options) methods allow access to be defined as a list of user IDs.  When the access is defined in this manner, the [permissions](possible-permissions-in-an-access-information-object) defined in the code block below will be the defaults for the users specified in the array.  

In the [get()](#getid-options---container) method, access is part of the returned container object.  In the [getLatestEvents()](#getlatesteventsoptions-----container-event--) method, access can be in the changes field.  Access for these methods is always defined as the object shown below.

Unless a permission is explicitly defined, the user creating or updating the container will be given full permissions to the container without an expiration.  This is true even if they are not included in the access list.

#### Attributes of an Access Information Object

The following table outlines the access attributes for a specific user for a specific container.

| Attribute | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
|'expiration' | Date | null | This is date/time when a user's access will expire.  If null, the access will not expire. <br><br><b>NOTE:</b> this must be defined as an ISO formatted date and will also be returned as one.
|'keyBlob' | String | null | The base 64 encoded string of the encrypted key blob.
|'permissions' | Object | null | The specific permissions for this user/container. See the [JSON example](#json-example-of-access-for-a-user) for the format of the permissions object and below for the permissions definitions.

#### Possible Permissions in an Access Information Object

The following table defines the possible permissions in an [Access Information Object](#access-information-object) for a user who is granted access to a container.  These permissions are rules for the Absio Broker application to enforce.  The permissions define how the Absio Broker application will respond to create, read, update and delete operations for a given container.  Therefore, the Absio SDK and API Server Application will be enabled or disabled from performing certain operations based on these permissions as well.  For instance, if the `container.download` property is `false` for a user and they request the container with the [get()](#getid-options---container)  method, the container returned to the user will not have the decrypted content or header since the Absio Broker application will not return the content URL to the SDK.<p>
<b>NOTE:</b> The user creating or updating the container will be given the "Creator's Default" below unless specified otherwise.  This is true even if they are not included in the access list.  All other users in the access list will be given the "Other User's Default" below unless specified otherwise.  These defaults are used if the access list is an array of user ids.

| Permission  | Creator's Default | Other User's Default | Description |
|:------------|:----------------|:---------------------|:-----------
|`access.view` | `true` | `true` | Permission to view the full access list containing all other user's IDs, expiration dates, and permissions.  Set to `false` to prevent a user from seeing other users' access information for the container.
|`access.modify` | `true` | `false` | Permission to add, remove, or update all users' access to a container.  Set to `true` to allow a user to modify access to the container.  <br><br><b>NOTE:</b> you should also set `access.view` to `true` if this is `true`.  Otherwise, the user can modify the access list, but not include others who have access.
|`container.decrypt` | `true` | `true` | Permission to access the key blob required for this user to decrypt the container.  Set to `false` to prevent a user from being able to decrypt the container's content and header.
|`container.download` | `true` | `true` | Permission to allow a user to download the encrypted container's data.  Set to `false` to prevent a user from accessing the encrypted container data.
|`container.viewType` | `true` | `false` | Permission to view the container's `type` field.  Set to `true` to allow a user to see the container's `type` field.
|`container.modifyType` | `true` | `false` | Permission to modify the container's `type` field.  Set to `true` to allow a user to make changes to a container's `type` field (in events and container requests).
|`container.upload` | `true` | `false` | Permission to upload changes to the container's content and header.  Set to `true` to allow a user to upload changes to the content and header of a container.  <br><br><b>NOTE:</b> If setting `access.modify` to true, `access.view` and `access.modify` should also be set to `true`. Otherwise this combination of permissions will be rejected by the Absio SDK and API Server Application. 

#### Known Permission Error Cases

Below are some permissions states that may have adverse effects. 
* `view` is `false` and `modify` is `true`.  The user can update the access list, but will not know the other user with current access.  Thus, the update could potentially remove all access from the current access list (aside from the User performing the operation).
* `view` is `false` and `upload` is `true` and `modify` is `true`.  The user can update the access list and content, but will not know the other users with current access.  Thus, the update could potentially remove all access from the current access list (aside from the user performing the operation).
* `view` is `true` and `upload` is `true` and `modify` is `false`.  This operation will be rejected by the Absio Broker application.  Since uploading content requires re-keying the data, all access must be updated (each user with access will get a new `keyBlob`).  Since they cannot `modify` access, it will be rejected.
* `upload` is `false`.  Calls to [update()](#updateid-options) will be rejected by the Absio Broker application. 
* `upload` is `true` and `modifyType` is `false`.  Calls to [update()](#updateid-options) that include the `type` will be rejected by the Absio Broker application.
* `download` is `false` or `decrypt` is `false`. If the data is not cached locally in the Obfuscating File System, calls to [get()](#getid-options---container) will return a container with `content` and `header` null.

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

The Container consists of the [Access Information Object](#access-information-object), the content, the header and additional metadata.  The attributes of a Container are defined below, as well as an example of the JSON representation.  This object is returned from the [get()](#getid-options---container) method.

#### Attributes of a Container

| Attribute | Type | Default Value | Description |
| :-------- | :--- | :------------ | :---------- |
|'access' | Object | null | Details about with whom the container is shared and what permissions they have. This is in the form of dictionary of [User](#users) ID to the [Access Information Object](#access-information-object). <br><br><b>NOTE:</b> If a user did not create the container and/or does not have `access.view` permission, they will only see the access for their user ID.
|'content' | Buffer | null | The decrypted content (payload) portion of the Absio Secured Container.  <br><br><b>NOTE:</b> If this is null, the content was not included/decrypted or the authenticated user does not have the `container.download` and/or `container.decrypt` permission.
|'created' | Date | null | ISO formatted date/time when a container was created.  <br><br><b>NOTE:</b> This field will be null if the authenticated user does not have the `container.download` permission. 
|'header' | string/JSON | null | The decrypted header (metadata) portion of the Absio Secured Container.  The header is JSON.  <br><br><b>NOTE:</b> If this is null, the content was not included/decrypted or the authenticated User does not have the `container.download` and/or `container.decrypt` permission.
|'id' | String | null | The ID of the container.
|'modifiedAt' | Date | null | ISO formatted date/time when a container was last modified.  If the container has never been modified, this will be null.  <br><br><b>NOTE:</b> This field will be null if the authenticated user does not have the `container.download` permission. 
|'modifiedBy' | String/GUID | null | The user Id who last modified the container.  If the container has never been modified this will be null.  <br><br><b>NOTE:</b> This field will be null if the authenticated user does not have `access.view` permission.
|'createdBy' | String/GUID | null | The user Id for the user who created this container.  <br><br><b>NOTE:</b> This field will be null if the authenticated user does not have the `access.view` permission.
|'length' | integer | null | The length in bytes of the encrypted Absio Secured Container.  <br><br><b>NOTE:</b> This field will be null if the authenticated user does not have the `container.download` permission.
|'type' | String | null | An optional clear bit of metadata that can be used to describe what type of data has been wrapped up into the container. This can be used to organize containers on the Absio Broker application.  <br><br><b>NOTE:</b> This field will be null if the authenticated user does not have the `container.download` permission.

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

The Absio Broker application tracks all container actions (accessed, added, updated and deleted) related to Absio Secured Containers.  Calls to the [getLatestEvents()](#getlatesteventsoptions-----container-event--) return a list of container event objects.  The attributes of these objects are defined below, along with some sample JSON.

#### Container Event Object Attributes

| Attribute | Type | Default Value | Description |
| :-------- | :--- | :------------ | :---------- |
|'action' | String | not null | Always one of `accessed`, `added`, `deleted`, or `updated`.
|'changes' | Dictionary | null | Information about what has changed. For example { `fieldThatChanged` `updatedValue` }
|'clientAppName' | String | null | The name of the application responsible for the action, optionally specified in the initialize() method.
|'containerExpiredAt' | Date | null | ISO-formatted container expiration date if the container has expired. 
|'containerId' | String/GUID | not null | The container ID that this event relates to, if type is `container`. 
|'containerModifiedAt' | Date | null | ISO formatted date string corresponding to when the container content property was last modified. It does not change when updating access, header or type (it will be null). 
|'containerType' | String | null | The container type as specified upon creation or last update. 
|'date' | Date | not null | ISO formatted date string corresponding to when the event occurred.
|'eventId' | int | not null | An integer ID value for the event.
|'relatedUserId' | String/GUID | not null | If this event relates to another user, this field will be set to that user's ID.
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

Creates an Absio Secured Container with the provided `content`. The container will be uploaded to the Absio Broker application and access will be granted to the specified users.  If local storage is being utilized, the Absio Secured Container and associated `access` will also be stored in the Obfuscating File System.

The Container will never expire for the creator.  The creator is automatically granted full permission to the container, unless a limited permission is defined in `access` for the creator.

Returns a Promise that resolves to the new container's ID.

Throws an Error if the connection is unavailable or an access user Id is not found.

Parameter   | Type  | Description
:-----------|:------|:-----------
`content` | [Buffer](https://nodejs.org/dist/latest-v6.x/docs/api/buffer.html) | Node.js [Buffer](https://nodejs.org/dist/latest-v6.x/docs/api/buffer.html) for the data to be stored in the Absio Secured Container.
`options` | Object [optional] | See table below.

Option | Type  | Default | Description
:------|:------|:--------|:-----------
`access` | Array of user IDs (String) or [Access Information](#access-information-object) for setting permissions and expiration | `{}` | Access will be granted to the users in this array with any specified permissions or expiration.
`header` | Object | `{}` | This will be serialized with `JSON.Stringify()`, independently encrypted, and can be retrieved prior to downloading and decrypting the full content. Thus, it is optimal to pass in JSON.  Use this to store any data related to the content. 
`type` | String | `null` | A string used to categorize the Absio Secured Container on the Absio Broker application.


---

### `deleteContainer(id)`

This revokes the authenticated user's access to the Absio Secured Container from the Absio Broker application. If local storage is being utilized, the Absio Secured Container and associated `access` will also be removed from the Obfuscating File System. If the authenticated user is the only user with access, then the content will be deleted from the Absio Broker application as well.<br><br>
<b>NOTE:</b> If you want the content to be deleted, you must first remove all other users' access and then call delete.  This will result in no users having access and the content being removed locally and on the Absio Broker application.

Returns a Promise.

Throws an Error if the ID is not found or a connection is unavailable.

Parameter   | Type  | Description
:------|:------|:-----------
`id` | String | The ID of the container to delete.

---

### `get(id[, options])` -> [container](#container-object)

Gets the Absio Secured Container and decrypts it for use. If local storage is being utilized, the SDK will first check the Obfuscating File System.  If not using local storage or the Absio Secured Container is not found, the latest version is downloaded from the Absio Broker application.  By default, the content is included (downloaded and decrypted).  See the options below for overriding this behavior.

Returns a Promise that resolves to a container.

Throws an Error if the container or connection is unavailable.

Parameter   | Type  | Description
:------|:------|:-----------
`id` | String | The ID of the container to get.
`options` | Object [optional] | See table below.

Option | Type  | Default | Description
:------|:------|:--------|:-----------
`includeContent` | boolean | `true` | Set to `false` to prevent downloading and decrypting content.  This is helpful when the content is very large.

---

### `getMetadata(id)` -> [container](#container-object)

Gets the Absio Secured Container metadata (no content or header).

Returns a Promise that resolves to a container.

Throws an Error if the container or connection is unavailable.

Parameter   | Type  | Description
:------|:------|:-----------
`id` | String | The ID of the container to get.

---

### `getLatestEvents([options])` -> [ { Container Event } ](#container-event-object)

Gets all new [container events](#container-event-object) since the last call of this method, unless specified with `startingEventId` in `options`. Options can be used to change the criteria for the container events returned by this method.  The events are retrieved from the Absio Broker application.

Returns a Promise that resolves to an array of container events.

Throws an Error if the connection is unavailable.

Parameter   | Type  | Description
:------|:------|:-----------
`options` | Object [optional] | See table below.

Option | Type  | Default | Description
:------|:------|:--------|:-----------
`containerType` | String | `undefined` | Only events of the specified container type will be returned. Type is a string used to categorize containers on the Absio Broker application.
`containerId` | String | `undefined` | Filters the results to only include events related to the specified container ID.
`eventAction` | String | `'all'` | All container actions are included in the results by default. Possible values are: `'all'`, `'accessed'`, `'added'`, `'deleted'`, or `'updated'`.
`startingEventId` | Number | `-1` | 0 will start from the beginning and download all events for the current user with the specified criteria.  Use the `eventId` field of the [Container event](#container-event-object) to start from a known event. -1 will download all new since last call.

---

### `update(id[, options])`

Updates the Absio Secured Container with the specified ID. At least one optional parameter must be provided for an update to occur.  This will update the Absio Secured Container and `access` on the Absio Broker application and in the Obfuscating File System if local storage is being utilized.

Returns a Promise.

Throws an Error if the connection is unavailable or an ID is not found.

Parameter   | Type  | Description
:------|:------|:-----------
`id` | String | The ID of the container to update.
`options` | Object [optional] | See table below.

Option | Type  | Default | Description
:------|:------|:--------|:-----------
`access` | Array of user IDs (String) or [accessInformation](#access-information-object) for setting permissions and expiration | `undefined` | The access granted to the container on upload. If not specified, the currently defined access will be left unchanged.
`content` | [Buffer](https://nodejs.org/dist/latest-v6.x/docs/api/buffer.html) | `undefined` | The content to update.
`header` | Object | `undefined` | This will be serialized with `JSON.stringify()`, independently encrypted, and can be retrieved prior to downloading and decrypting the full content. Thus, it is optimal to pass in JSON.  Use this to store any data related to the content.
`type` | String | `undefined` | A string used to categorize the container on the Absio Broker application.

---

### `setCurrentProvider(storageProvider)`

Sets the current [Container Provider](#container-providers) to the specified one. This is used to instruct the SDK where to get containers from, as well as where to store them.

Parameter   | Type  | Description
:------|:------|:-----------
`storageProvider` | module | The provider to use for all container storage.

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
`serverUrl` | String | The URL of the Absio Broker application.
`apiKey` | String | The API Key is required for using the Absio Broker application.  See the [Obtaining an API Key](#obtaining-an-api-key) section for more information about the API Key parameter.
`options` | Object [optional] | See table below.

Option | Type  | Default | Description
:------|:------|:--------|:-----------
`applicationName` | String | `''` | Name used by the Absio Broker application to identify different applications.
`passphraseValidator` | Function | By default, the passphrase must be at least 8 characters long and include at least 1 character from 3 of the following types of characters: uppercase, lowercase, number and special. | A Function that takes a String passphrase parameter and returns a Boolean value indicating whether the passphrase is valid.
`passwordValidator` | Function | By default, the password must be at least 8 characters long and include at least 1 character from 3 of the following types of characters: uppercase, lowercase, number and special. | A Function that takes a String password parameter and returns a Boolean value indicating whether the password is valid.
`reminderValidator` | Function | Absio does not enforce any complexity upon the reminder, therefore this implementation just returns true. | A Function that takes a String reminder parameter and returns a Boolean value indicating whether the reminder is valid.
`rootDirectory` | String | `'./'` | By default the root directory for storing data will be the current directory.  Only encrypted data is stored here.

---

## User Accounts

### `changeBackupCredentials(currentPassphrase, currentPassword, newReminder, newPassphrase)`

Change the backup credentials for the account.  Use a secure value for the passphrase as it can be used to reset the user's password.  This operation causes the key file to be re-encrypted.  The new copy of the key file will be pushed to the Absio Broker application.  If local storage is being utilized, it will also be saved in the Obfuscating File System.

Returns a Promise.

Throws an Error if the `currentPassphrase` or `currentPassword` is incorrect.  

Parameter   | Type  | Description
:-----------|:------|:-----------
`currentPassphrase` | String | The `currentPassphrase` set up during registration of the account.
`currentPassword` | String | The current password for the user.
`newReminder` | String | The new backup reminder for the user's passphrase.  The reminder is publicly available in plain text.  Do not include sensitive information or wording that allows the passphrase to be easily compromised.
`newPassphrase` | String | The new backup passphrase for the user.  Use a secure value for this.  This can be used to reset the password for the user's account.

---

### `changePassword(currentPassphrase, currentPassword, newPassword)`

Change the password for the current user.  The current `passphrase` is required for updating the backup.  This operation causes the key file to be re-encrypted.  The new copy of the key file will be pushed to the Absio Broker application.  If local storage is being utilized, it will also be saved in the Obfuscating File System.

Returns a Promise.

Throws an Error if the `currentPassphrase` or `currentPassword` is incorrect.

Parameter   | Type  | Description
:-----------|:------|:-----------
`currentPassphrase` | String | The `currentPassphrase` is set up during registration of the account.  This is used to reset the password.
`currentPassword` | String | The current password for the user.
`newPassword` | String | The new password for the user.

---

### `deleteUser()`

**Important:** All data for the current user will be deleted from the Absio Broker application and from the Obfuscating File System if local storage is used in any way.  This user will be permanently deleted.  Take caution using this method as there is no recovery mechanism.

Returns a Promise.

Throws an exception if the connection is unavailable.

---

### `getBackupReminder(userId)` -> `'Reminder for the backup passphrase'`

Gets the publicly accessible reminder for the user's backup passphrase.  If no ID is provided, the user ID for the currently authenticated user will be used.  This operation causes the key file to be re-encrypted.  The new copy of the key file will be pushed to the Absio Broker application.  If local storage is being utilized, it will also be saved in the Obfuscating File System.

Returns a Promise that resolves to the user's reminder.

Throws an exception if the connection is unavailable.

Parameter   | Type  | Description
:-----------|:------|:-----------
`userId` | String | A string ID representing the user.

---

### `logIn(userId, password, passphrase[, options])`

Decrypts the key file containing the user's private keys with the provided password.  If the decryption succeeds, then a private key will be used to authenticate with the Absio Broker application.  If the key file is not cached locally in the Obfuscating File System, the `passphrase` is used to download it from the Absio Broker application.  If local storage is being used, the downloaded key file will be stored in the Obfuscating File System.

Returns a Promise.

Throws an Error if the `password` or `passphrase` are incorrect, the `userId` is not found, or a connection is unavailable. If the password is correct and a connection is unavailable, then calling `logIn()` again is not required.  Authentication with the Absio Broker application will be attempted again automatically on the next call that requires it.

Parameter   | Type  | Description
:-----------|:------|:-----------
`userId` | String | The user ID value is returned at registration.  Call `register()` to register a user.
`password` | String | The password used to decrypt the key file.
`passphrase` | String | The `passphrase` used to retrieve the key file from the Absio Broker application.

Option | Type  | Default | Description
:------|:------|:--------|:-----------
`cacheLocal` | boolean | `false` | By default, the encrypted key file is not cached locally.  Set to `true` to enable using the cache for offline access and greater efficiency.  When set to true, the encrypted key file will be stored and accessed using the local file system in Node.js and using HTML 5 Local Storage in the browser.

---

### `logOut()`

Clears any user data cached in memory after awaiting any pending background operations. In a Node.js environment, this closes the database.

Returns a Promise.

---

### `register(password, reminder, passphrase)` -> `'userId'`

**Important:** The `password` and `passphrase` should be kept secret.  Do not store them publicly in plain text.  By default, the password and passphrase must be at least 8 characters, and include at least 1 uppercase letter, 1 lowercase letter, and 1 number.  To override this behavior or to add a reminder validation, see the optional validator parameters of the [initialize()](#initializeserverurl-apikey-options) method.

Generates private keys and registers a new user on the Absio Broker application.  The user's private keys are encrypted with the `password` to produce a key file.  The `passphrase` is used to reset the password and download the key file from the Absio Broker application.  If local storage is utilized, the [Key File](#key-file) is also saved in the Obfuscating File System.

Returns a Promise that resolves to the new user's) ID.

Throws an Error if the connection is unavailable.

Parameter   | Type  | Description
:-----------|:------|:-----------
`password` | String | The password used to encrypt the key file.
`reminder` | String | The reminder should only be used as a hint to remember the `passphrase`. This String is stored in plain text and should not contain sensitive information.
`passphrase` | String | The `passphrase` can be used later to reset the password or to allow logging in from another system.

---

### `resetPassword(userId, passphrase, newPassword)`
Use this method to reset a user's password. Call `getBackupReminder(userId)` to get the reminder for the `passphrase`.  This operation causes the key file to be re-encrypted.  The new copy of the key file will be pushed to the Absio Broker application.  If local storage is being utilized, it will also be saved in the Obfuscating File System.

Returns a Promise.

Throws an Error if the `passphrase` is incorrect or user ID is not found.  If the key file is not cached locally (Obfuscating File System), then an error will be thrown if the connection is unavailable.

Parameter   | Type  | Description
:-----------|:------|:-----------
`userId` | String | A String ID representing the user.
`passphrase` | String | The `passphrase` is set up during registration of the account.  This is used to reset the password.
`newPassword` | String | The new password for the user.

---

## Support and Bug Reporting

Please [contact us](https://github.com/Absio/absio-secured-container/issues) if you experience any issues using this module.  Use the project's [Github issue tracker](https://github.com/Absio/absio-secured-container/issues) to report all issues.

## License Agreement

See the [LICENSE.txt](https://github.com/Absio/js-absio-secured-container/blob/master/LICENSE/LICENSE.txt) file of the module.
