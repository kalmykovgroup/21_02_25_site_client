import styles from './Header.module.css';
import React from "react";
import Logo from "./Logo/Logo.tsx";
import Menu from "./Menu/Menu.tsx";
import CategoryMenu from "./CategoryMenu/CategoryMenu.tsx";
import {useDevice} from "../../DeviceContext.tsx";
import Orders from "./Orders/Orders.tsx";
import WishList from "./WishList/WishList.tsx";
import Cart from "./Cart/Cart.tsx";
import Profile from "./Profile/Profile.tsx";
import SearchBar from "./SearchBar/SearchBar.tsx";


const Header: React.FC = () => {
    const { isDesktop } = useDevice();

    return (
        <>

            <div className={styles.header}>
                <div className={styles.navigateContainer}>


                    <div className={styles.navigations}>

                        <Logo className={styles.logo}/>

                        <Menu className={styles.menu} />

                        <SearchBar className={styles.search}/>

                        {isDesktop && (
                            <>
                                <Orders className={styles.orders}/>
                                <WishList className={styles.favourites}/>
                                <Cart className={styles.cart}/>
                                <Profile className={styles.profile}/>
                            </>
                        )}

                    </div>

                   <CategoryMenu/>

                </div>

            </div>
        </>
    );
};

export default Header;