import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Используем localStorage
import {persistedProductsReducer} from './productSpace/productsSlice.ts';
import authSlice from './userSpace/authSlice.ts';
import uiSlice from './uiSlice.ts';
import notificationSlice from './notificationSlice.ts';
import categoriesSlice from "./header/categoriesSlice.ts";
import searchSlice from "./header/searchSlice.ts";
import wishListSlice from "./productSpace/wishListSlice.ts";
import scrollSlice from "./scrollSlice.ts";
import {persistedSearchProductsContainerReducer} from "./productSpace/searchProductContainerSlice.ts";
import {persistedHomeProductsContainerReducer} from "./productSpace/homeProductContainerSlice.ts";

// 🔹 Конфигурация persist
const persistConfig = {
    key: 'root',       // Ключ для хранения в localStorage
    storage,           // Где хранить (localStorage)
    whitelist: ['scrollSlice',
                'authSlice',
                'uiSlice',
                'notificationsSlice',
                'categoriesSlice',
                'searchSlice',
                'wishListSlice'
    ], // Какие редюсеры сохранять
};

// 🔹 Комбинированный редюсер (все редюсеры приложения)
const rootReducer = combineReducers({
    productsSlice: persistedProductsReducer,
    searchProductsContainerSlice: persistedSearchProductsContainerReducer,
    homeProductsContainerSlice: persistedHomeProductsContainerReducer,
    authSlice: authSlice,
    uiSlice: uiSlice,
    notificationsSlice: notificationSlice,
    categorySlice: categoriesSlice,
    searchSlice: searchSlice,
    wishListSlice: wishListSlice,
    scrollSlice: scrollSlice,
});

// 🔹 Оборачиваем rootReducer в persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 🔹 Создаем store с persistedReducer
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Отключаем предупреждение о сериализации
        }),
});

// 🔹 Создаем persistor
export const persistor = persistStore(store);

// 🔹 Типизация Redux (без изменений)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
