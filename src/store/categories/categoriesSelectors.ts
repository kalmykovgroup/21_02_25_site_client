import {RootState} from "../types.ts";


export const selectCategoriesIsFetched = (state: RootState) => state.categories.isFetched;
export const selectCategoriesIsOpenCategoryMenu = (state: RootState) => state.categories.isOpenCategoryMenu;
export const selectCategoriesStatus = (state: RootState) => state.categories.status;
export const selectCategories = (state: RootState) => state.categories.categories;


