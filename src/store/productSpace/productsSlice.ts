import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import {fetchProducts, fetchGetProductNameSuggestions} from "../../api/ProductSpace/ProductService/ProductService.ts";
import {
    mapShortProductUI,
    ShortProductDtoUiExtended
} from "../../api/ProductSpace/ProductService/UI/ShortProductDtoUiExtended.ts";
import {ProductPagedResult} from "../../api/ProductSpace/ProductService/Responses/ProductPagedResult.ts";
import {AppDispatch, RootState, store} from "../store.ts";
import {addNotification} from "../notificationSlice.ts";
import {setFocus, setQuery} from "../header/searchSlice.ts";
import axios from "axios";
import {
    GetProductNameSuggestionsResponse
} from "../../api/ProductSpace/ProductService/Responses/GetProductNameSuggestionsResponse.ts";
import storage from "redux-persist/lib/storage";
import {persistReducer} from "redux-persist";



interface ProductsState {
    loading: boolean;
    products: ShortProductDtoUiExtended[];
    page: number;
    hasMore: boolean;
    arrayOfSuggestions: string[];
    loadingSuggestions: boolean;
}

const initialState: ProductsState = {
    loading: false,
    products: [],
    page: 1,
    hasMore: true,

    arrayOfSuggestions: [],
    loadingSuggestions: false,
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
        } catch (error) {
            console.error("❌ Ошибка при загрузке:", error);

            let errorMessage = "Ошибка сервера";
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || `Ошибка ${error.response?.status}`;
            }

            return rejectWithValue(errorMessage);
        }
    }
);

export const fetchProductSuggestionsThunk = createAsyncThunk<
    GetProductNameSuggestionsResponse, // ✅ Тип возвращаемых данных
    string, // ✅ Тип входного аргумента
    { rejectValue: string } // ✅ Тип ошибки
>(
    "fetchProductsSuggestionThunk",
    async (query, { rejectWithValue }) => {
        try {
            return await fetchGetProductNameSuggestions(query);
        } catch (error: unknown) {
            console.error("❌ Ошибка запроса:", error);

            let errorMessage = "Ошибка сервера";
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || `Ошибка ${error.response?.status}`;
            }

            return rejectWithValue(errorMessage); // ✅ Теперь возвращается только строка
        }
    }
);


// ✅
export const executeSearchChange = createAsyncThunk<
    void, // ✅ Тип возвращаемого значения (ничего)
    string | undefined, // ✅ Тип аргумента (query)
    { state: RootState, dispatch: AppDispatch }
>(
    "products/executeSearchChange",
    async (inputValue, { getState, dispatch }) => {

        dispatch(setFocus(false))

        const state = getState() as RootState;

        const selectedCategory = state.categorySlice.selectedCategory

        dispatch(setQuery(inputValue ?? ""));
        dispatch(setPage(1));
        dispatch(resetProducts());

        dispatch(fetchProductsThunk({ page: 1, search: inputValue, categoryId: selectedCategory?.id }));
    }
);

// ✅
export const executeCategoryChange = createAsyncThunk(
    "products/executeCategoryChange",
    async (_, { getState, dispatch }) => {
        const state = getState() as RootState;

        const selectedCategory = state.categorySlice.selectedCategory

        if(!selectedCategory){
            console.log("Ошибка запроса, категория не выбрана!")
            return;
        }

        dispatch(setPage(1));
        dispatch(resetProducts());
        dispatch(setQuery(""));
        dispatch(fetchProductsThunk({ page: 1, search: undefined, categoryId: selectedCategory.id }));
    }
);


const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        resetProducts: (state) => {
            state.products = [];
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

            .addCase(fetchProductSuggestionsThunk.pending, (state) => {
                state.loadingSuggestions = true;
            })

            .addCase(fetchProductSuggestionsThunk.fulfilled, (state, action) => {

                state.loadingSuggestions = false;
                state.arrayOfSuggestions = action.payload.suggestions;
            })
            .addCase(fetchProductSuggestionsThunk.rejected, (state) => {

                state.loadingSuggestions = false;
            })



    },
});


// Конфигурация `persistReducer`
const persistConfig = {
    key: "productsSlice",
    storage,
    blacklist: [], //Пишем имена полей, которые не нужно сохранять.
};

export const persistedProductsReducer = persistReducer(persistConfig, productsSlice.reducer);


export const { resetProducts, setPage, updateProductFavoriteStatus, syncingProductsWithWishList } = productsSlice.actions;
export default productsSlice.reducer;
