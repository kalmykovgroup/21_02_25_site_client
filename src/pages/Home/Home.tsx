
import React from "react";
import styles from "./Home.module.css"
import PromoSlider from "../../components/PromoSlider/PromoSlider.tsx";
import MainWindowProducts from "./MainWindowProducts/MainWindowProducts.tsx";

const Home: React.FC = () => {

    return (
        <div className={styles.homeContainer}>
            <PromoSlider />
            <MainWindowProducts/>
        </div>
    );
};

export default Home;
