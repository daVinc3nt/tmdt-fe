import React, { createContext, useCallback, useContext, useState } from 'react';
import ToastNotification, { type ToastProps } from '../components/ui/toast-notification';

interface ToastContextType {
    showToast: (message: string, type?: ToastProps['type'], title?: string, duration?: number) => void;
    showSuccess: (message: string, title?: string) => void;
    showError: (message: string, title?: string) => void;
    showWarning: (message: string, title?: string) => void;
    showInfo: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

interface Toast extends ToastProps {
    id: string;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastProps['type'] = 'info', title?: string, duration?: number) => {
        const id = Date.now().toString();
        const newToast: Toast = {
            id,
            message,
            type,
            title,
            duration: duration || 8000,
            onClose: () => removeToast(id),
        };

        setToasts(prev => [...prev, newToast]);
    }, [removeToast]);

    const showSuccess = useCallback((message: string, title?: string) => {
        showToast(message, 'success', title);
    }, [showToast]);

    const showError = useCallback((message: string, title?: string) => {
        showToast(message, 'error', title);
    }, [showToast]);

    const showWarning = useCallback((message: string, title?: string) => {
        showToast(message, 'warning', title);
    }, [showToast]);

    const showInfo = useCallback((message: string, title?: string) => {
        showToast(message, 'info', title);
    }, [showToast]);

    return (
        <ToastContext.Provider value={{
            showToast,
            showSuccess,
            showError,
            showWarning,
            showInfo,
        }}>
            {children}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map(toast => (
                    <ToastNotification key={toast.id} {...toast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};
