import { PaymentMethod } from "@/models/paymentMethod";
import axiosInstance from "./agent";

export const getAllPaymentMethods = async (): Promise<PaymentMethod[]> => {
    try {
        const response = await axiosInstance.get('/payment-methods')
        return response.data
    } catch (error) {
        throw new Error(`Failed to get all payment methods: ${error}`)
    }
}

export default {
    getAllPaymentMethods,
}