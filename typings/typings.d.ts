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
    users: IUserMainInfo[];
    superAdminId: string;
    admins: string[];
    joinRequests: string[];
    joinInvitations: string[];
    profile: IGroupMainInfo;
}

interface IGroupMainInfo {
    id: string;
    name: string;
    superAdmin: {
        id: string;
        name: string;
    }
}

interface IEditableGroupInfo {
    name?: string;
    description?: string
}

interface IPersistedGroup extends IGroup, IPersistedResource { }

// User
interface IUser {
    id: string;
    email: string;
    groups: IRelationObject;
    name: string;
    provider: string;
    relationships: {
        followed: IRelationObject;
        followers: IRelationObject
    },
    image: string;
    emailVerified: boolean;
    facebookId?: string;
    profile: IUserMainInfo;
}

interface IUserMainInfo {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    image: string;
}

interface IPersistedUser extends IUser, IPersistedResource { }

// Relationship
interface IRelationship {
    followers: IRelationObject;
    followed: IRelationObject;
}

// Basic credentials
interface IBasicCredentials {
    email: string,
    password: string,
    created?: boolean
}