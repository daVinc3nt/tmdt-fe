import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { cn } from './utils';

export interface ToastProps {
    id?: string;
    title?: string;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    onClose?: () => void;
}

const ToastNotification: React.FC<ToastProps> = ({
    id,
    title,
    message,
    type = 'info',
    duration = 8000,
    onClose,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        setIsVisible(true);

        // Auto dismiss after duration
        const timer = setTimeout(() => {
            handleDismiss();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    const handleDismiss = () => {
        setIsLeaving(true);
        setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, 300);
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'info':
            default:
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'error':
                return 'bg-red-50 border-red-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            case 'info':
            default:
                return 'bg-blue-50 border-blue-200';
        }
    };

    if (!isVisible) return null;

    return (
        <div
            className={cn(
                'flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-sm transition-all duration-300',
                getBackgroundColor(),
                isLeaving ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
            )}
        >
            {getIcon()}
            <div className="flex-1 min-w-0">
                {title && <p className="font-semibold text-gray-900">{title}</p>}
                <p className="text-sm text-gray-700 break-words">{message}</p>
            </div>
            <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors"
            >
                <X className="w-4 h-4 text-gray-500" />
            </button>
        </div>
    );
};

export default ToastNotification;
