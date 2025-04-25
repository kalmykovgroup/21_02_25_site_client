
import {DeviceProvider} from "./utils/DeviceContext.tsx";
import AppRouter from "./routes/AppRouter.tsx";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary.tsx";
import ErrorScreen from "./pages/ErrorScreen/ErrorScreen.tsx";

// eslint-disable-next-line react-refresh/only-export-components
export const delay = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};


const App = () => {


    return  (
        // Использование
        <ErrorBoundary fallback={<ErrorScreen />}>
            <DeviceProvider>
                <AppRouter />
            </DeviceProvider>
        </ErrorBoundary>

    )
};

export default App
