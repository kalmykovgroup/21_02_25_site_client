import {persistReducer} from "redux-persist";
import storage from 'redux-persist/lib/storage'; // localStorage
import {combineReducers} from "@reduxjs/toolkit";
import {searchReducer, searchResultsReducer} from "./search";
import authSlice from "./userSpace/authSlice.ts";
import notificationsSlice from "./notificationsSlice.ts";
import scrollSlice from "./scrollSlice.ts";
import uiSlice from "./uiSlice.ts";
import sessionStorage from "redux-persist/lib/storage/session";
import wishListReducer from "./wishList";
import filterProductsReducer from "./filterProducts/filterProductsSlice.ts";
import mainWindowProductsReducer from "./mainWindowProducts/mainWindowProductsSlice.ts";
import categoriesSlice from "./categories/categoriesSlice.ts";

const rootPersistConfig = {
    key: 'root',
    storage,
}

// Функция для создания конфигурации persist
const createPersistConfig
    = (key: string, storageType = sessionStorage) => ({ key: key, storage: storageType });

// 🔹 Оборачиваем **только нужные редюсеры** в `persistReducer`
const rootReducer = combineReducers({
    search: searchReducer, // Обычный slice без persist
    searchResults: searchResultsReducer, // Уже обернут в persistReducer

    categories: categoriesSlice, // persist категорий
    filterProducts: filterProductsReducer,

    //homeProductsContainerSlice: persistReducer(createPersistConfig("homeProductsContainerSlice"), homeProductsContainerSlice),
    mainWindowProducts: mainWindowProductsReducer,
    wishList: wishListReducer,
    authSlice: persistReducer(createPersistConfig("authSlice", storage), authSlice), // persist для auth

    notificationsSlice: persistReducer(createPersistConfig("notificationsSlice"), notificationsSlice),

    scrollSlice: persistReducer(createPersistConfig("scrollSlice"), scrollSlice),
    uiSlice: persistReducer(createPersistConfig("uiSlice"), uiSlice), // persist для sessionStorage

});


const rootPersistReducer = persistReducer(rootPersistConfig, rootReducer)

export default rootPersistReducer;