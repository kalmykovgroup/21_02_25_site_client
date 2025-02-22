import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WishListItemDto } from "../../api/ProductSpace/WishListService/Dtos/WishListItemDto";
import {
    fetchGetWishList,
    fetchUpdateWishList
} from "../../api/ProductSpace/WishListService/WishListService";
import {AppDispatch, RootState, store} from "../store";
import { addNotification } from "../notificationSlice";
import {ShortProductDtoUiExtended} from "../../api/ProductSpace/ProductService/UI/ShortProductDtoUiExtended.ts";
import {syncingProductsWithWishList, updateProductFavoriteStatus} from "./productsSlice.ts";



interface WishListState {
    wishList: WishListItemDto[];
    originalWishList: WishListItemDto[];
    isLoading: boolean;
}

const initialState: WishListState = {
    wishList: [],
    originalWishList: [],
    isLoading: false,
};


export const syncWishListWithServer = createAsyncThunk<void, void, { state: RootState; dispatch: AppDispatch }>(
    "wishList/syncWithServer",
    async (_, { getState, dispatch }) => {

        console.log("синхронизация...")

        const state = getState();

        try {
            dispatch(setLoadingState(true));


            const response = await fetchGetWishList();

            if(!response.success){
                store.dispatch(addNotification({ message: response.error ?? "Error when adding products to favorites", type: "error" }));
            }

            // ✅ 1. Получаем избранное с сервера
            const serverWishList: ShortProductDtoUiExtended[] = response.wishList;

            console.log("Получаем избранное с сервера");
            console.log(serverWishList);

            // ✅ 2. Получаем избранное из `Redux` (persist)
            let localWishList = state.wishListSlice.wishList;

            console.log(" 2. Получаем избранное из `Redux` (persist)");
            console.log(localWishList);

            // ✅ 3. Найти продукты, которых **нет в `localStorage`, но есть на сервере** → добавить в `wishList`
            const missingFromLocal = serverWishList.filter(
                (serverItem) => !localWishList.some((localItem) => localItem.id === serverItem.id)
            );

            console.log("продукты, которых **нет в localStorage");
            console.log(missingFromLocal);


            if (missingFromLocal.length > 0) {
                // ✅ Устанавливаем `isFavorite = true` для каждого элемента
                const updatedMissingFromLocal = missingFromLocal.map((item) => ({
                    ...item,
                    isFavorite: true
                }));

                localWishList = [...localWishList, ...updatedMissingFromLocal]; // Добавляем недостающие товары
            }

            // ✅ 4. Найти продукты, которых **нет на сервере, но есть в `localStorage`** → отправить на сервер
            const missingFromServer = localWishList.filter(
                (localItem) => !serverWishList.some((serverItem) => serverItem.id === localItem.id)
            );

            console.log("продукты, которых **нет на сервере");
            console.log(missingFromServer);

            if (missingFromServer.length > 0) {
                console.log(`Отправка на сервер ${missingFromServer.length} продуктов...`);

                const AddWishListProductResponse =  await fetchUpdateWishList(missingFromServer); // Отправляем недостающие товары на сервер

               if(!AddWishListProductResponse.success){
                   store.dispatch(addNotification({ message: AddWishListProductResponse.error ?? "Error when sending data to the server", type: "error" }));
               }
            }

            // ✅ 5. Обновляем `Redux`, `redux-persist` сохранит состояние автоматически
            dispatch(setWishList(localWishList));
            dispatch(setOriginalWishList(localWishList));
            dispatch(syncingProductsWithWishList(localWishList));

            console.log(`✅ Синхронизация с сервером прошла успешно`);

        } catch (error) {
            console.error("❌ Ошибка при синхронизации WishList с сервером:", error);
        } finally {
            dispatch(setLoadingState(false));
        }
    }
);


let syncTimeout: ReturnType<typeof setTimeout> | null = null; // ✅ Таймер без ошибки


