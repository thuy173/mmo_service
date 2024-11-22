import { AuthResponse, LoginRequest, SignUpRequest } from "@/models/auth";
import axiosInstance from "./agent";

export const signUp = async (signUpReq: SignUpRequest): Promise<AuthResponse> => {
    try {
        const response = await axiosInstance.post('/auth/sign-up', signUpReq)
        return response.data
    } catch (error) {
        throw new Error(`Failed to sign up: ${error}`)
    }
}

export const login = async (signInReq: LoginRequest): Promise<AuthResponse> => {
    try {
        const response = await axiosInstance.post('/auth/login', signInReq)
        return response.data
    } catch (error) {
        throw new Error(`Failed to sign in: ${error}`)
    }
}

export default {
    signUp,
    login,
}