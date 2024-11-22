export interface AccountResponseDto {
  id: string;
  account: string;
  productCode: string;
  orderCode: string;
  createdAt: string;
  updateAt: string;
}

export interface AccountRequestTextDto {
  productId: number;
  account: string;
}
export interface AccountRequestFileDto {
  productId: number;
  file: string;
}
