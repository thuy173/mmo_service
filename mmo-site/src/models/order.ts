export interface OrderRequest {
    productId: number;
    couponId: number;
    quantity: number;
}

export interface OrderResponse {
    id: string;
    userId: number;
    product: {
        id: number;
        name: string;
        description: string;
    },
    orderCode: string;
    quantity: number;
    amount: number;
    accounts: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
}