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
      <div className="mx-auto min-x-[360px] max-w-[400px] relative">
        <div className="fixed top-0 right-0 left-0 max-w-[400px] mx-auto bg-white h-[106px] flex p-4 z-40">
          <div className="w-1/3 flex self-end pl-5">
            <Image src={"/cart/leftarrow.svg"} alt="" width={32} height={32} />
          </div>

          <div className="w-1/3 flex justify-center self-end pb-1">
            <h1 className="">Keranjangku</h1>
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
        <div className="h-[200px] pt-10 bg-color-[#FAFAFA] border-t-4 border-[#E6F1ED] pb-80 px-6">
          <div className="h-[160px] bg-white shadow-2xl rounded-3xl p-6">
            <div className="flex justify-between items-center border-b-2 border-[#F2F2F2] py-1">
              <h2 className="text-[#999999]">Items</h2>
              <h2>Rp 52500</h2>
            </div>
            <div className="flex justify-between items-center border-b-2 border-[#F2F2F2] py-1">
              <h2 className="text-[#999999]">Discounts</h2>
              <h2>-Rp 5250</h2>
            </div>
            <div className="flex justify-between items-center py-5">
              <h2 className="text-[#999999] font-bold">Total</h2>
              <h2 className="font-bold">Rp 47250</h2>
            </div>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-white mx-auto max-w-[400px] rounded-t-3xl">
          <div className="flex gap-6 items-center justify-between mt-6 shadow-2xl py-4 px-[30px] flex-grow">
            <div className="flex items-center gap-2">
              <Image src={"/cart/checkbox.svg"} alt="" width={24} height={24} />
              <h3 className="text-sm text-[#C4C4C4]">All Item</h3>
            </div>
            <button className="bg-[#00764F] text-[#E6F1ED] py-2 px-4 rounded-full">
              Checkout (3)
            </button>
          </div>
          <div className="h-5 bg-white flex justify-center">
            <Image src={"/cart/taskbar.svg"} alt="" width={134} height={5} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
