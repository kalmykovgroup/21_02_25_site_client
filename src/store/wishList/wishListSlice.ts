import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {WISH_LIST_KEY} from "../constants.ts";
import {WishListItemDto} from "../../api/ProductSpace/WishListService/Dtos/WishListItemDto.ts";
import {ShortProductDtoUiExtended} from "../../api/ProductSpace/ProductService/UI/ShortProductDtoUiExtended.ts";
import {persistReducer} from "redux-persist";
import {wishListPersistConfig} from "./wishListPersistConfig.ts";

interface WishListSliceState{
    //Это список для быстрого взаимодействия с пользователем, он сравнивается с originalWishList
    //что-бы понять какие были сделаны изменения, которые отправляются на сервер с задержкой +-500мс
    wishList: WishListItemDto[];
    originalWishList: WishListItemDto[]; //Этот список, который синхронизируется с сервером
    isLoading: boolean;
}


const initialState: WishListSliceState  = {
    wishList: [],
    originalWishList: [],
    isLoading: false,
};

const wishListSlice = createSlice({
    name: WISH_LIST_KEY,
    initialState, // Начальное состояние (загружается из `localStorage`)
    reducers: {

        setLoadingState: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        setWishList: (state, action: PayloadAction<ShortProductDtoUiExtended[]>) => {
            state.wishList = action.payload;
        },
        setOriginalWishList: (state, action: PayloadAction<ShortProductDtoUiExtended[]>) => {
            state.originalWishList = action.payload;
        },
    },
});

export const {setWishList, setOriginalWishList, setLoadingState } = wishListSlice.actions;

const wishListReducer = persistReducer(wishListPersistConfig, wishListSlice.reducer)

export default wishListReducer;
