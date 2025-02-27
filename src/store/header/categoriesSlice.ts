import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {CategoryDto} from "../../api/CategorySpace/CategoryService/Dtos/CategoryDto.ts";
import {fetchCategories} from "../../api/CategorySpace/CategoryService/CategoryService.ts";


interface CategoryState {
    categories: CategoryDto[];

    isOpenCategoryMenu: boolean; //Открыто ли меню категорий
    isLoading: boolean; //Если идет загрузка категорий
    selectedCategory?: CategoryDto; //Выбранная категория
}


const initialState: CategoryState = {
    categories: [],

    isOpenCategoryMenu: false,
    isLoading: false,
    selectedCategory: undefined,
};

// ✅ Асинхронный запрос для получения категорий
export const fetchCategoriesThunk = createAsyncThunk(
    "categories/fetchCategories",
    async (_, { rejectWithValue }) => {
        try {
             // Запрос к API
            return await fetchCategories(); // Возвращаем данные
        } catch (error) {
            return rejectWithValue("Ошибка загрузки категорий");
        }
    }
);

const categorySlice = createSlice({
    name: "categories",
    initialState,
    reducers: {
        setSelectedCategory(state, action: PayloadAction<CategoryDto>) {
            state.selectedCategory = action.payload;
        },
        setIsOpenCategoryMenu: (state, action: PayloadAction<boolean>) => {
            state.isOpenCategoryMenu = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategoriesThunk.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCategoriesThunk.fulfilled, (state, action: PayloadAction<CategoryDto[]>) => {
                state.categories = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchCategoriesThunk.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const {setIsOpenCategoryMenu, setSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;
