import {configureStore} from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import rootPersistReducer from "./rootReducer.ts";


// 🔹 Создаем store
export const store = configureStore({
    reducer: rootPersistReducer, // Теперь редюсеры доступны без вложенности
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: { ignoredPaths: ['categories'] }, // Игнорирует проверки для поля "categories"
            serializableCheck: false, // Отключаем предупреждения о сериализации
        }),
});

// 🔹 Создаем persist
export const persistor = persistStore(store);

persistor.persist(); // Форсируем обновление



