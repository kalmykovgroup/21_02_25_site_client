import {RootState} from "../types.ts";


export const selectFilterProductsStatus = (state: RootState) => state.filterProducts.status;
export const selectFilterProductsProducts = (state: RootState) => state.filterProducts.products;
export const selectFilterProductsHasMore = (state: RootState) => state.filterProducts.hasMore;
export const selectFilterProductsCurrentPage = (state: RootState) => state.filterProducts.currentPage;
export const selectFilterProductsNextPage = (state: RootState) => state.filterProducts.nextPage;
export const selectFilterProductsCategoryId = (state: RootState) => state.filterProducts.categoryId;