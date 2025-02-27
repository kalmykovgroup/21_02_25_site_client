
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    mapShortProductUI,
    ShortProductDtoUiExtended
} from "../../api/ProductSpace/ProductService/UI/ShortProductDtoUiExtended.ts";
import {ProductsMainPagedResponse} from "../../api/ProductSpace/ProductService/Responses/ProductsMainPagedResponse.ts";
import {fetchProductsMainPage} from "../../api/ProductSpace/ProductService/ProductService.ts";
import axios from "axios";
import {store} from "../store.ts";
import {addNotification} from "../notificationSlice.ts";
import {
    mapRecommendedGroupUI,
    RecommendedGroupDtoUiExtended
} from "../../api/ProductSpace/ProductService/UI/RecommendedGroupDtoUiExtended.ts";

interface HomeProductContainerState {
    loading: boolean;

    products: ShortProductDtoUiExtended[];
    hasMoreProducts: boolean;

    recommendedGroupsDto : RecommendedGroupDtoUiExtended[];
    hasMoreRecommendedGroups: boolean;

    page: number;
}

const initialState: HomeProductContainerState = {
    loading: false,

    products: [],
    hasMoreProducts: true,

    recommendedGroupsDto: [],
    hasMoreRecommendedGroups: true,

    page: 1
};

// Запрос списка товаров с пагинацией и фильтрацией
export const fetchHomeProductsThunk = createAsyncThunk<
    ProductsMainPagedResponse,
    { page: number;},
    { rejectValue: string }
>(
    "products/home-page",
    async ({ page }, { rejectWithValue }) => {
        try {
           return  await fetchProductsMainPage({ page });

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
        setHomePage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHomeProductsThunk.pending, (state) => {
                state.loading = true;

            })
            .addCase(fetchHomeProductsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.page = action.payload.page; // Обновляем текущую страницу

                state.hasMoreRecommendedGroups = action.payload.hasMoreRecommendedGroups
                state.hasMoreProducts = action.payload.hasMoreProducts

                console.log( action.payload);

                // 🔹 Создаем `Set` с существующими ID товаров, чтобы избежать дублирования
                const existingIds = new Set(state.products.map((p) => p.id));
                // 🔹 Фильтруем `action.payload.items`, оставляя только новые товары (исключаем уже загруженные)
                const newItems = action.payload.products.filter((p) => !existingIds.has(p.id));
                // 🔹 Добавляем новые товары к `state.products`, но **не перезаписываем**, а дополняем список
                state.products = [...state.products, ...newItems.map(p => mapShortProductUI(p))];


                // 🔹 Создаем `Set` с существующими ID товаров, чтобы избежать дублирования
                const existingIdsGroups = new Set(state.recommendedGroupsDto.map((group) => group.id));
                // 🔹 Фильтруем `action.payload.items`, оставляя только новые товары (исключаем уже загруженные)
                const newItemsGroups = action.payload.recommendedGroupsDto.filter((g) => !existingIdsGroups.has(g.id));
                // 🔹 Добавляем новые товары к `state.products`, но **не перезаписываем**, а дополняем список
                state.recommendedGroupsDto = [...state.recommendedGroupsDto, ...newItemsGroups.map(group => mapRecommendedGroupUI(group))];
            })
            .addCase(fetchHomeProductsThunk.rejected, (state, action) => {
                state.loading = false;
                store.dispatch(addNotification({ message: action.error.message ?? "Error loading products", type: "error" }));

            })
    }
})

/*const persistConfig = {
    key: "homeProductsContainerSlice",
    storage,
    blacklist: [], //Пишем имена полей, которые не нужно сохранять.
};*/
export const {setHomePage } = homeProductsContainerSlice.actions;
export const persistedHomeProductsContainerReducer = homeProductsContainerSlice.reducer;

