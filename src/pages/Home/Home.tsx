
import React from "react";
import styles from "./Home.module.css"
import HomeProductsContainer from "../../components/ProductsContainer/HomeProductContainer/HomeProductContainer.tsx";

const Home: React.FC = () => {

    return (
        <div className={styles.homeContainer}>
            <HomeProductsContainer />
        </div>
    );
};

export default Home;
