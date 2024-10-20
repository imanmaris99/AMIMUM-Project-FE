"use client";

import Button from "../Button";
import Image from "next/image";
import searchIcon from "../../../public/assets/icons/search-normal.svg";

const handleSearch = () => {
    alert("duh, belum bisa search euy!");
}

const Search = () => {
    return (
        <div className="flex items-center justify-center border border-gray-200 rounded-lg px-2 py-2">
            <Image className="ml-2" src={searchIcon} alt="search" width={20} height={20} />
            <input className="w-full px-2 focus:outline-none text-lg placeholder:text-sm" type="text" placeholder="Cari produk" />
            <Button onClick={handleSearch} />
        </div>
    )
}

export default Search;

