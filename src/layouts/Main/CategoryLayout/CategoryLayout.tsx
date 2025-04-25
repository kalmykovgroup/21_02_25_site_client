import { Outlet, useOutlet} from "react-router-dom";

import React from "react";

import FilterProductsPage from "../../../pages/FilterProductsPage/FilterProductsPage.tsx";
import {CategoryDtoUiExtended} from "../../../api/CategorySpace/CategoryService/Ui/CategoryDtoUiExtended.ts";


interface CategoryLayoutProps {
    category: CategoryDtoUiExtended
}

const CategoryLayout: React.FC<CategoryLayoutProps> = ({category}: CategoryLayoutProps) => {

    const outlet = useOutlet();

    return outlet ? <Outlet/> : <FilterProductsPage category={category}/>
};


export default CategoryLayout;