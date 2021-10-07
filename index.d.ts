declare module "absio-secured-container" {
    export type Guid = string;
    export type ContainerHeader = { [key: string]: string };
    export type Permission = {
        access: {
            view: boolean;
            modify: boolean;
            rxAccessEvents: boolean;
        };
        container: {
            decrypt: boolean;
            download: boolean;
            viewType: boolean;
            modifyType: boolean;
            upload: boolean;
        };
    };
    export type AccessInformation = {
        keyBlobCreatedAt?: Date | null;
        keyBlobCreatedBy?: Guid | null;
        expiration?: Date | null;
        keyBlob?: String | null;
        keyBlobModifiedAt?: Date | null;
        keyBlobModifiedBy?: Guid | null;
        permissions?: Permission | null;
    };
    export type AccessList = { [key: string]: AccessInformation };
    export type Container = {
        access?: AccessList | null;
        content?: Uint8Array | null;
        createdAt?: Date | null;
        header?: ContainerHeader | null;
        id?: Guid | null;
        modifiedAt?: Date;
        modifiedBy?: Guid | null;
        createdBy?: Guid | null;
        length?: number | null;
        type?: String | null;
    };
    export type ContainerEvent = {
        action: "accessed" | "added" | "deleted" | "updated";
        changes?: { [key: string]: any } | null;
        clientAppName?: string | null;
        containerExpiredAt?: Date | null;
        containerId: Guid;
        containerModifiedAt?: Date | null;
        containerType?: string | null;
        date: Date;
        eventId: number;
        relatedUserId: Guid;
        type: "container" | "keysFile";
    };
    export type ContainerCreateOptions = {
        access: string[] | AccessList | {};
        header: ContainerHeader | {};
        type?: string | null;
    };
    export type ContainerUpdateOptions = {
        access?: Guid[] | AccessList;
        content?: Uint8Array;
        header?: ContainerHeader;
        type?: string;
    };
    export type ChangeCredentialsOptions = {
        cacheLocal: boolean;
    };
    export type GetEventsOptions = {
        containerType?: string;
        containerId?: string;
        eventAction?: "all" | "accessed" | "added" | "deleted" | "updated";
        startingEventId?: number;
    };
    export type InitializeOptions = {
        applicationName?: string;
        passphraseValidator?: (passphrase: string) => boolean;
        passwordValidator?: (password: string) => boolean;
        reminderValidator?: (reminder: string) => boolean;
        rootDirectory?: string;
        partitionDataByUser?: boolean;
    };
    export type LoginOptions = {
        cacheLocal: boolean;
    };
    export type SynchronizeOptions = {
        cacheLocal: boolean;
    };

    export function changeCredentials(
        newPassword: string,
        newPassphrase: string,
        newReminder?: string,
        options?: ChangeCredentialsOptions
    ): Promise<Uint8Array>;
    export function create(
        content: Uint8Array,
        options?: ContainerCreateOptions
    ): Promise<Guid>;
    export function deleteContainer(id: string): Promise<void>;
    export function deleteUser(): Promise<void>;
    export function get(id: string): Promise<Container>;
    export function getAllLocalContainersIds(): Promise<Guid[]>;
    export function getBackupReminder(userId: string): Promise<string>;
    export function getContent(id: string): Promise<Uint8Array>;
    export function getEvents(
        options?: GetEventsOptions
    ): Promise<ContainerEvent[]>;
    export function getHeader(): Promise<ContainerHeader>;
    export function getMetadata(): Promise<Container>;
    export function hash(): string;
    export function initialize(
        serverUrl: string,
        apiKey: string,
        options?: InitializeOptions
    ): Promise<void>;
    export function logIn(
        userId: string,
        password: string,
        passphrase: string,
        options?: LoginOptions
    ): Promise<void>;
    export function logOut(): Promise<void>;
    export function needToSyncAccount(userId: string): Promise<boolean>;
    export enum Providers {
        serverContainerProvider = "serverContainerProvider",
        ofsContainerProvider = "ofsContainerProvider",
        serverCacheOfsContainerProvider = "serverCacheOfsContainerProvider",
    }
    export function register(
        password: string,
        reminder: string,
        passphrase: string
    ): Promise<Guid>;
    export function setCurrentProvider(storageProvider: Providers): void;
    export function synchronizeAccount(
        passphrase: string,
        password?: string,
        options?: SynchronizeOptions
    ): Promise<void>;
    export function update(
        id: Guid,
        options?: ContainerUpdateOptions
    ): Promise<void>;
}
