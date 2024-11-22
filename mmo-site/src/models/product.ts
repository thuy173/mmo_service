import { ShortSubProductCategory } from "./subProductCategory";

export interface Product {
    id: number;
    productSubCategory: ShortSubProductCategory;
    name: string;
    productCode: string;
    sellPrice: number;
    capitalPrice: number;
    discount: number;
    availableAccountQty: number;
    soldAccountQty: number;
    checkLiveAccountStatus: boolean;
    active: boolean;
    minPurchaseQuantity: number;
    maxPurchaseQuantity: number;
    countryCode: string;
    shortDescription: string;
    detailDescription: string;
    image: string;
    priorityNum: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ShortProduct {
    id: number;
    productSubCategory: ShortSubProductCategory;
    name: string;
    productCode: string;
    sellPrice: number;
    discount: number;
    availableAccountQty: number;
    soldAccountQty: number;
    checkLiveAccountStatus: boolean;
    countryCode: string;
    shortDescription: string;
    detailDescription: string;
    image: string;
    priorityNum: number;
    createdAt: Date;
    updatedAt: Date;
}