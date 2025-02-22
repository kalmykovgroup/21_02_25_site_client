
import ProductsContainer from "../../components/ProductsContainer/Container/ProductsContainer.tsx";
import Header from "../../components/Header/Header.tsx";
import Advertisement from "../../components/Header/Advertisement/Advertisement.tsx";
import React from "react";
import styles from "./Home.module.css"

const Home: React.FC = () => {

    return (
        <div className={styles.homeContainer}>
            <Advertisement/>
            <Header/>
            <ProductsContainer/>
        </div>
    );
};

export default Home;
