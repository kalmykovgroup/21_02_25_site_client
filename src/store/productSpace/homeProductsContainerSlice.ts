/*

import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {
    ShortProductDtoUiExtended
} from "../../api/ProductSpace/ProductService/UI/ShortProductDtoUiExtended.ts";
import {ProductsMainPagedResponse} from "../../api/ProductSpace/ProductService/Responses/ProductsMainPagedResponse.ts";
import {fetchProductsMainPage} from "../../api/ProductSpace/ProductService/ProductService.ts";
import axios from "axios";
import {store} from "../store.ts";
import {addNotification} from "../notificationsSlice.ts";
import {
    mapRecommendedGroupUI,
    RecommendedGroupDtoUiExtended
} from "../../api/ProductSpace/ProductService/UI/RecommendedGroupDtoUiExtended.ts";
import {WishListItemDto} from "../../api/ProductSpace/WishListService/Dtos/WishListItemDto.ts";
import {RootState} from "../types.ts";

interface HomeProductContainerState {
    loading: boolean;

    products: ShortProductDtoUiExtended[];
    hasMoreProducts: boolean;

    recommendedGroupsDto : RecommendedGroupDtoUiExtended[];
    hasMoreRecommendedGroups: boolean;

    currentPage: number;
    nextPage: number;
}

const initialState: HomeProductContainerState = {
    loading: false,

    products: [],
    hasMoreProducts: true,

    recommendedGroupsDto: [],
    hasMoreRecommendedGroups: true,

    currentPage: 0,
    nextPage: 1,
};

interface ProductsMainPagedResponseExtension extends ProductsMainPagedResponse {
    wishList: WishListItemDto[];
}

// Запрос списка товаров с пагинацией и фильтрацией
export const fetchHomeProductsThunk = createAsyncThunk<
    ProductsMainPagedResponseExtension,
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

const homeProductsContainerSlice = createSlice({
    name: "homeProductsContainerSlice",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHomeProductsThunk.pending, (state) => {
                state.loading = true;

            })
            .addCase(fetchHomeProductsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.currentPage = action.payload.page; // Обновляем текущую страницу
                state.nextPage = action.payload.page + 1

                state.hasMoreRecommendedGroups = action.payload.hasMoreRecommendedGroups
                state.hasMoreProducts = action.payload.hasMoreProducts


                // 🔹 Создаем `Set` с существующими ID товаров, чтобы избежать дублирования
                const existingIds = new Set(state.products.map((p) => p.id));
                // 🔹 Фильтруем `action.payload.items`, оставляя только новые товары (исключаем уже загруженные)
                const newItems = action.payload.products.filter((p) => !existingIds.has(p.id));
                // 🔹 Добавляем новые товары к `state.products`, но **не перезаписываем**, а дополняем список

                const wishListIds = new Set(action.payload.wishList.map((wl_item : WishListItemDto) => wl_item.id));

                const updatedNewItems: ShortProductDtoUiExtended[] = newItems.map(p => ({
                    ...p,
                    isFavorite: wishListIds.has(p.id) // Если товар есть в wishList, устанавливаем isFavorite
                }));

                state.products = [...state.products, ...updatedNewItems];

                // 🔹 Создаем `Set` с существующими ID товаров, чтобы избежать дублирования
                const existingIdsGroups = new Set(state.recommendedGroupsDto.map((group) => group.id));
                // 🔹 Фильтруем `action.payload.items`, оставляя только новые товары (исключаем уже загруженные)
                const newItemsGroups = action.payload.recommendedGroupsDto.filter((g) => !existingIdsGroups.has(g.id));
                // 🔹 Добавляем новые товары к `state.products`, но **не перезаписываем**, а дополняем список

                state.recommendedGroupsDto = [...state.recommendedGroupsDto, ...newItemsGroups.map(group => mapRecommendedGroupUI(group, wishListIds))];
            })
            .addCase(fetchHomeProductsThunk.rejected, (state, action) => {
                state.loading = false;
                store.dispatch(addNotification({ message: action.error.message ?? "Error loading products", type: "error" }));

            })
    }
})



export default homeProductsContainerSlice.reducer;

*/
