/* eslint-disable @typescript-eslint/no-explicit-any */
import { Transaction } from "@/models/transaction";
import axiosInstance from "./agent";
import { PageResponse } from "@/models/pageResponse";

export const getTransactions = async (
    reason?: string,
    createdAt?: string,
    daysRange?: number,
    pageNumber?: number,
    pageSize?: number,
    sortField?: string,
    sortDirection?: string
): Promise<PageResponse<Transaction>> => {
    try {
        // Construct the query parameters
        const params: Record<string, string | number | undefined> = {};

        if (reason) params.reason = reason;
        if (createdAt) params.createdAt = createdAt;
        if (daysRange !== undefined && daysRange !== 0) params.daysRange = daysRange;
        if (pageNumber !== undefined) params.pageNumber = pageNumber;
        if (pageSize !== undefined) params.pageSize = pageSize;
        if (sortField) params.sortField = sortField;
        if (sortDirection) params.sortDirection = sortDirection;

        // Convert params object to a query string
        const queryString = new URLSearchParams(params as any).toString();
        const url = `/transactions${queryString ? `?${queryString}` : ""}`;

        const response = await axiosInstance.get<PageResponse<Transaction>>(url);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to get transactions`)
    }
}

export default {
    getTransactions,
}