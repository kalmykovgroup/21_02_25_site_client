import axios from "axios";
import { store } from "../store/store"; // Импортируем Redux store
import { logoutThunk } from "../store/userSpace/authSlice.ts";
import {setAuthModalOpen} from "../store/uiSlice.ts";
import {addNotification} from "../store/notificationsSlice.ts";

const apiClient = axios.create({
    baseURL: "/api", // Автоматически проксируется через Vite
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // ✅ Разрешаем отправку Cookie (нужно для авторизации в браузере)
});

// ✅ Перехватчик ошибок
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {

        let errorMessage = "Произошла ошибка при запросе к api";

        if (error.response?.status === 401) {
            store.dispatch(logoutThunk());
            store.dispatch(setAuthModalOpen(true));

            errorMessage = error.response.data?.message || "Не авторизован";
        } else if (error.response) {
            // ✅ Достаем `message` из ответа сервера (если есть)
            errorMessage = error.response.data?.message || `Ошибка ${error.response.status}`;
        }

        // ✅ Теперь передаём строку вместо объекта ошибки
        store.dispatch(addNotification({ message: errorMessage, type: "error" }));

        return Promise.reject(error);
    }
);



export default apiClient;
