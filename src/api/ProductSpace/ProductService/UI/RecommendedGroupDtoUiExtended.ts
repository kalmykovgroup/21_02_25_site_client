
import {mapShortProductUI, ShortProductDtoUiExtended} from "./ShortProductDtoUiExtended.ts";
import {RecommendedGroupDto} from "../Dtos/RecommendedGroupDto.ts";

export interface RecommendedGroupDtoUiExtended extends RecommendedGroupDto {
    products: ShortProductDtoUiExtended[];
}


// ✅ Функция-конвертер из API DTO в UI модель
export function mapRecommendedGroupUI(dto: RecommendedGroupDto, idx: Set<string> | undefined = undefined): RecommendedGroupDtoUiExtended {
    return {
        ...dto,
        products: dto.products.map(p => mapShortProductUI(p, idx?.has(p.id) ?? false)), // ✅ Здесь корректно вызываем `mapShortProductUI`
    };
}