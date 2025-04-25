import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type NotificationType = "success" | "error" | "warning";

export interface Notifications {
    id: string;
    type: NotificationType;
    message: string;
}

interface NotificationsState {
    notifications: Notifications[];
}

const initialState: NotificationsState = {
    notifications: [],
};

const notificationsSlice = createSlice({
    name: "notificationsSlice",
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Omit<Notifications, "id">>) => {
            const id = crypto.randomUUID(); // Уникальный ID
            state.notifications.push({ id, ...action.payload });
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter(n => n.id !== action.payload);
        },
    },
});



export const { addNotification, removeNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
