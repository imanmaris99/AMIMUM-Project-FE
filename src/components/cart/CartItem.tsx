"use client";

import React, { useState } from "react";

interface CartItemProps {
  id: string;
  name: string;
  variant: string;
  unit: string;
  price: number;
  image: string;
  initialQuantity?: number;
  initialChecked?: boolean;
  onQuantityChange?: (id: string, quantity: number) => void;
  onCheckChange?: (id: string, checked: boolean) => void;
  onDelete?: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  variant,
  unit,
  price,
  image,
  initialQuantity = 1,
  initialChecked = true,
  onQuantityChange,
  onCheckChange,
  onDelete,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isChecked, setIsChecked] = useState(initialChecked);

  const handleMinus = () => {
    const newQuantity = Math.max(1, quantity - 1);
    setQuantity(newQuantity);
    onQuantityChange?.(id, newQuantity);
  };

  const handlePlus = () => {
    const newQuantity = Math.max(1, quantity + 1);
    setQuantity(newQuantity);
    onQuantityChange?.(id, newQuantity);
  };

  const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Math.max(1, parseInt(e.target.value) || 1);
    setQuantity(newQuantity);
    onQuantityChange?.(id, newQuantity);
  };

  const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    onCheckChange?.(id, checked);
  };

  const handleDelete = () => {
    onDelete?.(id);
  };

  return (
    <article className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl max-w-full mx-auto">
      {/* Checkbox */}
      <label className={`w-7 h-7 border-2 rounded-lg grid place-items-center cursor-pointer flex-shrink-0 transition-all duration-150 ${
        isChecked 
          ? 'border-primary bg-primary' 
          : 'border-gray-300 hover:border-gray-400'
      }`} aria-label="Pilih produk">
        <input 
          type="checkbox" 
          checked={isChecked}
          onChange={handleCheckChange}
          className="appearance-none m-0 w-0 h-0 absolute"
        />
        {/* Check icon */}
        <svg 
          viewBox="0 0 24 24" 
          width="18" 
          height="18" 
          fill="none" 
          stroke="white" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          aria-hidden="true"
          className={`transition-all duration-150 ${isChecked ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </label>

      {/* Image */}
      <div className="w-[70px] h-[70px] rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 bg-gray-50 grid place-items-center">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <h2 className="font-bold text-base mb-1">{name}</h2>
        <p className="text-gray-500 text-xs m-0">{variant} • {unit}</p>
        <div className="mt-2 text-base font-bold text-green-800" data-unit={price}>
          Rp {price.toLocaleString('id-ID')}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-2 flex-shrink-0">
        <button 
          className="w-7 h-7 border-none bg-transparent cursor-pointer opacity-80 hover:opacity-100" 
          title="Hapus" 
          onClick={handleDelete}
        >
          <img src="/Trush_Icon_UIA.svg" alt="Hapus" width="20" height="20" />
        </button>

        <div className="flex items-center border border-gray-200 rounded-md h-8 overflow-hidden" role="group" aria-label="Pengatur jumlah">
          <button 
            type="button" 
            className="w-8 h-8 border-0 bg-gray-100 cursor-pointer text-base" 
            aria-label="Kurangi" 
            onClick={handleMinus}
          >
            −
          </button>
          <input 
            type="number" 
            className="w-10 h-8 border-0 text-center text-sm outline-none" 
            value={quantity} 
            min="1" 
            inputMode="numeric" 
            aria-label="Jumlah"
            onChange={handleQuantityInput}
          />
          <button 
            type="button" 
            className="w-8 h-8 border-0 bg-gray-100 cursor-pointer text-base" 
            aria-label="Tambah" 
            onClick={handlePlus}
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
};

export default CartItem;
