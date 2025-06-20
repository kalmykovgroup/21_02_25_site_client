import React, { createContext, useContext, useEffect, useState } from "react";

interface DeviceContextType {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    width: number;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider = ({ children }: { children: React.ReactNode }) => {
    const [device, setDevice] = useState<DeviceContextType>({
        isMobile: window.innerWidth < 768,
        isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
        isDesktop: window.innerWidth >= 1024,
        width: window.innerWidth,
    });

    useEffect(() => {
        const handleResize = () => {
            setDevice({
                isMobile: window.innerWidth < 768,
                isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
                isDesktop: window.innerWidth >= 1024,
                width: window.innerWidth,
            });
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return <DeviceContext.Provider value={device}>{children}</DeviceContext.Provider>;
};

export const useDevice = () => {
    const context = useContext(DeviceContext);
    if (!context) throw new Error("useDevice must be used within a DeviceProvider");
    return context;
};
