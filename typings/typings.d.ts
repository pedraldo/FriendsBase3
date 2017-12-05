// Global
interface IPersistedResource {
    $key: string;
}

interface IRelationObject {
    [key: string]: string;
}

// Groups
interface IGroup {
    id: string;
    name: string;
    description: string;
    users: IRelationObject;
    superAdmin: string;
    admins: string[];
    joinRequests: IRelationObject;
    joinInvitations: string[];
}

interface IPersistedGroup extends IGroup, IPersistedResource { }

// User
interface IUser {
    id: string;
    email: string,
    groups: IRelationObject,
    name: string,
    provider: string,
    relationships: IRelationObject,
    image?: string,
    emailVerified?: boolean
}

interface IPersistedUser extends IUser, IPersistedResource { }

// Basic credentials
interface IBasicCredentials {
    email: string,
    password: string,
    created?: boolean
}