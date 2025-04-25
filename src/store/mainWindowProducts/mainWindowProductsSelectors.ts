
import {RootState} from "../types.ts";

export const selectMainWindowProductsStatus
    = (state: RootState) => state.mainWindowProducts.status;

export const selectMainWindowProducts
    = (state: RootState) => state.mainWindowProducts.products;

export const selectMainWindowProductsHasMoreProducts
    = (state: RootState) => state.mainWindowProducts.hasMoreProducts;

export const selectMainWindowProductsRecommendedGroupsDto
    = (state: RootState) => state.mainWindowProducts.recommendedGroupsDto;

export const selectMainWindowProductsHasMoreRecommendedGroups
    = (state: RootState) => state.mainWindowProducts.hasMoreRecommendedGroups;

export const selectMainWindowProductsCurrentPage
    = (state: RootState) => state.mainWindowProducts.currentPage;

export const selectMainWindowProductsNextPage
    = (state: RootState) => state.mainWindowProducts.nextPage;

