
import {Route} from "react-router-dom";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage.tsx";
import {JSX} from "react";
import CategoryLayout from "../layouts/Main/CategoryLayout/CategoryLayout.tsx";
import {CategoryDtoUiExtended} from "../api/CategorySpace/CategoryService/Ui/CategoryDtoUiExtended.ts";


export const RenderCategoryRoutes = (categories: CategoryDtoUiExtended[]): JSX.Element[] => {
    return categories.map((category) => {
        return (
            <Route
                key={category.id}
                path={category.path}
                element={<CategoryLayout category={category}  />}
            >
                {category.subCategories && category.subCategories.length > 0
                    ? RenderCategoryRoutes(category.subCategories)
                    : null}
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        );
    });
};