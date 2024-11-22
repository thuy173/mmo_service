export interface CouponDto {
  id: number;
  couponCode: string;
  quantity: number;
  discount: number;
  minOrderAmount: number;
  maxOrderAmount: number;
  createdAt: string;
  updateAt: string;
  applyAll: boolean;
}
export interface CouponRequest {
  id: number;
  quantity: number;
  discount: number;
  minOrderAmount: number;
  maxOrderAmount: number;
  applyAll: boolean;
}
