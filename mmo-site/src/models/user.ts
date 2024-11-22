export interface UserResponse {
    id: number;
    fullName: string;
    avatar: string;
    username: string;
    email: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
    active: string;
}

export interface UserShortResponse {
    id: number;
    fullName: string;
    avatar: string;
}

export interface UserRequest {
    fullName: string;
    username: string;
    email: string;
    phone: string;
}

export interface ChangePassRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}