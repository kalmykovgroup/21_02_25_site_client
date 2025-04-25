
import {WISH_LIST_KEY} from "../constants.ts";
import storage from "redux-persist/lib/storage";

//const EXPIRATION_TIME = 10 * 60 * 1000; // 10 минут

export const wishListPersistConfig = {
    key: WISH_LIST_KEY,
    storage: storage,
   // migrate: checkPersistExpiration(WISH_LIST_KEY, EXPIRATION_TIME),
};
