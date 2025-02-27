import React, {useEffect} from "react";
import {useLocation} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../hooks/hooks.ts";
import {setSelectedCategory} from "../../store/header/categoriesSlice.ts";
import {setQuery} from "../../store/header/searchSlice.ts";



const CategoryContainer: React.FC = () => {
    const dispatch = useAppDispatch();

    const location = useLocation();
    const category = location.state; // ✅ Получаем переданный объект

    const { selectedCategory } = useAppSelector((state) => state.categorySlice);

    useEffect(() => {
        dispatch(setQuery(""));

        if(!selectedCategory || selectedCategory.id !== category.id){
            setSelectedCategory(category);
        }
    })

    return <>
        <h1>
            {category?.name}
        </h1>

    </>
}

export default CategoryContainer;