import {ShortProductDtoUiExtended} from "../../api/ProductSpace/ProductService/UI/ShortProductDtoUiExtended.ts";
import {
    mapRecommendedGroupUI,
    RecommendedGroupDtoUiExtended
} from "../../api/ProductSpace/ProductService/UI/RecommendedGroupDtoUiExtended.ts";
import {createSlice} from "@reduxjs/toolkit";
import {WishListItemDto} from "../../api/ProductSpace/WishListService/Dtos/WishListItemDto.ts";
import {store} from "../store.ts";
import {addNotification} from "../notificationsSlice.ts";
import {persistReducer} from "redux-persist";
import {mainWindowProductsPersistConfig} from "./mainWindowProductsPersistConfig.ts";
import {MAIN_WINDOW_PRODUCTS_KEY} from "../constants.ts";
import {LoadingStatus} from "../types.ts";
import {fetchMainWindowProductsThunk} from "./mainWindowProductsActions.ts";


interface MainWindowProductsSlice {
    status: LoadingStatus;

    products: ShortProductDtoUiExtended[];
    hasMoreProducts: boolean;

    recommendedGroupsDto : RecommendedGroupDtoUiExtended[];
    hasMoreRecommendedGroups: boolean;

    currentPage: number;
    nextPage: number;
}

const initialState: MainWindowProductsSlice = {
    status: LoadingStatus.Idle,

    products: [],
    hasMoreProducts: true,

    recommendedGroupsDto: [],
    hasMoreRecommendedGroups: true,

    currentPage: 0,
    nextPage: 1,
};

const mainWindowProductsSlice = createSlice({
    name: MAIN_WINDOW_PRODUCTS_KEY,
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMainWindowProductsThunk.pending, (state) => {
                state.status = LoadingStatus.Loading;

            })
            .addCase(fetchMainWindowProductsThunk.fulfilled, (state, action) => {
                console.log("fetchMainWindowProductsThunk.fulfilled")
                state.status = LoadingStatus.Succeeded;
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
            .addCase(fetchMainWindowProductsThunk.rejected, (state, action) => {
                state.status = LoadingStatus.Failed;
                store.dispatch(addNotification({ message: action.error.message ?? "Error loading products", type: "error" }));

            })
    }
})

const mainWindowProductsReducer = persistReducer(mainWindowProductsPersistConfig, mainWindowProductsSlice.reducer);

export default mainWindowProductsReducer;



