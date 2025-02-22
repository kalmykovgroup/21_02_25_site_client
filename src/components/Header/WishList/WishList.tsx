import React from "react";

import styles from "./WishList.module.css"
import common from "../../Header/Common.module.css";
import {Link} from "react-router-dom";
import favoritesIcon from "../../../assets/images/favorites.svg";

interface FavouritesProps {
    className?: string
}

const WishList: React.FC<FavouritesProps> = ({className}: FavouritesProps) => {

    return <>
        <Link className={`${className} ${styles.favourites} ${common.header_right_item}`} to={`/favorites`}>
            <img src={favoritesIcon} className={styles.favouritesIcon} alt="WishList"/>
            <span>Избранное</span>
        </Link>
    </>
}

export default WishList;