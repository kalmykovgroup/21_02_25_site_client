import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    mapShortProductUI,
    ShortProductDtoUiExtended
} from "../../api/ProductSpace/ProductService/UI/ShortProductDtoUiExtended.ts";
import {persistReducer} from "redux-persist";
import {filterProductsPersistConfig} from "./filterProductsPersistConfig.ts";
import {fetchFilterProductsThunk} from "./filterProductsActions.ts";
import {LoadingStatus} from "../types.ts";
import {FILTER_PRODUCTS_KEY} from "../constants.ts";

interface FilterProductsState {
    status: LoadingStatus;

    products: ShortProductDtoUiExtended[];
    currentPage: number;
    nextPage: number;
    hasMore: boolean;
    categoryId: string | undefined;
}

const initialState: FilterProductsState = {
    status: LoadingStatus.Idle,

    products: [],
    currentPage: 0,
    nextPage: 1,
    hasMore: true,
    categoryId: undefined,
};


const filterProductsSlice = createSlice({
    name: FILTER_PRODUCTS_KEY,
    initialState,
    reducers: {
        setCategoryId(state, action: PayloadAction<string>) {
            state.categoryId = action.payload;
        },
        resetFilterProductsSlice(state) {
            state.status = LoadingStatus.Idle;
            state.products = [];
            state.currentPage = 0;
            state.nextPage = 1;
            state.hasMore = true;
            state.categoryId = undefined;
        },
    },
    extraReducers: (builder) => {
        builder

            .addCase(fetchFilterProductsThunk.pending, (state) => {
                state.status = LoadingStatus.Loading;

            })
            .addCase(fetchFilterProductsThunk.fulfilled, (state, action) => {
                state.status = LoadingStatus.Succeeded;

                state.hasMore = action.payload.hasMore; // Обновляем кол-во страниц

                state.currentPage = action.payload.page; // Обновляем текущую страницу
                state.nextPage = action.payload.page + 1

                const existingIds = new Set(state.products.map((p) => p.id));

                const newItems = action.payload.items.filter((p) => !existingIds.has(p.id));

                state.products = [...state.products, ...newItems.map(p => mapShortProductUI(p))];
            })
            .addCase(fetchFilterProductsThunk.rejected, (state) => {
                state.status = LoadingStatus.Failed;
            })


    },
});



export const {setCategoryId, resetFilterProductsSlice} = filterProductsSlice.actions;


const filterProductsReducer = persistReducer(filterProductsPersistConfig, filterProductsSlice.reducer);

export default filterProductsReducer