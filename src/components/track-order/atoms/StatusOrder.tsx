"use client";

import React from "react";
import Image from "next/image";

interface StatusItem {
  id: string;
  title: string;
  icon: string;
  isCompleted: boolean;
}

interface StatusOrderProps {
  currentStatus?: number; // 0-3 untuk menentukan status saat ini
}

const StatusOrder: React.FC<StatusOrderProps> = ({ currentStatus = 0 }) => {
  const statusItems: StatusItem[] = [
    {
      id: "packed",
      title: "Dibungkus",
      icon: "box",
      isCompleted: currentStatus >= 0
    },
    {
      id: "processing",
      title: "Diproses ke kurir",
      icon: "box-time",
      isCompleted: currentStatus >= 1
    },
    {
      id: "shipping",
      title: "Pengiriman",
      icon: "truck-time",
      isCompleted: currentStatus >= 2
    },
    {
      id: "delivered",
      title: "Sampai tujuan",
      icon: "truck-tick",
      isCompleted: currentStatus >= 3
    }
  ];

  const getIconComponent = (iconName: string) => {
    return (
      <Image
        src={`/${iconName}.svg`}
        alt={`${iconName} icon`}
        width={20}
        height={20}
        className="text-[#292D32]"
      />
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
      <div className="space-y-6">
        {/* Title */}
        <h3 className="text-lg font-semibold text-[#0D0E09]">
          Status Order
        </h3>
        
        {/* Status List */}
        <div className="space-y-5">
          {statusItems.map((item, index) => (
            <div key={item.id} className="flex items-center justify-between">
              {/* Left side - Icon and Text */}
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {getIconComponent(item.icon)}
                </div>
                <span className="text-sm font-medium text-[#242424]">
                  {item.title}
                </span>
              </div>
              
              {/* Right side - Check mark */}
              {item.isCompleted && (
                <div className="flex-shrink-0">
                  <Image
                    src="/Vector.svg"
                    alt="check mark"
                    width={16}
                    height={16}
                    className="text-[#00593B]"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusOrder;
