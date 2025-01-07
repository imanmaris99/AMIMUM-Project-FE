"use client";

import React, { useState } from "react";
import { GoChevronLeft } from "react-icons/go";
import { BsTrash } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import { RiCheckboxCircleLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";

const Shipment = () => {
  const [activeStates, setActiveStates] = useState([false, false]);

  const handleIconClick = (index: number) => {
    setActiveStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <div className="flex justify-center items-center relative mt-16">
        <div className="absolute left-10">
          <GoChevronLeft className="text-3xl cursor-pointer" />
        </div>
        <div>
          <h1 className="text-[16px] font-semibold">Alamat Pengirimanku</h1>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center gap-4 mt-20 mb-8">
        {[...Array(2)].map((_, index) => (
          <div key={index} className="flex justify-center items-center gap-4 w-80 border-b border-gray-300 pb-4">
            <div onClick={() => handleIconClick(index)}>
              {activeStates[index] ? (
                <RiCheckboxCircleLine className="text-2xl cursor-pointer" />
              ) : (
                <RiCheckboxBlankCircleLine className="text-2xl cursor-pointer" />
              )}
            </div>

            <div className="flex flex-col justify-center gap-1">
              <p className="text-xs font-semibold">Wonosari, Jawa Tengah</p>
              <p className="text-xs text-gray-500">
                Jalan Patriot No. 15, Kecamatan Bayat, Kota Wonogiri, Kode Pos
                59191, Jawa Tengah, Indonesia
              </p>
            </div>

            <div className="flex flex-col justify-center items-center gap-2">
              <BsTrash className="text-lg cursor-pointer" />
              <FiEdit className="text-lg cursor-pointer" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center mt-auto mb-10">
        <Button className="bg-primary text-white px-4 py-2 rounded-lg w-80 h-14 text-lg">Simpan</Button>
      </div>
    </div>
  );
};

export default Shipment;
