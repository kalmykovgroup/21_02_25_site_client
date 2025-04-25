import { RootState } from "../types.ts";


export const selectSearchQuery = (state: RootState) => state.search.query;
export const selectSearchHistory = (state: RootState) => state.search.history;
export const selectSearchSuggestions = (state: RootState) => state.search.suggestions;

export const selectSearchEndQuery = (state: RootState) => state.searchResults.endQuery;

export const selectSearchResults = (state: RootState) => state.searchResults.results;
export const selectSearchStatus = (state: RootState) => state.searchResults.status;
export const selectSearchError = (state: RootState) => state.searchResults.error;
export const selectCurrentPage = (state: RootState) => state.searchResults.currentPage;
export const selectNextPage = (state: RootState) => state.searchResults.nextPage;
export const selectHasMore = (state: RootState) => state.searchResults.hasMore;
