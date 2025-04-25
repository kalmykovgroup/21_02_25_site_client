import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {fetchAutocompleteSuggestions} from "./searchActions.ts";
import {SEARCH_KEY} from "../constants.ts";

interface searchSliceState{
    query: string;
    history: string[];
    suggestions: string[], // Подсказки от сервера
    loadingSuggestions: boolean,
}


const initialState: searchSliceState  = {
    query: "", // Введенный текст
    history: [], // История поиска
    suggestions: [], // История поиска
    loadingSuggestions: false,
};

const searchSlice = createSlice({
    name: SEARCH_KEY,
    initialState,
    reducers: {
        setQuery: (state, action: PayloadAction<string>) => {
            state.query = action.payload;
        },
        clearQuery: (state) => {
            state.query = "";
        },

        addToHistory: (state, action: PayloadAction<string>) => {
            const newQuery = action.payload;

            // 🔹 Удаляем `newQuery`, если он уже есть (чтобы избежать дублирования)
            state.history = state.history.filter(query => query !== newQuery);

            // 🔹 Добавляем `newQuery` в начало списка
            state.history.unshift(newQuery);

            // 🔹 Ограничиваем историю 10 последними запросами
            if (state.history.length > 10) {
                state.history.pop();
            }
        },
        clearHistory: (state) => {
            state.history = [];
        },
        removeHistoryItem: (state, action: PayloadAction<string>) => {
            state.history = state.history.filter(item => item !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAutocompleteSuggestions.pending, (state) => {
                state.loadingSuggestions = true;
            })

            .addCase(fetchAutocompleteSuggestions.fulfilled, (state, action) => {

                state.loadingSuggestions = false;
                state.suggestions = action.payload.suggestions;
            })
            .addCase(fetchAutocompleteSuggestions.rejected, (state) => {

                state.loadingSuggestions = false;
            })
    }
});

export const { setQuery, clearQuery, addToHistory, clearHistory, removeHistoryItem } = searchSlice.actions;
export default searchSlice.reducer;
