/* eslint-disable @typescript-eslint/no-explicit-any */
import { Post, ShortPost } from "@/models/post";
import axiosInstance from "./agent";
import { PageResponse } from "@/models/pageResponse";

export const getAllPosts = async (
    title?: string,
    postCategoryId?: number,
    pageNumber?: number,
    pageSize?: number,
    sortField?: string,
    sortDirection?: string
): Promise<PageResponse<ShortPost>> => {
    try {
        // Construct the query parameters
        const params: Record<string, string | number | undefined> = {};

        if (title) params.title = title;
        if (postCategoryId !== undefined) params.postCategoryId = postCategoryId;
        if (pageNumber !== undefined) params.pageNumber = pageNumber;
        if (pageSize !== undefined) params.pageSize = pageSize;
        if (sortField) params.sortField = sortField;
        if (sortDirection) params.sortDirection = sortDirection;

        // Convert params object to a query string
        const queryString = new URLSearchParams(params as any).toString();
        const url = `/posts${queryString ? `?${queryString}` : ""}`;

        const response = await axiosInstance.get<PageResponse<ShortPost>>(url);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to get all posts: ${error}`);
    }
};

export const getPostById = async (id: number): Promise<Post> => {
    try {
        const response = await axiosInstance.get<Post>(`/posts/${id}`)
        return response.data
    } catch (error) {
        throw new Error(`Failed to get post by id ${id}: ${error}`)
    }
}

export default {
    getAllPosts,
    getPostById,
}