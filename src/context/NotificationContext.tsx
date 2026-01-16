import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export interface Notification {
    id: string;
    type: "info" | "warning" | "critical";
    title: string;
    message: string;
    alertId?: string;
    timestamp: string;
    read: boolean;
}

interface NotificationContextType {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
    dismissNotification: (id: string) => void;
    clearAllNotifications: () => void;
    navigateToAlert: (alertId: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const navigate = useNavigate();

    const addNotification = useCallback((notification: Omit<Notification, "id" | "timestamp" | "read">) => {
        const newNotification: Notification = {
            ...notification,
            id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            timestamp: new Date().toISOString(),
            read: false,
        };

        setNotifications((prev) => [newNotification, ...prev].slice(0, 10)); // Keep max 10

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id));
        }, 5000);
    }, []);

    const dismissNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const clearAllNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    const navigateToAlert = useCallback((alertId: string) => {
        // Navigate to simulation page where alerts are visible
        navigate("/dashboard/simulation");
        // Dismiss the notification
        setNotifications((prev) => prev.filter((n) => n.alertId !== alertId));
    }, [navigate]);

    return (
        <NotificationContext.Provider
            value={{ notifications, addNotification, dismissNotification, clearAllNotifications, navigateToAlert }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) throw new Error("useNotifications must be used within NotificationProvider");
    return context;
}
