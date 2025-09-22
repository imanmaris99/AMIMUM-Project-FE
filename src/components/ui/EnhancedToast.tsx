// Enhanced Toast Component with better UX
import React from "react";
import { toast, Toast } from "react-hot-toast";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

interface EnhancedToastProps {
  t: Toast;
  message: string;
  type?: "success" | "error" | "warning" | "info";
  title?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
  persistent?: boolean;
}

const EnhancedToast: React.FC<EnhancedToastProps> = ({
  t,
  message,
  type = "info",
  title,
  action,
  // duration = 5000, // Removed unused parameter
  // persistent = false // Removed unused parameter
}) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  const colors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800"
  };

  const handleAction = () => {
    if (action) {
      action.onClick();
      toast.dismiss(t.id);
    }
  };

  const handleDismiss = () => {
    toast.dismiss(t.id);
  };

  return (
    <div
      className={`
        max-w-sm w-full ${colors[type]} border rounded-lg shadow-lg pointer-events-auto
        transform transition-all duration-300 ease-in-out
        ${t.visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
      `}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {icons[type]}
          </div>
          <div className="ml-3 w-0 flex-1">
            {title && (
              <p className="text-sm font-medium">
                {title}
              </p>
            )}
            <p className={`text-sm ${title ? 'mt-1' : ''}`}>
              {message}
            </p>
            {action && (
              <div className="mt-2">
                <button
                  onClick={handleAction}
                  className="text-sm font-medium underline hover:no-underline focus:outline-none focus:underline"
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleDismiss}
              className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced toast functions
export const enhancedToast = {
  success: (message: string, options?: Partial<EnhancedToastProps>) => {
    return toast.custom((t) => (
      <EnhancedToast
        t={t}
        message={message}
        type="success"
        {...options}
      />
    ), {
      duration: options?.duration || 4000,
      position: 'top-center'
    });
  },

  error: (message: string, options?: Partial<EnhancedToastProps>) => {
    return toast.custom((t) => (
      <EnhancedToast
        t={t}
        message={message}
        type="error"
        {...options}
      />
    ), {
      duration: options?.duration || 6000,
      position: 'top-center'
    });
  },

  warning: (message: string, options?: Partial<EnhancedToastProps>) => {
    return toast.custom((t) => (
      <EnhancedToast
        t={t}
        message={message}
        type="warning"
        {...options}
      />
    ), {
      duration: options?.duration || 5000,
      position: 'top-center'
    });
  },

  info: (message: string, options?: Partial<EnhancedToastProps>) => {
    return toast.custom((t) => (
      <EnhancedToast
        t={t}
        message={message}
        type="info"
        {...options}
      />
    ), {
      duration: options?.duration || 4000,
      position: 'top-center'
    });
  },

  loading: (message: string, /* options?: Partial<EnhancedToastProps> */) => { // Removed unused parameter
    return toast.custom((/* t */) => ( // Removed unused parameter
      <div className="max-w-sm w-full bg-white border border-gray-200 rounded-lg shadow-lg pointer-events-auto">
        <div className="p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-900">{message}</p>
            </div>
          </div>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center'
    });
  }
};

export default EnhancedToast;
