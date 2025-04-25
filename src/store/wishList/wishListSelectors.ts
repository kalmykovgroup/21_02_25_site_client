import { RootState } from "../types.ts";


//export const selectSearchQuery = (state: RootState) => state.search.query;
export const selectWishList = (state: RootState) => state.wishList.wishList
export const selectOriginalWishList = (state: RootState) => state.wishList.originalWishList