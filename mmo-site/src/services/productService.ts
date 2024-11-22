/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product, ShortProduct } from "@/models/product";
import axiosInstance from "./agent";
import { PageResponse } from "@/models/pageResponse";

export const getAllProducts = async (
    name?: string,
    subProductCategoryId?: number,
    pageNumber?: number,
    pageSize?: number,
    sortField?: string,
    sortDirection?: string
): Promise<PageResponse<ShortProduct>> => {
    try {
        // Construct the query parameters
        const params: Record<string, string | number | undefined> = {};

        if (name) params.name = name;
        if (subProductCategoryId !== undefined && subProductCategoryId !== 0) params.subProductCategoryId = subProductCategoryId;
        if (pageNumber !== undefined) params.pageNumber = pageNumber;
        if (pageSize !== undefined) params.pageSize = pageSize;
        if (sortField) params.sortField = sortField;
        if (sortDirection) params.sortDirection = sortDirection;

        // Convert params object to a query string
        const queryString = new URLSearchParams(params as any).toString();
        const url = `/products${queryString ? `?${queryString}` : ""}`;

        const response = await axiosInstance.get<PageResponse<ShortProduct>>(url);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to get all products: ${error}`);
    }
};

export const getProductById = async (id: number): Promise<Product> => {
    try {
        const response = await axiosInstance.get<Product>(`/products/${id}`)
        return response.data
    } catch (error) {
        throw new Error(`Failed to get product by id ${id}: ${error}`)
    }
}

export default {
    getAllProducts,
    getProductById,
}