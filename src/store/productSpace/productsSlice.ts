import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import { fetchProducts } from "../../api/ProductSpace/ProductService/ProductService.ts";
import {
    mapShortProductUI,
    ShortProductDtoUiExtended
} from "../../api/ProductSpace/ProductService/UI/ShortProductDtoUiExtended.ts";
import {ProductPagedResult} from "../../api/ProductSpace/ProductService/Responses/ProductPagedResult.ts";
import {store} from "../store.ts";
import {addNotification} from "../notificationSlice.ts";


interface ProductsState {
    loading: boolean;
    products: ShortProductDtoUiExtended[];
    page: number;
    search: string;
    categoryId?: string;

    hasMore: boolean;
}

const initialState: ProductsState = {
    loading: false,

    products: [],
    page: 1,
    search: "",
    categoryId: undefined,

    hasMore: true,
};

// Запрос списка товаров с пагинацией и фильтрацией
export const fetchProductsThunk = createAsyncThunk<
    ProductPagedResult,
    { page: number; search?: string; categoryId?: string },
    { rejectValue: string }
>(
    "products/fetchProducts",
    async ({ page, search, categoryId }, { rejectWithValue }) => {
        try {
            return await fetchProducts({ page, search, categoryId });
        } catch (err) {
            return rejectWithValue("Error loading products");
        }
    }
);



const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload;
            state.page = 1; // Сброс страницы при новом поисковом запросе
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        setCategory: (state, action: PayloadAction<string | undefined>) => {
            state.categoryId = action.payload;
            state.page = 1;
        },
        // ✅ Обновляем `isFavorite` для конкретного продукта
        updateProductFavoriteStatus: (state, action: PayloadAction<{ productId: string; isFavorite: boolean }>) => {
            const product = state.products.find((p) => p.id === action.payload.productId);
            if (product) {
                product.isFavorite = action.payload.isFavorite;
            }
        },
        syncingProductsWithWishList: (state, action: PayloadAction<ShortProductDtoUiExtended[]>) => {
            action.payload.forEach((updatedProduct) => {
                const product = state.products.find((p) => p.id === updatedProduct.id);
                if (product) {
                    product.isFavorite = updatedProduct.isFavorite; // ✅ Immer автоматически обновит состояние правильно
                    console.log("product updated", updatedProduct);
                }
            });
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductsThunk.pending, (state) => {
                state.loading = true;

            })
            .addCase(fetchProductsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.hasMore = action.payload.hasMore; // Обновляем кол-во страниц
                state.page = action.payload.page; // Обновляем текущую страницу

                const existingIds = new Set(state.products.map((p) => p.id));

                const newItems = action.payload.items.filter((p) => !existingIds.has(p.id));

                state.products = [...state.products, ...newItems.map(p => mapShortProductUI(p))];
            })
            .addCase(fetchProductsThunk.rejected, (state, action) => {
                state.loading = false;
                store.dispatch(addNotification({ message: action.error.message ?? "Error loading products", type: "error" }));

            })



    },
});
export const {  setSearch, setPage, setCategory, updateProductFavoriteStatus, syncingProductsWithWishList } = productsSlice.actions;
export default productsSlice.reducer;
