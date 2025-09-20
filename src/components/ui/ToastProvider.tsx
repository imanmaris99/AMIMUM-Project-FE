"use client";

import React from "react";
import { Toaster } from "react-hot-toast";

const ToastProvider: React.FC = () => {
  return (
    <Toaster 
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
          maxWidth: '400px',
          margin: '0 auto',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          padding: '12px 16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
        success: {
          style: {
            background: '#10B981',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#10B981',
          },
        },
        error: {
          style: {
            background: '#EF4444',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#EF4444',
          },
        },
        loading: {
          style: {
            background: '#3B82F6',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#3B82F6',
          },
        },
      }}
      containerStyle={{
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: '440px',
        width: '100%',
        zIndex: 9999,
      }}
    />
  );
};

export default ToastProvider;
