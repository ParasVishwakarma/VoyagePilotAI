import { createContext, useContext, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {

    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const showNotification = (
        message,
        severity = "success"
    ) => {
        setNotification({
            open: true,
            message,
            severity,
        });
    };

    const handleClose = () => {
        setNotification((prev) => ({
            ...prev,
            open: false,
        }));
    };

    return (
        <NotificationContext.Provider
            value={{ showNotification }}
        >
            {children}

            <Snackbar
                open={notification.open}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                <Alert
                    severity={notification.severity}
                    onClose={handleClose}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
}

export const useNotification = () =>
    useContext(NotificationContext);
