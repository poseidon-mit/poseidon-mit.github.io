import { createContext, useContext, useState, ReactNode, useCallback, useRef, useEffect } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextValue {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timerIds = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  useEffect(() => {
    return () => {
      timerIds.current.forEach(clearTimeout);
    };
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    const newNotification: Notification = {
      id,
      duration: 5000,
      ...notification
    };

    setNotifications((prev) => [...prev, newNotification]);

    // Auto-remove after duration
    if (newNotification.duration && newNotification.duration > 0) {
      const timerId = setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        timerIds.current.delete(timerId);
      }, newNotification.duration);
      timerIds.current.add(timerId);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const success = useCallback(
    (title: string, message?: string) => {
      addNotification({ type: 'success', title, message });
    },
    [addNotification]
  );

  const error = useCallback(
    (title: string, message?: string) => {
      addNotification({ type: 'error', title, message, duration: 7000 });
    },
    [addNotification]
  );

  const warning = useCallback(
    (title: string, message?: string) => {
      addNotification({ type: 'warning', title, message });
    },
    [addNotification]
  );

  const info = useCallback(
    (title: string, message?: string) => {
      addNotification({ type: 'info', title, message });
    },
    [addNotification]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearAll,
        success,
        error,
        warning,
        info
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}
