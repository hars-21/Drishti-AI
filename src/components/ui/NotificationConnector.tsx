import { useEffect } from "react";
import { useSimulation } from "../../context/SimulationContext";
import { useNotifications } from "../../context/NotificationContext";
import type { SimulationAlert } from "../../types/simulationTypes";

/**
 * This component connects the SimulationContext to the NotificationContext.
 * It sets up the notification callback so alerts trigger toast notifications.
 */
export function NotificationConnector() {
    const { setNotificationCallback } = useSimulation();
    const { addNotification } = useNotifications();

    useEffect(() => {
        const handleNotification = (alert: SimulationAlert) => {
            addNotification({
                type: alert.severity === "CRITICAL" ? "critical" : alert.severity === "WARNING" ? "warning" : "info",
                title: `${alert.severity} Alert`,
                message: alert.message,
                alertId: alert.id,
            });
        };

        setNotificationCallback(handleNotification);

        return () => {
            setNotificationCallback(null);
        };
    }, [setNotificationCallback, addNotification]);

    return null;
}
