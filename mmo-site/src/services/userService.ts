import { Wallet } from "@/models/wallet";
import axiosInstance from "./agent";
import { ChangePassRequest, UserRequest, UserResponse } from "@/models/user";

export const getUser = async (): Promise<UserResponse> => {
    try {
        const response = await axiosInstance.get('/users')
        return response.data
    } catch (error) {
        throw new Error(`Failed to get user: ${error}`)
    }
}

export const getWallet = async (): Promise<Wallet> => {
    try {
        const response = await axiosInstance.get('/users/wallet')
        return response.data
    } catch (error) {
        throw new Error(`Failed to get wallet: ${error}`)
    }
}

export const updateUser = async (req: UserRequest): Promise<UserResponse> => {
    try {
        const response = await axiosInstance.put('/users', req)
        return response.data
    } catch (error) {
        throw new Error(`Failed to update user: ${error}`)
    }
}

export const updatePassword = async (req: ChangePassRequest) => {
    try {
        await axiosInstance.put('/users/change-password', req)
    } catch (error) {
        throw new Error(`Failed to change password: ${error}`)
    }
}

export const updateAvatar = async (file: File): Promise<string> => {
    try {
        const formData = new FormData();
        formData.append(`file`, file);

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };

        const response = await axiosInstance.post(`/users/avatar`, formData, config);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to update avatar: ${error}`);
    }
};

export default {
    getUser,
    getWallet,
    updateUser,
    updatePassword,
    updateAvatar,
}