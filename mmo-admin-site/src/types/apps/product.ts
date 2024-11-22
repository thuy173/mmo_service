import { SubProductCategoryDto } from "./productCategory";

export interface ProductDto {
  id: number;
  productSubCategory: SubProductCategoryDto;
  name: string;
  sellPrice: number;
  capitalPrice: number;
  availableAccountQty: number;
  soldAccountQty: number;
  productCode: string;
  discount: number;
  checkLiveAccountStatus: string;
  minPurchaseQuantity: number;
  maxPurchaseQuantity: number;
  countryCode: string;
  shortDescription: string;
  detailDescription: string;
  noteFileTxt: string;
  image: string;
  priorityNum: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
