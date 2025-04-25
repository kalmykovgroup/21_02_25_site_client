export async function reportError(error: unknown, context?: Record<string, unknown>) {
    try {
        // 1. Преобразование ошибки в стандартный формат
        const normalizedError = normalizeError(error);

        // 2. Логирование в консоль (для разработки)
        console.error('Captured error:', normalizedError, context);

        // 3. Отправка в сервис мониторинга

        // 4. Отправка на ваш бэкенд (опционально)
        console.log("Отправка на сервер ошибки")

    } catch (reportingError) {
        console.error('Failed to report error:', reportingError);
    }
}

// Нормализация ошибок (обрабатывает разные форматы)
function normalizeError(rawError: unknown): {
    message: string;
    stack?: string;
    code?: string;
    name?: string;
} {
    if (rawError instanceof Error) {
        return {
            message: rawError.message,
            stack: rawError.stack,
            name: rawError.name,
        };
    }

    return {
        message: String(rawError),
    };
}

