
import AppRouter from "./routes/AppRouter.tsx";
import {DeviceProvider} from "./DeviceContext.tsx";

export const delay = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};


const App = () => {
    return  (
        <DeviceProvider>
            <AppRouter />
        </DeviceProvider>
    )
};

export default App
