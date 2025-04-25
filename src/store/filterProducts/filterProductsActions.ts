// Запрос списка товаров с пагинацией и фильтрацией
import {createAsyncThunk} from "@reduxjs/toolkit";
import {ProductPagedResult} from "../../api/ProductSpace/ProductService/Responses/ProductPagedResult.ts";
import {RootState} from "../types.ts";
import {fetchProducts} from "../../api/ProductSpace/ProductService/ProductService.ts";
import axios from "axios";

export const fetchFilterProductsThunk = createAsyncThunk<
    ProductPagedResult,
    {page: number, categoryId: string},
    {  rejectValue: string; state: RootState }
>(
    "products/fetchFilterProducts",
    async ({page, categoryId}, {rejectWithValue}) => {

        try {
            console.log(`✅ Запрос на получение продуктов (Filter) page: ${page}`)

            return await fetchProducts({ page: page, search: undefined, categoryId: categoryId });
        } catch (error) {

            let errorMessage = "Ошибка сервера";
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || `Ошибка ${error.response?.status}`;
            }

            return rejectWithValue(errorMessage);
        }
    }
);