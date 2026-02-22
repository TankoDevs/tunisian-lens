import { createContext, useContext, useState, type ReactNode } from 'react';

type AlertType = 'error' | 'success' | 'warning';

interface Alert {
    message: string;
    type: AlertType;
}

interface AlertContextType {
    alert: Alert | null;
    showAlert: (message: string, type?: AlertType) => void;
    hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
    const [alert, setAlert] = useState<Alert | null>(null);

    const showAlert = (message: string, type: AlertType = 'error') => {
        setAlert({ message, type });
        // Auto-hide after 5 seconds
        setTimeout(() => setAlert(null), 5000);
    };

    const hideAlert = () => setAlert(null);

    return (
        <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
            {children}
        </AlertContext.Provider>
    );
}

export function useAlert() {
    const context = useContext(AlertContext);
    if (context === undefined) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
}
