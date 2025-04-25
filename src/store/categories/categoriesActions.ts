// Запрос списка товаров с пагинацией и фильтрацией
import {createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "../types.ts";
import axios from "axios";
import {CategoryDto} from "../../api/CategorySpace/CategoryService/Dtos/CategoryDto.ts";
import {CategoryDtoUiExtended} from "../../api/CategorySpace/CategoryService/Ui/CategoryDtoUiExtended.ts";
import {fetchCategories} from "../../api/CategorySpace/CategoryService/CategoryService.ts";

interface PathSegment{
    segment: string;
    name: string;
}

export const extendCategoriesWithPaths = (
    categories: CategoryDto[],
    parentPathSegments: PathSegment[] = []
): CategoryDtoUiExtended[] => {
    return categories.map((category) => {
        // Создаем текущий сегмент пути
        const currentPathSegment: PathSegment = {
            segment: category.path,
            name: category.name,
        };

        // Объединяем путь родительских категорий с текущим сегментом
        const currentPathSegments = [...parentPathSegments, currentPathSegment];

        // Рекурсивно обрабатываем подкатегории
        const extendedSubCategories = extendCategoriesWithPaths(
            category.subCategories,
            currentPathSegments
        );

        // Возвращаем расширенную категорию с добавленным полем pathSegments
        return {
            ...category,
            pathSegments: currentPathSegments,
            subCategories: extendedSubCategories,
        };
    });
};


// ✅ Асинхронный запрос для получения категорий
export const fetchCategoriesThunk = createAsyncThunk(
    "categories/fetchCategories",
    async (_, {getState, rejectWithValue }) => {
        const state = getState() as RootState;
        // Если категории уже загружены, отменяем запрос
        if (state.categories.isFetched) {
            return rejectWithValue("Категории уже загружены");
        }
        try {
            console.log("Запрос на получение Категорий")
            return await fetchCategories(); // Возвращаем данные
        } catch (error) {

            let errorMessage = "Ошибка сервера";
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || `Ошибка ${error.response?.status}`;
            }

            return rejectWithValue(errorMessage);
        }
    }
);