import React, { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback: React.ReactElement<{ error?: Error }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('ErrorBoundary caught:', error, info);
        // Здесь можно отправить ошибку в систему мониторинга
    }

    render() {
        if (this.state.hasError) {
            return React.cloneElement(this.props.fallback, {
                error: this.state.error // Передаем ошибку через пропсы
            });
        }
        return this.props.children;
    }
}

export default ErrorBoundary;