export interface Coupon {
    id: number;
    couponCode: string;
    discount: number;
    minOrderAmount: number;
    maxOrderAmount: number;
}