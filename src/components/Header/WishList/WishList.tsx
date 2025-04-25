import React from "react";

import styles from "./WishList.module.css"
import common from "../../Header/Common.module.css";
import {Link} from "react-router-dom";
import favoritesIcon from "../../../assets/images/favorites.svg";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/types.ts";

interface FavouritesProps {
    className?: string
}

const WishList: React.FC<FavouritesProps> = ({className}: FavouritesProps) => {

    const { wishList } = useSelector((state: RootState) => state.wishList);

    return <>
        <Link className={`${className} ${styles.favourites} ${common.header_right_item}`} to={`/favorites`}>
            {wishList.length > 0 && <>
                <div className={`${common.countContainer}`}>
                    <div className={`${common.circle}  ${wishList.length > 9 ? common.twoDigit : ""}`}>{wishList.length}</div>
                </div>
            </>}

            <img src={favoritesIcon} className={styles.favouritesIcon} alt="WishList"/>
            <span>Избранное</span>
        </Link>
    </>
}

export default WishList;