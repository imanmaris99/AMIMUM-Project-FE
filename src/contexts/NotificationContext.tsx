"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export type NotificationType = 'tracking' | 'transaction' | 'wishlist' | 'cart';

interface NotificationState {
  count: number;
  isViewed: boolean;
}

interface NotificationContextType {
  notifications: Record<NotificationType, NotificationState>;
  addNotification: (type: NotificationType) => void;
  resetNotification: (type: NotificationType) => void;
  markAsViewed: (type: NotificationType) => void;
  getNotificationCount: (type: NotificationType) => number;
  isNotificationViewed: (type: NotificationType) => boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Record<NotificationType, NotificationState>>({
    tracking: { count: 0, isViewed: true },
    transaction: { count: 0, isViewed: true },
    wishlist: { count: 0, isViewed: true },
    cart: { count: 0, isViewed: true }
  });

  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        if (parsed && typeof parsed === 'object') {
          const validatedNotifications = {
            tracking: parsed.tracking || { count: 0, isViewed: true },
            transaction: parsed.transaction || { count: 0, isViewed: true },
            wishlist: parsed.wishlist || { count: 0, isViewed: true },
            cart: parsed.cart || { count: 0, isViewed: true }
          };
          setNotifications(validatedNotifications);
        }
      } catch {
        setNotifications({
          tracking: { count: 0, isViewed: true },
          transaction: { count: 0, isViewed: true },
          wishlist: { count: 0, isViewed: true },
          cart: { count: 0, isViewed: true }
        });
        localStorage.removeItem('notifications');
      }
    } else {
      setNotifications({
        tracking: { count: 0, isViewed: true },
        transaction: { count: 0, isViewed: true },
        wishlist: { count: 0, isViewed: true },
        cart: { count: 0, isViewed: true }
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = useCallback((type: NotificationType) => {
    setNotifications(prev => ({
      ...prev,
      [type]: {
        count: prev[type].isViewed ? 1 : prev[type].count + 1,
        isViewed: false
      }
    }));
  }, []);

  const resetNotification = useCallback((type: NotificationType) => {
    setNotifications(prev => ({
      ...prev,
      [type]: {
        count: 0,
        isViewed: true
      }
    }));
  }, []);

  const markAsViewed = useCallback((type: NotificationType) => {
    setNotifications(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        isViewed: true
      }
    }));
  }, []);

  const getNotificationCount = useCallback((type: NotificationType) => {
    return notifications[type].count;
  }, [notifications]);

  const isNotificationViewed = useCallback((type: NotificationType) => {
    return notifications[type].isViewed;
  }, [notifications]);

  const value: NotificationContextType = {
    notifications,
    addNotification,
    resetNotification,
    markAsViewed,
    getNotificationCount,
    isNotificationViewed,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
