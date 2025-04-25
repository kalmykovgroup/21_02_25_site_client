import {FILTER_PRODUCTS_KEY} from "../constants.ts";
import sessionStorage from "redux-persist/lib/storage/session";
import {checkPersistExpiration} from "../../utils/persistUtils.ts";

const EXPIRATION_TIME = 10 * 60 * 1000; // 10 минут

export const filterProductsPersistConfig = {
    key: FILTER_PRODUCTS_KEY,
    storage: sessionStorage,
    // whitelist: ["results", "currentPage", "nextPage", "hasMore"],
    migrate: checkPersistExpiration(FILTER_PRODUCTS_KEY, EXPIRATION_TIME),
};