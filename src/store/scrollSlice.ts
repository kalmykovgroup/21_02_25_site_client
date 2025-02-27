import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ScrollState {
    isScrollEnabled: boolean;
}

const initialState: ScrollState = {
    isScrollEnabled: true, // ✅ По умолчанию скролл включен
};

const scrollSlice = createSlice({
    name: "scroll",
    initialState,
    reducers: {
        toggleScroll: (state, action: PayloadAction<boolean>) => {
            state.isScrollEnabled = action.payload;

            if (action.payload) {
                // ✅ Включаем скролл
                document.body.style.overflow = "auto";
                document.body.style.paddingRight = "0px"; // ✅ Убираем лишний `padding`
            } else {
                // ❌ Отключаем скролл + резервируем место под него
                const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
                document.body.style.overflow = "hidden";
                document.body.style.paddingRight = `${scrollbarWidth}px`; // ✅ Добавляем `padding`, равный ширине скроллбара
            }
        },
    },
});

export const { toggleScroll } = scrollSlice.actions;
export default scrollSlice.reducer;
