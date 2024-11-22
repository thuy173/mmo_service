export interface ProductCategoryDto {
  id: number;
  name: string;
  icon: string;
  description: string;
  active: boolean;
  orderNum: number;
  subProductCategoryDto: SubProductCategoryDto;
}

export interface SubProductCategoryDto {
  id: number;
  productCategoryId: number;
  name: string;
  icon: string;
  description: string;
  active: boolean;
  orderNum: number;
}
