export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    message: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface SignUpRequest {
    fullName: string;
    username: string;
    password: string;
    email: string;
    phone: string;
}