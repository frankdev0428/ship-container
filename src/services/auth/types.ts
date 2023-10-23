export interface UserData {
    userName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    groups?: string[]
}

export interface User extends Partial<UserData> {
    authenticated: boolean;
}

export interface AuthReducerState {
  user: User;
}
