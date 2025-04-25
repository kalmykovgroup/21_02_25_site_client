import sessionStorage from "redux-persist/lib/storage/session";
import {SEARCH_RESULTS_KEY} from "../constants.ts";
import {checkPersistExpiration} from "../../utils/persistUtils.ts";

const EXPIRATION_TIME = 10 * 60 * 1000; // 10 минут

export const searchPersistConfig = {
    key: SEARCH_RESULTS_KEY,
    storage: sessionStorage,
   // whitelist: ["results", "currentPage", "nextPage", "hasMore"],
    migrate: checkPersistExpiration(SEARCH_RESULTS_KEY, EXPIRATION_TIME),
};
