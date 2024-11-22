/* eslint-disable @typescript-eslint/no-explicit-any */
import { PostCategory } from "@/models/postCategory";
import axiosInstance from "./agent";
import { PageResponse } from "@/models/pageResponse";

export const getAllPostCategories = async (
    pageNumber?: number,
    pageSize?: number,
    sortField?: string,
    sortDirection?: string
): Promise<PageResponse<PostCategory>> => {
    try {
        // Construct the query parameters
        const params: Record<string, string | number | undefined> = {};

        if (pageNumber !== undefined) params.pageNumber = pageNumber;
        if (pageSize !== undefined) params.pageSize = pageSize;
        if (sortField) params.sortField = sortField;
        if (sortDirection) params.sortDirection = sortDirection;

        // Convert params object to a query string
        const queryString = new URLSearchParams(params as any).toString();
        const url = `/post-categories${queryString ? `?${queryString}` : ""}`;

        const response = await axiosInstance.get<PageResponse<PostCategory>>(url);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to get all post categories: ${error}`);
    }
};


export default {
    getAllPostCategories,
}