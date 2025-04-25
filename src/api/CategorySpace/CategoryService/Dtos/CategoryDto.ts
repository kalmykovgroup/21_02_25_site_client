export interface CategoryDto {
    id: string;
    parentCategoryId?: string;
    icon?: string;
    name: string;
    description?: string;
    path: string;
    level: number;
    index: number;

    subCategories: CategoryDto[]
}