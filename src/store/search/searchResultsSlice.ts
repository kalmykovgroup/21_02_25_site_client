import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import { searchPersistConfig } from "./searchPersistConfig";
import { fetchSearchProductsThunk } from "./searchActions";
import {
    mapShortProductUI,
    ShortProductDtoUiExtended
} from "../../api/ProductSpace/ProductService/UI/ShortProductDtoUiExtended.ts";
import {LoadingStatus} from "../types.ts";
import {SEARCH_RESULTS_KEY} from "../constants.ts";

interface SearchResultState {
    endQuery: string, // Последний запрос

    results: ShortProductDtoUiExtended[],

    status: LoadingStatus;
    error: string | null;

    currentPage: number,
    nextPage: number,
    hasMore: boolean,

    searchHistory: string[];
}



const initialState : SearchResultState = {
    endQuery: "", // Последний запрос

    results: [],

    status: LoadingStatus.Idle,
    error: null,

    currentPage: 0,
    nextPage: 1,
    hasMore: true,

    searchHistory: []
};

const searchResultsSlice = createSlice({
    name: SEARCH_RESULTS_KEY,
    initialState,
    reducers: {
        setEndQuery: (state, action: PayloadAction<string>) => {
            state.endQuery = action.payload;
        },
        clearEndQuery: (state) => {
            state.endQuery = "";
        },
        clearSearchResults: (state) => {
            state.results = [];

            state.status = LoadingStatus.Idle;
            state.error = null;

            state.currentPage = 0;
            state.nextPage = 1;
            state.hasMore = true;
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        setNextPage: (state, action: PayloadAction<number>) => {
            state.nextPage = action.payload;
        },
        setHasMore: (state, action: PayloadAction<boolean>) => {
            state.hasMore = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSearchProductsThunk.pending, (state) => {
                state.status = LoadingStatus.Loading;
            })
            .addCase(fetchSearchProductsThunk.fulfilled, (state, action) => {
                state.status = LoadingStatus.Succeeded;

                state.currentPage = action.payload.page; // Обновляем текущую страницу
                state.nextPage = action.payload.page + 1

                const existingIds = new Set(state.results.map((p) => p.id));
                const newItems = action.payload.items.filter((p) => !existingIds.has(p.id));
                state.results = [...state.results, ...newItems.map(p => mapShortProductUI(p))];

                state.hasMore = action.payload.hasMore;
            })
            .addCase(fetchSearchProductsThunk.rejected, (state, action) => {
                state.status = LoadingStatus.Failed;
                state.error =  action.error.message ?? "Error request";
            });
    },
});

export const { setEndQuery, clearEndQuery, clearSearchResults, setCurrentPage, setNextPage, setHasMore } = searchResultsSlice.actions;

// ✅ Экспортируем сам редюсер
const searchResultsReducer = persistReducer(searchPersistConfig, searchResultsSlice.reducer);

export default searchResultsReducer;
