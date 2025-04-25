export const checkPersistExpiration = (key: string, expirationTime: number) => async (state: any) => {
    if (!state) return state;

    const savedTime = localStorage.getItem(`${key}_savedTime`);

    if (savedTime && Date.now() - Number(savedTime) > expirationTime) {
        console.log(`⏳ Данные для "${key}" устарели, очищаем localStorage`);

        localStorage.removeItem(`persist:${key}`); // Очищаем хранилище
        localStorage.removeItem(`${key}_savedTime`);

        return undefined; // persist загрузит пустой state
    }

    return state;
};
