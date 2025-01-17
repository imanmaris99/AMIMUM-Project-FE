"use client";

import TopNavigation from "@/components/cart/2_widgets/TopNavigation";
import BottomBar from "@/components/order/BottomBar";
import CourierIcon from "@/components/order/CourierIcon";
import MapIcon from "@/components/order/MapIcon";
import NoteIcon from "@/components/order/NoteIcon";
import PencilIcon from "@/components/order/PencilIcon";

const Order = () => {
  return (
    <div className="bg-black">
      <main className="flex flex-col w-[375px] mx-auto bg-white">
        <TopNavigation>Order</TopNavigation>
        <div className="pt-[133px] w-[324px] mx-auto">
          <h2 className="bg-[#00764F] text-[#F2F8F6] text-center text-base py-1.5 rounded-lg">
            Metode Penenerimaan Pesanan
          </h2>

          <div className="bg-[#F2F8F6] h-14 text-sm grid-cols-2 grid font-semibold rounded-b-lg">
            <div className="flex items-center justify-center space-x-2">
              <label htmlFor="a">Kirim ke tujuan</label>
              <input
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
                type="radio"
                name="order"
                id="b"
                value={"b"}
                className="accent-[#00764F] scale-125"
              />
            </div>
          </div>
        </div>
        <div className="w-[320px] mx-auto pt-7 text-[#242424] font-semibold mb-5">
          <div className="flex items-center space-x-2">
            <MapIcon />

            <h2>Alamat Pengiriman</h2>
          </div>

          <hr className="bg-[#E5E5E5] h-[1px] w-full my-3" />

          <h3 className="text-sm">Alamat pengirim</h3>

          <div className="p-2 text-xs leading-5">
            <h4>Pati, Jawa Tengah</h4>

            <p className="text-[#A2A2A2] font-normal">
              Jalan Silugonggo No. 15, Kelurahan Pati Wetan, Kecamatan Pati,
              Kota Pati, Kode Pos 59185, Jawa Tengah, Indonesia
            </p>
          </div>

          <h3 className="text-sm font-semibold">Alamat tujuan</h3>

          <div className="p-2 text-xs leading-5">
            <h4 className="font-semibold">Lengkapi alamat tujuanmu</h4>
            <p className="text-[#A2A2A2] font-normal">-</p>
          </div>

          <div className="flex items-center space-x-2 pt-4">
            <CourierIcon />

            <h2>Kurir</h2>
          </div>

          <hr className="bg-[#E5E5E5] h-[1px] w-full my-3" />

          <div className="my-2 p-2 bg-gray-50 rounded-lg leading-7">
            <h3 className="text-[15px]">Pilihan layanan</h3>

            <p className="text-[#A2A2A2] font-normal text-xs">
              Layanan - Estimasi
            </p>
          </div>

          <div className="grid grid-cols-2 space-x-2 mt-4">
            <button className="text-xs font-normal border border-[#A2A2A2] rounded-full flex items-center pl-3 space-x-1 py-1">
              <PencilIcon />

              <p>Lengkapi data</p>
            </button>

            <button className="text-xs font-normal border border-[#A2A2A2] rounded-full flex items-center pl-3 space-x-1 py-1">
              <NoteIcon />

              <p>Add Note</p>
            </button>
          </div>
        </div>
        <div className="h-[264px] bg-white"></div>
        <footer className="border-t-4 border-[#E6F1ED] pb-60 px-6 fixed bottom-0 left-0 right-0 bg-white h-[264px] w-[375px] mx-auto">
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
          <button className="bg-[#00764F] w-full text-white py-4 rounded-2xl">
            Order
          </button>
          <BottomBar />
        </footer>
      </main>
    </div>
  );
};

export default Order;
