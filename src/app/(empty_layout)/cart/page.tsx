"use client";

import Image from "next/image";
import React from "react";

const Cart = () => {
  const cartItems = [
    {
      id: 1,
      src: "/cart/buyungupik-anggur.svg",
      name: "Buyung Upik",
      variant: "Anggur",
      pack: "1 dus",
      price: 17500,
      qty: "3",
      checked: true,
    },
    {
      id: 2,
      src: "/cart/buyungupik-cokelat.svg",
      name: "Buyung Upik",
      variant: "Cokelat",
      pack: "1 dus",
      price: 17500,
      qty: "1",
      checked: false,
    },
    {
      id: 3,
      src: "/cart/buyungupik-anggur.svg",
      name: "Buyung Upik",
      variant: "Anggur",
      pack: "1 unit",
      price: 2000,
      qty: "2",
      checked: false,
    },
  ];

  return (
    <>
      <main className="pb-20 mx-auto">
        <div className="fixed top-0 right-0 left-0 max-w-[400px] mx-auto bg-white h-[106px] flex p-4">
          <div className="w-1/3 flex self-end pl-5">
            <Image src={"/cart/leftarrow.svg"} alt="" width={32} height={32} />
          </div>

          <div className="w-1/3 flex justify-center self-end pb-1">
            <h1 className="text-">Keranjangku</h1>
          </div>

          <div className="w-1/3"></div>
        </div>

        <div className="p-4 h-[500px] pt-[106px]">
          <ol>
            {cartItems.map((cartItem) => (
              <li key={cartItem.id} className="flex py-2 items-center">
                <div className="w-[53px] flex items-center justify-center">
                  {cartItem.checked === true ? (
                    <Image
                      src={"/cart/checkedbox.svg"}
                      alt=""
                      width={24}
                      height={24}
                    />
                  ) : (
                    <Image
                      src={"/cart/checkbox.svg"}
                      alt=""
                      width={24}
                      height={24}
                    />
                  )}
                </div>
                <div className="w-[100px]">
                  <Image src={cartItem.src} alt="" width={100} height={100} />
                </div>
                <div className="flex flex-col flex-grow pr-3.5">
                  <h2 className="text-sm">{cartItem.name}</h2>
                  <h3 className="text-xs text-[#C4C4C4] mb-3">
                    {cartItem.variant} • {cartItem.pack}
                  </h3>
                  <div className="flex w-full justify-between items-center">
                    <h2>Rp {cartItem.price}</h2>
                    <div className="flex items-center mr-0 gap-2">
                      <button className="text-[#C4C4C4]">-</button>
                      <h3 className="text-xs pt-0.5">{cartItem.qty}</h3>
                      <button className="text-[#999999]">+</button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="h-[200px] pt-10 bg-color-[#FAFAFA] border-t-4 border-[#E6F1ED] p-4">
          <div className="h-[150px] bg-white shadow-2xl rounded-3xl p-4">
            <div>
              <h2>Items</h2>
              <h2>Rp 52500</h2>
            </div>
            <div>
              <h2>Discounts</h2>
              <h2>-Rp 5250</h2>
            </div>
            <div>
              <h2>Total</h2>
              <h2>Rp 47250</h2>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-10 bg-white rounded-3xl shadow-2xl py-4 px-[30px]">
          <div className="flex items-center gap-2">
            <Image src={"/cart/checkbox.svg"} alt="" width={24} height={24} />
            <h3 className="text-sm text-[#C4C4C4]">All Item</h3>
          </div>
          <button className="bg-[#00764F] text-[#E6F1ED] py-2 px-4 rounded-full">
            Checkout (3)
          </button>
        </div>
      </main>
    </>
  );
};

export default Cart;
