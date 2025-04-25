import {Outlet} from "react-router-dom";
import Advertisement from "../../components/Header/Advertisement/Advertisement.tsx";
import Header from "../../components/Header/Header.tsx";
import React from "react"; 


const MainLayout: React.FC = () => {
    //const { isMobile, isTablet, isDesktop } = useDevice();
    return (
        <main>
            <Advertisement/>
            <Header/>
            <Outlet /> {/* Здесь рендерятся дочерние маршруты */}
        </main>
    );
};

export default MainLayout;