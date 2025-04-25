import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {CategoryDto} from "../../api/CategorySpace/CategoryService/Dtos/CategoryDto.ts";
import {CategoryDtoUiExtended} from "../../api/CategorySpace/CategoryService/Ui/CategoryDtoUiExtended.ts";
import {extendCategoriesWithPaths, fetchCategoriesThunk} from "./categoriesActions.ts";
import {CATEGORIES_KEY} from "../constants.ts";
import {persistReducer} from "redux-persist";
import {categoriesPersistConfig} from "./categoriesPersistConfig.ts";
import {LoadingStatus} from "../types.ts";

interface CategoryState {
    categories: CategoryDtoUiExtended[];
    status: LoadingStatus; //Если идет загрузка категорий
    isFetched: boolean; //Если идет загрузка категорий
    isOpenCategoryMenu: boolean; //Открыто ли меню категорий

}


const initialState: CategoryState = {
    categories: [],
    status: LoadingStatus.Idle,
    isFetched: false,
    isOpenCategoryMenu: false,
};



const categoriesSlice = createSlice({
    name: CATEGORIES_KEY,
    initialState,
    reducers: {

        setIsOpenCategoryMenu: (state, action: PayloadAction<boolean>) => {
            state.isOpenCategoryMenu = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategoriesThunk.pending, (state) => {
                state.status = LoadingStatus.Loading;
            })
            .addCase(fetchCategoriesThunk.fulfilled, (state, action: PayloadAction<CategoryDto[]>) => {
                state.isFetched = true; // Категории загружены
                state.categories = extendCategoriesWithPaths(action.payload);
                state.status = LoadingStatus.Succeeded;
            })
            .addCase(fetchCategoriesThunk.rejected, (state) => {
                state.status = LoadingStatus.Failed;
            });
    },
});


export const {setIsOpenCategoryMenu} = categoriesSlice.actions;

const categoriesReducer = persistReducer(categoriesPersistConfig, categoriesSlice.reducer);
export default categoriesReducer