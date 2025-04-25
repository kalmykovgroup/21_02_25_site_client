import apiClient from "../../clientApi.ts";
import { LongProductDto } from "./Dtos/LongProductDto.ts";
import {ProductPagedResult} from "./Responses/ProductPagedResult.ts";
import {mapShortProductUI} from "./UI/ShortProductDtoUiExtended.ts";
import {GetFilteredProductsQuery} from "./Queries/GetFilteredProductsQuery.ts";
import {GetProductNameSuggestionsResponse} from "./Responses/GetProductNameSuggestionsResponse.ts";
import {ProductsMainPagedResponse} from "./Responses/ProductsMainPagedResponse.ts";
import {GetSearchProductsQuery} from "./Queries/GetSearchProductsQuery.ts";


// ✅ Функция для запроса списка товаров с фильтрацией и пагинацией
export async function fetchProducts({ page, search, categoryId }: GetFilteredProductsQuery): Promise<ProductPagedResult> {
    const params = new URLSearchParams({ page: page.toString() });
    if (search) params.append("search", search);
    if (categoryId) params.append("categoryId", categoryId);

    const response = await apiClient.get<ProductPagedResult>(`/products?${params.toString()}`);

    return {
        ...response.data,
        items: response.data.items.map(dto => mapShortProductUI(dto, false)),
    };
}

// ✅ Функция для запроса списка товаров с фильтрацией и пагинацией
export async function fetchSearchProducts({ page, query }: GetSearchProductsQuery): Promise<ProductPagedResult> {
    const params = new URLSearchParams({ page: page.toString() });
    if (query) params.append("search", query);

    const response = await apiClient.get<ProductPagedResult>(`/products?${params.toString()}`);

    return {
        ...response.data,
        items: response.data.items.map(dto => mapShortProductUI(dto, false)),
    };
}

// ✅ Функция для запроса списка товаров с фильтрацией и пагинацией
export async function fetchProductsMainPage({ page }: GetFilteredProductsQuery): Promise<ProductsMainPagedResponse> {
    const params = new URLSearchParams({ page: page.toString() });

    const response = await apiClient.get<ProductsMainPagedResponse>(`/products/main-page?${params.toString()}`);

    return response.data;
}

// Запрос конкретного продукта (Query)
export async function fetchProductById(id: string): Promise<LongProductDto> {
    const response = await apiClient.get<LongProductDto>(`/product/${id}`);
    return response.data;
}


export async function fetchGetProductNameSuggestions(query: string): Promise<GetProductNameSuggestionsResponse> {

        const params = new URLSearchParams({ query: query });

        const response =  await apiClient.get<GetProductNameSuggestionsResponse>(`/product/suggestions?${params.toString()}`);
        return response.data;


}




