import { ShortSubProductCategory } from "./subProductCategory";

export interface ProductCategory {
    id: number;
    name: string;
    iconUrl: string;
    description: string;
    active: boolean;
    orderNum: string;
    subProductCategories: ShortSubProductCategory[];
}