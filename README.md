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
  * [create(content[, options])](#createcontent-options-containerid)
  * [deleteContainer(id)](#deletecontainerid)
  * [get(id)](#getid-container)
  * [getContent(id)](#getcontentid-decrypted-content-buffer)
  * [getHeader(id)](#getheaderid-decrypted-header)
  * [getMetadata(id)](#getmetadataid-container)
  * [getEvents([options])](#geteventsoptions-container-event-)
  * [update(id[, options])](#updateid-options)
  * [setCurrentProvider(storageProvider)](#setcurrentproviderstorageprovider)
* [General](#general)
  * [hash(stringToHash) ](#hashstringtohash-hashedstring)
  * [initialize(serverUrl, apiKey[, options])](#initializeserverurl-apikey-options)
* [User Accounts](#user-accounts)
  * [changeCredentials(password, passphrase[, options])](#changecredentialsnewpassword-newpassphrase-newreminder)
  * [deleteUser()](#deleteuser)
  * [getBackupReminder(userId)](#getbackupreminderuserid-reminder-for-the-backup-passphrase)
  * [logIn(userId, password, passphrase[, options])](#loginuserid-password-passphrase-options)
  * [logOut()](#logout)
  * [needToSyncAccount(userId)](#needtosyncaccountuserid-need-to-sync-state)
  * [register(password, reminder, passphrase)](#registerpassword-reminder-passphrase-userid)
  * [synchronizeAccount(passphrase[, password])](#synchronizeaccountpassphrase-password)

## Container
Containers are the method by which data is passed between users securely.

Crucial to utilizing a container is understanding 'access'.  This specifies details such as with whom the container should be shared, what access and permissions are enabled, if the access should be revoked at a particular time, etc.

Containers have headers and content.  Headers are intended to include metadata information.  They could contain client-enforceable controls such as "is this recipient allowed to print"? or identifiers that help tie the content back to something your system understands. The only restriction is that the header must be JSON serializable.

The content is assumed to be a file body. However, it too could be more JSON, or XML, or any other type of data. The content is intended to be just that - the data.

Other metadata exists for containers that is not wrapped up and protected by encryption. This information includes the date the container was created, when it was modified, the 'type', and the length of the container.

### Access Information Object

The Access Information Object is used by the [create()](#createcontent-options-containerid), [update()](#updateid-options) and [get()](#getid-container) methods to define a user's access to a container.  The key is the user's ID, and the value contains the user's access for this container.  The access consists of an optional expiration, the encrypted container key and the specific [permissions](http://docs.absio.com/#technologypermissions).

#### Attributes of an Access Information Object

The following table outlines the access attributes for a specific user for a specific container.

| Attribute | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
|'keyBlobCreatedAt' | Date | null | This is date/time when a user's access was created.
|'keyBlobCreatedBy' | String/GUID | null | The user's id who created this access.
|'expiration' | Date | null | This is date/time when a user's access will expire.  If null, the access will not expire. <br><br><b>NOTE:</b> this must be defined as an ISO formatted date and will also be returned as one.
|'keyBlob' | String | null | The base 64 encoded string of the encrypted key blob.
|'keyBlobModifiedAt' | Date | null | This is date/time when the access was last updated.
|'keyBlobModifiedBy' | String/GUID | null | The user's id who last updated this access.
|'permissions' | Object | null | The specific permissions for this user/container. See the [JSON example](#json-example-of-access-for-a-user) for the format of the permissions object and below for the permissions definitions.

### JSON Example of Access for a User

``` javascript
{
    'userIdGrantedAccess': {
        expiration: null, // This will never expire. Define a Date for this access to expire.
        permissions: {
            access: {
                view: true,
                modify: false,
                rxAccessEvents: true
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


### Permissions Object

Permissions are a critical component of the [Access Information Object](#access-information-object).

Permissions are rules for the Absio Broker™ application to enforce. The permissions define how the Absio Broker™ application will respond to [create()](#createcontent-options-containerid), [update()](#updateid-options), [get()](#getid-container) and [deleteContainer(id)](#deletecontainerid) operations for a given container. Therefore, the absio library and Absio Broker™ application will be enabled or disabled from performing certain operations based on these permissions as well.

For instance, if the container.download property is `false` for a user and they request the container with the [get()](#getid-container) function, the Container instance returned to the user will not have the content or header since the Absio Broker™ application will not allow access to this information to the Absio library.

#### Possible Permissions in an Access Information Object

The following table defines the possible permissions in an [Access Information Object](#access-information-object) for a user who is granted access to a container.  These permissions are rules for the Absio Broker™ application to enforce.  The permissions define how the Absio Broker™ application will respond to create, read, update and delete operations for a given container.  Therefore, the Absio SDK and API Server Application will be enabled or disabled from performing certain operations based on these permissions as well.  For instance, if the `container.download` property is `false` for a user and they request the container with the [get()](#getid-container)  method, the container returned to the user will not have the decrypted content or header since the Absio Broker™ application will not return the content URL to the SDK.<p>
<b>NOTE:</b> The user creating or updating the container will be given the "Creator's Default" below unless specified otherwise.  This is true even if they are not included in the access list.  All other users in the access list will be given the "Other User's Default" below unless specified otherwise.  These defaults are used if the access list is an array of user ids.

| Permission  | Creator's Default | Other User's Default | Description |
|:------------|:----------------|:---------------------|:-----------
|`access.view` | `true` | `true` | Permission to view the full access list containing all other user's IDs, expiration dates, and permissions.  Set to `false` to prevent a user from seeing other users' access information for the container.
|`access.modify` | `true` | `false` | Permission to add, remove, or update all users' access to a container.  Set to `true` to allow a user to modify access to the container.  <br><br><b>NOTE:</b> you should also set `access.view` to `true` if this is `true`.  Otherwise, the user can modify the access list, but not include others who have access.
|`access.rxAccessEvents` | `true` | `true` | Permission to receive events.  If present, the user will receive the event when they or any other recipient of a container will pull container from server.  If the 'access.view' flag is also set, the related user ID will be set.  This indicates which user was the one who accessed the container.   
|`container.decrypt` | `true` | `true` | Permission to access the key blob required for this user to decrypt the container.  Set to `false` to prevent a user from being able to decrypt the container's content and header.
|`container.download` | `true` | `true` | Permission to allow a user to download the encrypted container's data.  Set to `false` to prevent a user from accessing the encrypted container data.
|`container.viewType` | `true` | `false` | Permission to view the container's `type` field.  Set to `true` to allow a user to see the container's `type` field.
|`container.modifyType` | `true` | `false` | Permission to modify the container's `type` field.  Set to `true` to allow a user to make changes to a container's `type` field (in events and container requests).
|`container.upload` | `true` | `false` | Permission to upload changes to the container's content and header.  Set to `true` to allow a user to upload changes to the content and header of a container.  <br><br><b>NOTE:</b> If setting `access.modify` to true, `access.view` and `access.modify` should also be set to `true`. Otherwise this combination of permissions will be rejected by the Absio SDK and API Server Application. 

#### Known Permission Error Cases

Below are some permissions states that may have adverse effects. 
* `view` is `false` and `modify` is `true`.  The user can update the access list, but will not know the other user with current access.  Thus, the update could potentially remove all access from the current access list (aside from the User performing the operation).
* `view` is `false` and `upload` is `true` and `modify` is `true`.  The user can update the access list and content, but will not know the other users with current access.  Thus, the update could potentially remove all access from the current access list (aside from the user performing the operation).
* `view` is `true` and `upload` is `true` and `modify` is `false`.  This operation will be rejected by the Absio Broker™ application.  Since uploading content requires re-keying the data, all access must be updated (each user with access will get a new `keyBlob`).  Since they cannot `modify` access, it will be rejected.
* `upload` is `false`.  Calls to [update()](#updateid-options) will be rejected by the Absio Broker™ application. 
* `upload` is `true` and `modifyType` is `false`.  Calls to [update()](#updateid-options) that include the `type` will be rejected by the Absio Broker™ application.
* `download` is `false` or `decrypt` is `false`. If the data is not cached locally in the Obfuscating File System, calls to [get()](#getid-container) will return a container with `content` and `header` null.

---

### Container Object

The Container consists of the [Access Information Object](#access-information-object), the content, the header and additional metadata.  The attributes of a Container are defined below, as well as an example of the JSON representation.  This object is returned from the [get()](#getid-container) method.

#### Attributes of a Container

| Attribute | Type | Default Value | Description |
| :-------- | :--- | :------------ | :---------- |
|'access' | Object | null | Details about with whom the container is shared and what permissions they have. This is in the form of dictionary of User ID to the [Access Information Object](#access-information-object). <br><br><b>NOTE:</b> If a user did not create the container and/or does not have `access.view` permission, they will only see the access for their user ID.
|'content' | Buffer | null | The decrypted content (payload) portion of the Absio Secured Container.  <br><br><b>NOTE:</b> If this is null, the content was not included/decrypted or the authenticated user does not have the `container.download` and/or `container.decrypt` permission.
|'createdAt' | Date | null | ISO formatted date/time when a container was created.  <br><br><b>NOTE:</b> This field will be null if the authenticated user does not have the `container.download` permission. 
|'header' | string/JSON | null | The decrypted header (metadata) portion of the Absio Secured Container.  The header is JSON.  <br><br><b>NOTE:</b> If this is null, the content was not included/decrypted or the authenticated User does not have the `container.download` and/or `container.decrypt` permission.
|'id' | String | null | The ID of the container.
|'modifiedAt' | Date | null | ISO formatted date/time when a container was last modified.  If the container has never been modified, this will be null.  <br><br><b>NOTE:</b> This field will be null if the authenticated user does not have the `container.download` permission. 
|'modifiedBy' | String/GUID | null | The user Id who last modified the container.  If the container has never been modified this will be null.  <br><br><b>NOTE:</b> This field will be null if the authenticated user does not have `access.view` permission.
|'createdBy' | String/GUID | null | The user Id for the user who created this container.  <br><br><b>NOTE:</b> This field will be null if the authenticated user does not have the `access.view` permission.
|'length' | integer | null | The length in bytes of the encrypted Absio Secured Container.  <br><br><b>NOTE:</b> This field will be null if the authenticated user does not have the `container.download` permission.
|'type' | String | null | An optional clear bit of metadata that can be used to describe what type of data has been wrapped up into the container. This can be used to organize containers on the Absio Broker™ application.  <br><br><b>NOTE:</b> This field will be null if the authenticated user does not have the `container.download` permission.

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
                    rxAccessEvents: true
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
    createdAt: Date(),
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

The Absio Broker™ application tracks all container actions (accessed, added, updated and deleted) related to Absio Secured Containers.  Calls to the [getEvents()](#geteventsoptions-container-event-) return a list of container event objects.  The attributes of these objects are defined below, along with some sample JSON.

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

Creates an Absio Secured Container with the provided `content`. The container will be uploaded to the Absio Broker™ application and access will be granted to the specified users.  If local storage is being utilized, the Absio Secured Container and associated `access` will also be stored in the Obfuscating File System.

The Container will never expire for the creator.

Access can be defined as a list of access information or user IDs. When the access is defined as a list of userIDs, the permissions defined in the code block below will be the defaults for the users specified in the array.

<b>IMPORTANT:</b> If the access list is empty, the user creating the container will be given full permissions without expiration.  However, if the access list is not empty, the user creating the container will be given the access defined in the list for them.  If they do not have access defined in the list, they will not have access to request the container from the server.

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
`type` | String | `null` | A string used to categorize the Absio Secured Container on the Absio Broker™ application.


---

### `deleteContainer(id)`

This revokes the authenticated user's access to the Absio Secured Container from the Absio Broker™ application. If local storage is being utilized, the Absio Secured Container and associated `access` will also be removed from the Obfuscating File System. If the authenticated user is the only user with access, then the content will be deleted from the Absio Broker™ application as well.<br><br>
<b>NOTE:</b> If you want the content to be deleted, you must first remove all other users' access and then call delete.  This will result in no users having access and the content being removed locally and on the Absio Broker™ application.

Returns a Promise.

Throws an Error if the ID is not found or a connection is unavailable.

Parameter   | Type  | Description
:------|:------|:-----------
`id` | String | The ID of the container to delete.

---

### `get(id)` -> [container](#container-object)

Gets the Absio Secured Container and decrypts it for use (will have the metadata, header and content). If local storage is being utilized, the SDK will first check the Obfuscating File System.  If not using local storage or the Absio Secured Container is not found, the latest version is downloaded from the Absio Broker™ application.

<b>NOTE:</b> Access is part of the returned container object.  Access will always be in the form of the [Access Information Object](#access-information-object).

Returns a Promise that resolves to a container.

Throws an Error if the container or connection is unavailable.

Parameter   | Type  | Description
:------|:------|:-----------
`id` | String | The ID of the container to get.

---

### `getContent(id)` -> decrypted content buffer

Gets the Absio Secured Container content and decrypts it for use. If local storage is being utilized, the SDK will first check the Obfuscating File System.  If not using local storage or the Absio Secured Container is not found, the latest version is downloaded from the Absio Broker™ application.

Returns a Promise that resolves to a Buffer containing the decrypted content.

Throws an Error if the container or connection is unavailable.

Parameter   | Type  | Description
:------|:------|:-----------
`id` | String | The ID of the container to get the content for.

---

### `getHeader(id)` -> decrypted header

Gets the Absio Secured Container header and decrypts it for use. If local storage is being utilized, the SDK will first check the Obfuscating File System.  If not using local storage or the Absio Secured Container is not found, the latest version is downloaded from the Absio Broker™ application.

Returns a Promise that resolves to a string that is the decrypted header.

Throws an Error if the container or connection is unavailable.

Parameter   | Type  | Description
:------|:------|:-----------
`id` | String | The ID of the container to get the header for.

---

### `getMetadata(id)` -> [container](#container-object)

Gets the Absio Secured Container that will contain the metadata alone (no content or header).

Returns a Promise that resolves to a container.

Throws an Error if the container or connection is unavailable.

Parameter   | Type  | Description
:------|:------|:-----------
`id` | String | The ID of the container to get the metadata for.

---

### `getEvents([options])` -> [ { Container Event } ](#container-event-object)

Gets all [container events](#container-event-object), unless specified with `startingEventId` in `options`. Options can be used to change the criteria for the container events returned by this method.  The events are retrieved from the Absio Broker™ application.

<b>NOTE: </b>Access can be in the changes field.  It will be in the form of the [Access Information Object](#access-information-object).

Returns a Promise that resolves to an array of container events.

Throws an Error if the connection is unavailable.

Parameter   | Type  | Description
:------|:------|:-----------
`options` | Object [optional] | See table below.

Option | Type  | Default | Description
:------|:------|:--------|:-----------
`containerType` | String | `undefined` | Only events of the specified container type will be returned. Type is a string used to categorize containers on the Absio Broker™ application.
`containerId` | String | `undefined` | Filters the results to only include events related to the specified container ID.
`eventAction` | String | `'all'` | All container actions are included in the results by default. Possible values are: `'all'`, `'accessed'`, `'added'`, `'deleted'`, or `'updated'`.
`startingEventId` | Number | `0` | 0 will start from the beginning and download all events for the current user with the specified criteria.  Use the `eventId` field of the [Container event](#container-event-object) to start from a known event.

---

### `update(id[, options])`

Updates the Absio Secured Container with the specified ID. At least one optional parameter must be provided for an update to occur.  This will update the Absio Secured Container and `access` on the Absio Broker™ application and in the Obfuscating File System if local storage is being utilized.<p>
Access can be defined as a list of [Access Information Object](#access-information-object) or user IDs. When the access is defined as a list of userIDs, the permissions defined in the code block below will be the defaults for the users specified in the array.

<b>IMPORTANT:</b> If the access list is empty, the user updating the container will be given full permissions without expiration.  However, if the access list is not empty, the user updating the container will be given the access defined in the list for them.  If they do not have access defined in the list, they will no longer have access to request the container from the server.

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
`type` | String | `undefined` | A string used to categorize the container on the Absio Broker™ application.

---

### `setCurrentProvider(storageProvider)`

Sets the current [Container Provider](http://docs.absio.com/#technologyproviders) to the specified one. This is used to instruct the SDK where to get containers from, as well as where to store them.

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

This method must be called first to initialize the module. See the [Obtaining an API Key](http://docs.absio.com/#quickstartapi_key) section for more information about the API Key parameter.

Returns a Promise.

Parameter   | Type  | Description
:------|:------|:-----------
`serverUrl` | String | The URL of the Absio Broker™ application.
`apiKey` | String | The API Key is required for using the Absio Broker™ application.  See the [Obtaining an API Key](http://docs.absio.com/#quickstartapi_key) section for more information about the API Key parameter.
`options` | Object [optional] | See table below.

Option | Type  | Default | Description
:------|:------|:--------|:-----------
`applicationName` | String | `''` | Name used by the Absio Broker™ application to identify different applications.
`passphraseValidator` | Function | By default, the passphrase must be at least 8 characters long and include at least 1 character from 3 of the following types of characters: uppercase, lowercase, number and special. | A Function that takes a String passphrase parameter and returns a Boolean value indicating whether the passphrase is valid.
`passwordValidator` | Function | By default, the password must be at least 8 characters long and include at least 1 character from 3 of the following types of characters: uppercase, lowercase, number and special. | A Function that takes a String password parameter and returns a Boolean value indicating whether the password is valid.
`reminderValidator` | Function | Absio does not enforce any complexity upon the reminder, therefore this implementation just returns true. | A Function that takes a String reminder parameter and returns a Boolean value indicating whether the reminder is valid.
`rootDirectory` | String | `'./'` | By default the root directory for storing data will be the current directory.  Only encrypted data is stored here.
`partitionDataByUser` | boolean | `false` | By default the OFS will not partition data by user.  If set to true, the data will be partitioned by user.

---

## User Accounts

### `changeCredentials(newPassword, newPassphrase[, newReminder, options])`

Change the credentials for the account.  The user must be authenticated to make this call.  Use a secure value for the passphrase as it can be used to authenticate if the password is lost or forgot and also used to push a copy of the Key File.  This operation causes the key file to be re-encrypted.  The new copy of the key file will be pushed to the Absio Broker™ application and optionally into the cache.

<b>NOTE:</b> If users in the system are on more than one device, they will need to sync their Key File onto those other devices after calling this function.  See the [needToSyncAccount(userId)](#needtosyncaccountuserid-need-to-sync-state) and [synchronizeAccount(passphrase[, password])](#synchronizeaccountpassphrase-password) methods for more information on syncing Key Files.

Throws an Error if the `currentPassphrase` or `currentPassword` is incorrect.  

Parameter   | Type  | Description
:-----------|:------|:-----------
`newPassword` | String | The password to use for this user.
`newPassphrase` | String | The passphrase for the user.  It will be used for getting Key File from the server and for authenticating when the password is lost.
`newReminder` | String | The reminder for the user's passphrase.  The reminder is optional and will be assumed blank if not supplied.  The reminder is publicly available in plain text.  Do not include sensitive information or wording that allows the passphrase to be easily compromised.

Option | Type  | Default | Description
:------|:------|:--------|:-----------
`cacheLocal` | boolean | `true` in Node.js, `false` in browser| By default, the encrypted key file is cached locally only in Node.js. When set to true, the encrypted key file will be stored using the local file system in Node.js and using HTML 5 Local Storage in the browser.


---

### `deleteUser()`

**Important:** All data for the current user will be deleted from the Absio Broker™ application and from the Obfuscating File System if local storage is used in any way.  This user will be permanently deleted.  Take caution using this method as there is no recovery mechanism.

Returns a Promise.

Throws an exception if the connection is unavailable.

---

### `getBackupReminder(userId)` -> `'Reminder for the backup passphrase'`

Gets the publicly accessible reminder for the user's backup passphrase.  If no ID is provided, the user ID for the currently authenticated user will be used.  This operation causes the key file to be re-encrypted.  The new copy of the key file will be pushed to the Absio Broker™ application.  If local storage is being utilized, it will also be saved in the Obfuscating File System.

Returns a Promise that resolves to the user's reminder.

Throws an exception if the connection is unavailable.

Parameter   | Type  | Description
:-----------|:------|:-----------
`userId` | String | A string ID representing the user.

---

### `logIn(userId, password, passphrase[, options])`

Decrypts the key file containing the user's private keys with the provided `password`.  If the decryption succeeds, then a private key will be used to authenticate with the Absio Broker™ application.  If the key file is not cached locally in the Obfuscating File System, the `passphrase` is used to download it from the Absio Broker™ application.  If local storage is being used, the downloaded key file will be stored in the Obfuscating File System.

If the `passphrase` is supplied, the key file will always be pulled from the server.  The `passphrase` is a way to force a local sync of the key file. 

<b>NOTE:</b> The `password` and `passphrase` are optional.  However, you must supply at least one of them.  Passing in the `password` and not the `passphrase` will work with the OfsProvider (Key File must exist in the OFS).  Passing in the `passphrase` and not the `password` will work with any provider.  Using the `passphrase` without the `password` is the intended way to authenticate if the `password` is lost or forgot (the `password` will be rescued from the Key File).  It will also work on the OfsProvider and ServerCacheOfsProvider if the Key File is not present in the cache. 

Returns a Promise.

Throws an Error if the `password` or `passphrase` are incorrect, the `userId` is not found, or a connection is unavailable. If the `password` is correct and a connection is unavailable, then calling `logIn()` again is not required.  Authentication with the Absio Broker™ application will be attempted again automatically on the next call that requires it.

Parameter   | Type  | Description
:-----------|:------|:-----------
`userId` | String | The user ID value is returned at registration.  Call `register()` to register a user.
`password` | String | The `password` used to decrypt the key file.
`passphrase` | String | The `passphrase` used to retrieve the key file from the Absio Broker™ application and is also used to rescue the `password` for the rescue portion of the Key File if the `password` is not supplied.

Option | Type  | Default | Description
:------|:------|:--------|:-----------
`cacheLocal` | boolean | `true` in Node.js, `false` in browser| By default, the encrypted key file is cached locally only in Node.js.  Set to `true` to enable using the cache for offline access and greater efficiency.  When set to true, the encrypted key file will be stored and accessed using the local file system in Node.js and using HTML 5 Local Storage in the browser.

---

### `logOut()`

Clears any user data cached in memory after awaiting any pending background operations. In a Node.js environment, this closes the database.

Returns a Promise.

---

### `needToSyncAccount(userId)` -> `'Need to sync state'`

This will check if the Key File needs to be synced.  This will get the checksum of the Key File in the OFS and pass that to the server for comparison to the checksum of the Key File there.   

If the user is authenticated the `userId` is optional.  In this case it will assume the current user's id.

Returns a Promise that resolves to a boolean.  It will be true if the Key File on the server does not match the Key File in the OFS.

Throws an exception if the connection is unavailable or if the Key File is not available in the OFS.

Parameter   | Type  | Description
:-----------|:------|:-----------
`userId` | String | A string ID representing the user to check the Key File sync state on.

---

### `register(password, reminder, passphrase)` -> `'userId'`

**Important:** The `password` and `passphrase` should be kept secret.  Do not store them publicly in plain text.  By default, the password and passphrase must be at least 8 characters, and include at least 1 uppercase letter, 1 lowercase letter, and 1 number.  To override this behavior or to add a reminder validation, see the optional validator parameters of the [initialize()](#initializeserverurl-apikey-options) method.

Generates private keys and registers a new user on the Absio Broker™ application.  The user's private keys are encrypted with the `password` to produce a key file.  The `passphrase` is used to reset the password and download the key file from the Absio Broker™ application.  If local storage is utilized, the [Key File](http://docs.absio.com/#technologykey_file) is also saved in the Obfuscating File System.

Returns a Promise that resolves to the new user's) ID.

Throws an Error if the connection is unavailable.

Parameter   | Type  | Description
:-----------|:------|:-----------
`password` | String | The password used to encrypt the key file.
`reminder` | String | The reminder should only be used as a hint to remember the `passphrase`. This String is stored in plain text and should not contain sensitive information.
`passphrase` | String | The `passphrase` can be used later to reset the password or to allow logging in from another system.

---

### `synchronizeAccount(passphrase[, password, options])`

This will pull the Key File from the server and load it into memory and optionally into the cache.  The `password` is optional since it can be rescued from the Key File using the provided `passphrase`. 

<b>NOTE:</b> If the `password` is not supplied, the Key File must have a rescue defined.  Also, this operation will be slower than if the `password` was supplied.

Throws an Error if the Key File is not on the server.  

Parameter   | Type  | Description
:-----------|:------|:-----------
`password` | String | The password to use for this user.
`passphrase` | String | The passphrase for the user. 

Option | Type  | Default | Description
:------|:------|:--------|:-----------
`cacheLocal` | boolean | `true` in Node.js, `false` in browser| By default, the encrypted key file is cached locally only in Node.js. When set to true, the encrypted key file will be stored using the local file system in Node.js and using HTML 5 Local Storage in the browser.

---