import { createAsyncThunk } from "@reduxjs/toolkit";
import {ProductPagedResult} from "../../api/ProductSpace/ProductService/Responses/ProductPagedResult.ts";

import {
    fetchGetProductNameSuggestions,
    fetchSearchProducts
} from "../../api/ProductSpace/ProductService/ProductService.ts";
import axios from "axios";
import {
    GetProductNameSuggestionsResponse
} from "../../api/ProductSpace/ProductService/Responses/GetProductNameSuggestionsResponse.ts";
import {setEndQuery} from "./searchResultsSlice.ts";

export const fetchSearchProductsThunk = createAsyncThunk<
    ProductPagedResult,
    {query: string, page: number},
    {  rejectValue: string;}
>(
    "search/fetchSearchProducts",
    async (
        {query, page},
        {dispatch, rejectWithValue}) => {
         dispatch(setEndQuery(query));
        try {
            console.log(`✅ Запрос на получение продуктов (page: ${page} | ${query})`)

            return await fetchSearchProducts({ page , query});
        } catch (error) {

            let errorMessage = "Ошибка сервера";
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || `Ошибка ${error.response?.status}`;
            }

            return rejectWithValue(errorMessage);
        }
    }
);


export const fetchAutocompleteSuggestions  = createAsyncThunk<
    GetProductNameSuggestionsResponse, // ✅ Тип возвращаемых данных
    string, // ✅ Тип входного аргумента
    { rejectValue: string } // ✅ Тип ошибки
>(
    "search/fetchSuggestions",
    async (query, { rejectWithValue }) => {
        try {
            console.log("✅ Запрос на получение подсказок")
            return await fetchGetProductNameSuggestions(query);
        } catch (error) {

            let errorMessage = "Ошибка сервера";
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || `Ошибка ${error.response?.status}`;
            }

            return rejectWithValue(errorMessage); // ✅ Теперь возвращается только строка
        }
    }
);

