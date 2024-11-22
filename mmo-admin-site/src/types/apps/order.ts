export interface OrderDto {
  id: string;
  userId: string;
  product: ProductOrderDto;
  orderCode: string;
  quantity: number;
  amount: number;
  accounts: number;
  createdAt: string;
  updateAt: string;
  isDeleted: boolean;
}

export interface ProductOrderDto {
  id: number;
  name: string;
  description: string;
}
