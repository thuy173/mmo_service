/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrderRequest, OrderResponse } from "@/models/order";
import axiosInstance from "./agent";
import { PageResponse } from "@/models/pageResponse";

export const addOrder = async (req: OrderRequest): Promise<OrderResponse> => {
    try {
        const response = await axiosInstance.post(`/orders`, req)
        return response.data
    } catch (error) {
        throw new Error(`Failed to add order: ${error}`)
    }
}

export const getOrders = async (
    orderCode?: string,
    createdAt?: string,
    daysRange?: number,
    pageNumber?: number,
    pageSize?: number,
    sortField?: string,
    sortDirection?: string
): Promise<PageResponse<OrderResponse>> => {
    try {
        // Construct the query parameters
        const params: Record<string, string | number | undefined> = {};

        if (orderCode) params.orderCode = orderCode;
        if (createdAt) params.createdAt = createdAt;
        if (daysRange !== undefined && daysRange !== 0) params.daysRange = daysRange;
        if (pageNumber !== undefined) params.pageNumber = pageNumber;
        if (pageSize !== undefined) params.pageSize = pageSize;
        if (sortField) params.sortField = sortField;
        if (sortDirection) params.sortDirection = sortDirection;

        // Convert params object to a query string
        const queryString = new URLSearchParams(params as any).toString();
        const url = `/orders${queryString ? `?${queryString}` : ""}`;

        const response = await axiosInstance.get<PageResponse<OrderResponse>>(url);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to get orders`)
    }
}

export const getOrderById = async (id: string): Promise<OrderResponse> => {
    try {
        const response = await axiosInstance.get<OrderResponse>(`/orders/${id}`)
        return response.data
    } catch (error) {
        throw new Error(`Failed to get order account: ${error}`)
    }
}

export const deleteOrder = async (id: string) => {
    try {
        await axiosInstance.delete(`/orders/${id}`)
    } catch (error) {
        throw new Error(`Failed to delete order: ${error}`)
    }
}

export const deleteManyOrders = async (ids: string[]) => {
    try {
        await axiosInstance.delete(`/orders/many/${ids}`)
    } catch (error) {
        throw new Error(`Failed to delete many orders: ${error}`)
    }
}

export default {
    addOrder,
    getOrders,
    getOrderById,
    deleteOrder,
    deleteManyOrders,
}