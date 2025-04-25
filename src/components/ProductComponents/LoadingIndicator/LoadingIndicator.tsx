import React from "react";
import styles from "./LoadingIndicator.module.css";


interface LoadingIndicatorProps {
    ref: React.RefObject<HTMLDivElement | null>
    visible: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ref, visible}: LoadingIndicatorProps) => {
    return (<>
        {visible && (
            <div ref={ref} className={styles.loadingIndicator}>
                <div className={styles.spinner}></div>
            </div>
        )}

    </>)
}

export default LoadingIndicator