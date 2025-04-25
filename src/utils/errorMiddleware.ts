import { Middleware } from "@reduxjs/toolkit";
import {addNotification} from "../store/notificationsSlice.ts";

import { reportError } from "../api/ErrorService.ts";

// Типизация для rejected экшенов
interface RejectedAction {
    type: string;
    payload?: never;
    error: {
        message?: string;
    };
}

const errorMiddleware: Middleware= (store) => (next) => async (action) => {
    // Проверяем, что экшен является rejected
    if ((action as RejectedAction).type?.endsWith("/rejected")) {

        // Приводим к типу RejectedAction
        const rejectedAction = action as RejectedAction;

        // Извлекаем сообщение ошибки из payload, если оно есть
        const errorMessage = rejectedAction.payload || "Произошла ошибка";

        await reportError(errorMessage); // Отправка ошибки на сервер

        store.dispatch(
            addNotification({message: errorMessage, type: "error"})
        );
    }

    try {
        return next(action);
    } catch (error) {
        console.error('Middleware caught error:', error);

        await reportError(error).then();
    }
};



export default errorMiddleware;