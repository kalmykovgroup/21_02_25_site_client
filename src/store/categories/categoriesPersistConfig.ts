import {CATEGORIES_KEY} from "../constants.ts";
import sessionStorage from "redux-persist/lib/storage/session";
import {checkPersistExpiration} from "../../utils/persistUtils.ts";

const EXPIRATION_TIME = 10 * 60 * 1000; // 10 минут

export const categoriesPersistConfig = {
    key: CATEGORIES_KEY,
    storage: sessionStorage,
    migrate: checkPersistExpiration(CATEGORIES_KEY, EXPIRATION_TIME),
    blacklist: ['status']
};