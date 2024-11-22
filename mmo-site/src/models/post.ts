export interface Post {
    id: number;
    title: string;
    postCategoryId: number;
    thumbnailUrl: string;
    shortContent: string;
    content: string;
    active: boolean;
    authorId: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ShortPost {
    id: number;
    title: string;
    postCategoryId: number;
    thumbnailUrl: string;
    shortContent: string;
    authorId: number;
    updatedAt: Date;
}