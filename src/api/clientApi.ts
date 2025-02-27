import axios from "axios";
import { store } from "../store/store"; // Импортируем Redux store
import { logoutThunk } from "../store/userSpace/authSlice.ts";
import {setAuthModalOpen} from "../store/uiSlice.ts";
import {addNotification} from "../store/notificationSlice.ts";
import i18n from "../i18n.ts";

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
        console.error("❌ API Error:", error);

        let errorMessage = "Произошла ошибка";

        if (error.response?.status === 401) {
            console.warn("🔒 401 Unauthorized: Выход из системы...");
            store.dispatch(logoutThunk());
            store.dispatch(setAuthModalOpen(true));
            errorMessage = i18n.t("errors.unauthorized");
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
