import { ProductCategory } from "@/models/productCategory";
import axiosInstance from "./agent";

export const getAllProductCategories = async (): Promise<ProductCategory[]> => {
    try {
        const response = await axiosInstance.get<ProductCategory[]>(`/product-categories`)
        return response.data
    } catch (error) {
        throw new Error(`Failed to get all product categories: ${error}`)
    }
}

export default {
    getAllProductCategories,
}