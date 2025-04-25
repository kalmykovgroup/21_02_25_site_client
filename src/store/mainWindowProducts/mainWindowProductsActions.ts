// Запрос списка товаров с пагинацией и фильтрацией
import {createAsyncThunk} from "@reduxjs/toolkit";
import {
    ProductsMainPagedResponseUiExtended
} from "../../api/ProductSpace/ProductService/UI/ProductsMainPagedResponseUiExtended.ts";
import {RootState} from "../types.ts";
import {fetchProductsMainPage} from "../../api/ProductSpace/ProductService/ProductService.ts";
import axios from "axios";

export const fetchMainWindowProductsThunk = createAsyncThunk<
    ProductsMainPagedResponseUiExtended,
    { page: number;},
    { rejectValue: string, state: RootState  }
>(
    "products/home-page",
    async ({ page }, { rejectWithValue, getState  }) => {
        try {
            console.log(`✅ Запрос на получение продуктов главной страницы page: ${page}`)
            const response =  await fetchProductsMainPage({ page });


            const state = getState(); // Получаем весь state

            return {
                ...response,
                wishList: state.wishList.wishList,
            }

        } catch (error) {

            let errorMessage = "Ошибка сервера";
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || `Ошибка ${error.response?.status}`;
            }

            return rejectWithValue(errorMessage);
        }
    }
);