import { store } from "./store";
import rootReducer from "./rootReducer.ts";

export enum LoadingStatus {
    Idle = "idle",
    Loading = "loading",
    Succeeded = "succeeded",
    Failed = "failed",
}

export enum SearchGetParam{
    QUERY = "q",
}


export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

