/* eslint-disable @typescript-eslint/no-explicit-any */
import { Coupon } from "@/models/coupon";
import axiosInstance from "./agent";

export const searchCoupon = async (productId: number, code: string): Promise<Coupon> => {
    try {
        const response = await axiosInstance.get<Coupon>(`/coupons/search?productId=${productId}&code=${code}`)
        return response.data
    } catch (error) {
        throw new Error(`Failed to get order account: ${error}`)
    }
}

export default {
    searchCoupon,
}