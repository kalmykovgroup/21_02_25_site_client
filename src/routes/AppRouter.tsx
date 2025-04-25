import {BrowserRouter as Router, Routes, Route,} from "react-router-dom";
import Home from "../pages/Home/Home.tsx";
import UserProfile from "../pages/UserProfile/UserProfile.tsx";
import Cart from "../pages/Cart/Cart.tsx";
import Orders from "../pages/Orders/Orders.tsx";
import WishList from "../pages/WishList/WishList.tsx";
import ProtectedRoute from "./ProtectedRoute";
import {NotificationCenter} from "../components/NotificationCenter/NotificationCenter.tsx";
import MainLayout from "../layouts/Main/MainLayout.tsx";
import LoginModal from "../components/Auth/LoginModal.tsx";
import React, {useEffect} from "react";
import SearchPage from "../pages/SearchPage/SearchPage.tsx";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage.tsx";
import {useDispatch, useSelector} from "react-redux";
import {RenderCategoryRoutes} from "./RenderCategoryRoutes.tsx";
import {ROUTES} from "./routes.ts";
import ErrorScreen from "../pages/ErrorScreen/ErrorScreen.tsx";
import {AppDispatch, LoadingStatus} from "../store/types.ts";
import {
    fetchCategoriesThunk,
    selectCategories,
    selectCategoriesIsFetched,
    selectCategoriesStatus
} from "../store/categories";

const AppRouter: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const status = useSelector(selectCategoriesStatus);
    const isFetched = useSelector(selectCategoriesIsFetched);
    const categories = useSelector(selectCategories);

    useEffect(() => {
        if (
            !isFetched &&
            categories.length == 0 &&
            status != LoadingStatus.Failed &&
            status != LoadingStatus.Loading) {
            dispatch(fetchCategoriesThunk());
        }
    }, [categories.length, dispatch, isFetched, status]);



    return (
        <Router>
            <LoginModal/>
            <NotificationCenter/>
            <Routes>
                <Route path={ROUTES.HOME} element={<MainLayout />}>

                    <Route index element={<Home />} />
                    <Route path={ROUTES.SEARCH} element={<SearchPage />} />

                    <Route path={ROUTES.PROFILE} element={<ProtectedRoute><UserProfile/></ProtectedRoute>} />
                    <Route path={ROUTES.CART} element={<Cart />} />
                    <Route path={ROUTES.FAVORITES} element={<WishList />} />

                    <Route path={ROUTES.CATEGORY}>
                        {RenderCategoryRoutes(categories)}
                        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
                    </Route>

                    <Route path={ROUTES.ORDERS} element={<ProtectedRoute><Orders /></ProtectedRoute>} />

                    <Route path={ROUTES.ERROR_SCREEN} element={<ErrorScreen/>} />

                </Route>


                {/* Если страница не найдена, редирект на Home */}
               <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage/>} />

            </Routes>
        </Router>
    );
};

export default AppRouter;

