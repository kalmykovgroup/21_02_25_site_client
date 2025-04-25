import React from "react";
import styles from "./AnimatedLoader.module.css";

const AnimatedLoader: React.FC = () => {
    return (
        <div className={styles.loader}>
            <div className={styles.border}></div>
        </div>
    );
};

export default AnimatedLoader;
