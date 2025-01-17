"use client";

import TopNavigation from "@/components/cart/2_widgets/TopNavigation";
import AmbilDiToko from "@/components/order/AmbilDiToko";
import BottomBar from "@/components/order/BottomBar";
import KirimKeTujuan from "@/components/order/KirimKeTujuan";
import { useState } from "react";

const Order = () => {
  const [orderMethod, setOrderMethod] = useState(1);

  return (
    <div className="bg-black">
      <main className="flex flex-col w-[375px] mx-auto bg-[#FAFAFA]">
        <TopNavigation>Order</TopNavigation>
        <div className="pt-[133px] w-[324px] mx-auto">
          <h2 className="bg-[#00764F] text-[#F2F8F6] text-center text-base py-1.5 rounded-lg">
            Metode Penenerimaan Pesanan
          </h2>

          <div className="bg-[#F2F8F6] h-14 text-sm grid-cols-2 grid font-semibold rounded-b-lg">
            <div className="flex items-center justify-center space-x-2">
              <label htmlFor="a">Kirim ke tujuan</label>
              <input
                onClick={() => setOrderMethod(1)}
                className="accent-[#00764F] scale-125"
                type="radio"
                name="order"
                id="a"
                value={"a"}
              />
            </div>

            <div className="flex items-center justify-center space-x-2">
              <label htmlFor="b">Ambil di toko</label>
              <input
                onClick={() => setOrderMethod(2)}
                className="accent-[#00764F] scale-125"
                type="radio"
                name="order"
                id="b"
                value={"b"}
              />
            </div>
          </div>
        </div>

        {orderMethod === 1 && <KirimKeTujuan />}

        {orderMethod === 2 && <AmbilDiToko />}

        <div className="border-t-4 border-[#E6F1ED] px-6">
          <div className="py-7">
            <h2 className="font-semibold">Payment Summary</h2>

            <div className="w-full flex flex-col text-sm py-4 space-y-2">
              <div className="flex justify-between">
                <p>Price</p>

                <p className="font-semibold">Rp 47250</p>
              </div>

              <div className="flex justify-between">
                <p>Delivery Fee</p>

                <p className="font-semibold">Rp -</p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-28 bg-white"></div>
        <footer className="pb-28 px-6 fixed bottom-0 left-0 right-0 bg-white h-16 w-[375px] mx-auto">
          <button className="bg-[#00764F] w-full text-white py-4 rounded-2xl mt-4">
            Order
          </button>
          <BottomBar />
        </footer>
      </main>
    </div>
  );
};

export default Order;
