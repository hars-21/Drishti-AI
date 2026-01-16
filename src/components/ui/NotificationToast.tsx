import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Info, X, Bell } from "lucide-react";
import { useNotifications, type Notification } from "../../context/NotificationContext";

const severityStyles = {
    critical: {
        bg: "bg-red-50 border-red-200",
        icon: "text-red-600",
        title: "text-red-900",
        message: "text-red-700",
    },
    warning: {
        bg: "bg-amber-50 border-amber-200",
        icon: "text-amber-600",
        title: "text-amber-900",
        message: "text-amber-700",
    },
    info: {
        bg: "bg-blue-50 border-blue-200",
        icon: "text-blue-600",
        title: "text-blue-900",
        message: "text-blue-700",
    },
};

function NotificationItem({ notification }: { notification: Notification }) {
    const { dismissNotification, navigateToAlert } = useNotifications();
    const styles = severityStyles[notification.type];

    const handleClick = () => {
        if (notification.alertId) {
            navigateToAlert(notification.alertId);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative overflow-hidden rounded-xl border shadow-lg ${styles.bg} ${notification.alertId ? "cursor-pointer hover:shadow-xl" : ""
                }`}
            onClick={handleClick}
        >
            <div className="flex items-start gap-3 p-4">
                <div className={`shrink-0 mt-0.5 ${styles.icon}`}>
                    {notification.type === "critical" ? (
                        <AlertTriangle className="w-5 h-5" />
                    ) : notification.type === "warning" ? (
                        <Bell className="w-5 h-5" />
                    ) : (
                        <Info className="w-5 h-5" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${styles.title}`}>{notification.title}</p>
                    <p className={`text-xs mt-0.5 line-clamp-2 ${styles.message}`}>{notification.message}</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                    </p>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        dismissNotification(notification.id);
                    }}
                    className="shrink-0 p-1 hover:bg-black/5 rounded-lg transition-colors"
                >
                    <X className="w-4 h-4 text-slate-400" />
                </button>
            </div>
            {notification.alertId && (
                <div className="px-4 py-2 bg-black/5 text-[10px] font-semibold text-slate-600">
                    Click to view alert →
                </div>
            )}
        </motion.div>
    );
}

export function NotificationToast() {
    const { notifications } = useNotifications();

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]">
            <AnimatePresence mode="popLayout">
                {notifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                ))}
            </AnimatePresence>
        </div>
    );
}

export default NotificationToast;
