"use client";

import { useEffect, useState } from "react";
import { X, Check, Info, AlertTriangle } from "lucide-react";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  title?: string;
  userType: "farmer" | "buyer" | "wholesaler";
  type?: "success" | "error" | "info" | "warning";
}

export default function AlertModal({
  isOpen,
  onClose,
  message,
  title = "Notification",
  userType,
  type = "info",
}: AlertModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    } else {
      setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  const getThemeColors = () => {
    switch (userType) {
      case "farmer":
        return {
          bg: "bg-green-50",
          border: "border-green-100",
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
          button: "bg-green-600 hover:bg-green-700",
          title: "text-green-900",
        };
      case "wholesaler":
        return {
          bg: "bg-violet-50",
          border: "border-violet-100",
          iconBg: "bg-violet-100",
          iconColor: "text-violet-600",
          button: "bg-violet-600 hover:bg-violet-700",
          title: "text-violet-900",
        };
      case "buyer":
      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-100",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          button: "bg-blue-600 hover:bg-blue-700",
          title: "text-blue-900",
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <Check className={`w-6 h-6 ${colors.iconColor}`} />;
      case "error":
        return <AlertTriangle className="w-6 h-6 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      default:
        return <Info className={`w-6 h-6 ${colors.iconColor}`} />;
    }
  };

  const colors = getThemeColors();

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-sm bg-white rounded-2xl shadow-xl transform transition-all duration-300 ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        } overflow-hidden`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 flex items-center justify-between ${colors.bg}`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${colors.iconBg}`}
            >
              {getIcon()}
            </div>
            <h3 className={`font-semibold ${colors.title}`}>{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className={`w-full py-3 px-4 rounded-xl text-white font-medium shadow-sm transition-transform active:scale-[0.98] ${colors.button}`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