export const toggleFavoriteThunk = createAsyncThunk<void, ShortProductDtoUiExtended, { state: RootState }>(
    "products/toggleFavorite",
    async (product, { getState, dispatch }) => {
        const state = getState();
        const customer = state.authSlice.customer;
        const isAuthenticated = !!customer;

        // ✅ Получаем текущее состояние `wishList` из Redux
        const wishListCopy = [...state.wishListSlice.wishList]; // Копируем массив для мутации
        const index = wishListCopy.findIndex((item) => item.id === product.id);
        const isAdding = index === -1;

        if (isAdding) {
            wishListCopy.push({ ...product, isFavorite: true });
            dispatch(updateProductFavoriteStatus({ productId: product.id, isFavorite: true }));
        } else {
            wishListCopy.splice(index, 1);
            dispatch(updateProductFavoriteStatus({ productId: product.id, isFavorite: false }));
        }

        // ✅ Обновляем `Redux`, `redux-persist` сам сохранит состояние
        dispatch(setWishList(wishListCopy));

        if (isAuthenticated) {
            // ✅ Если пользователь авторизован, ждем 2 секунды перед отправкой запроса
            if (syncTimeout) {
                clearTimeout(syncTimeout); // Сбрасываем предыдущий таймер
            }

            syncTimeout = setTimeout(async () => {
                // ✅ Получаем изменения, отправляем только измененные элементы
                const editList = findWishListChanges(state.wishListSlice.originalWishList, wishListCopy);

                if (editList.length === 0) return;

                dispatch(setOriginalWishList(wishListCopy))
                await updateWishListThunk(editList); // Отправляем изменения на сервер
            }, 2000); // ⏳ Ждем 2 секунды после последнего клика
        }
    }
);

function findWishListChanges(originalWishList: ShortProductDtoUiExtended[], wishList: ShortProductDtoUiExtended[]) {
    const changes: ShortProductDtoUiExtended[] = [];


    // Создаем `Map` для быстрого поиска по `id`
    const originalMap = new Map(originalWishList.map((product) => [product.id, product]));

    // 🔹 Проверяем добавленные или измененные продукты
    for (const product of wishList) {
        const originalProduct = originalMap.get(product.id);

        if (!originalProduct) {
            // ✅ Продукт новый (был добавлен)
            changes.push({ ...product });
        } else if (product.isFavorite !== originalProduct.isFavorite) {
            // ✅ Продукт изменился (`isFavorite` поменялся)
            changes.push({ ...product });
        }

        // ✅ Удаляем из `originalMap`, чтобы после найти удаленные элементы
        originalMap.delete(product.id);
    }

    // 🔹 Оставшиеся элементы в `originalMap` - это удаленные продукты
    for (const removedProduct of originalMap.values()) {
        changes.push({ ...removedProduct, isFavorite: false }); // Помечаем, что продукт удален
    }

    return changes;
}


async function updateWishListThunk(bach: ShortProductDtoUiExtended[]) {

    try {
        const response = await fetchUpdateWishList(bach); // Отправляем только `id` продуктов
        if (response.success) {
            console.log(`✅ Избранные товары успешно отправлены на сервер`);
        } else {
            console.error("❌ Ошибка при оправке избранного:", response.error);
        }
    } catch (error) {
        console.error("❌ Ошибка при отправке батч-запроса:", error);
    }
}




// ====================================================
// 🎯 `Redux Slice` - Управление избранным
// ====================================================
const wishListSlice = createSlice({
    name: "wishList", // Имя слайса (редьюсера)
    initialState, // Начальное состояние (загружается из `localStorage`)
    reducers: {
        // ✅ Очистка списка избранного (локально и в `localStorage`)
        clearWishList: (state) => {
            state.wishList = [];
        },

        // ✅ Добавление товара в избранное (только локально, без запроса к серверу)
        addWishListItem: (state, action: PayloadAction<WishListItemDto>) => {
            const item = action.payload;

            // Проверяем, нет ли уже этого товара в `wishList`
            if (!state.wishList.some((p) => p.id === item.id)) {
                state.wishList.push(item); // Добавляем товар в `Redux`
            }
        },
        setLoadingState: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        // ✅ Удаление товара из избранного (локально и из `localStorage`)
        removeWishListItem: (state, action: PayloadAction<string>) => {
            state.wishList = state.wishList.filter((item) => item.id !== action.payload); // Фильтруем список

        },
        setWishList: (state, action: PayloadAction<ShortProductDtoUiExtended[]>) => {
            state.wishList = action.payload;
        },
        setOriginalWishList: (state, action: PayloadAction<ShortProductDtoUiExtended[]>) => {
            state.originalWishList = action.payload;
        },
    },


});

export const { clearWishList, addWishListItem, removeWishListItem, setWishList, setOriginalWishList, setLoadingState } = wishListSlice.actions;
export default wishListSlice.reducer;
