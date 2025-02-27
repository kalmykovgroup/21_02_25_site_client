// Конфигурация `persistReducer`
import storage from "redux-persist/lib/storage";
import {persistReducer} from "redux-persist";
import {createSlice} from "@reduxjs/toolkit";
import {ShortProductDtoUiExtended} from "../../api/ProductSpace/ProductService/UI/ShortProductDtoUiExtended.ts";

interface SearchProductContainerState {
    loading: boolean;
    products: ShortProductDtoUiExtended[];
    page: number;
    hasMore: boolean;
}

const initialState: SearchProductContainerState = {
    loading: false,
    products: [],
    page: 1,
    hasMore: true,
};

const searchProductsContainerSlice = createSlice({
    name: "searchProductsContainerSlice",
    initialState,
    reducers: {}
})

const persistConfig = {
    key: "searchProductsContainerSlice",
    storage,
    blacklist: [], //Пишем имена полей, которые не нужно сохранять.
};

export const persistedSearchProductsContainerReducer = persistReducer(persistConfig, searchProductsContainerSlice.reducer);

