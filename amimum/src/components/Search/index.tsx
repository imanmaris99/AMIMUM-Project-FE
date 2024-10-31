"use client";

import { CiSearch } from "react-icons/ci";
import { Button } from "../ui/button";


const handleSearch = () => {
    console.log("duh, belum bisa search euy!");
}

const Search = () => {
    return (
        <div className="flex items-center justify-center border border-gray-200 rounded-lg px-2 py-2">
            <CiSearch className="w-8 h-8 text-gray-500 ml-2" />
            <input className="w-full px-2 focus:outline-none text-lg placeholder:text-sm" type="text" placeholder="Cari produk" />
            <Button onClick={handleSearch} variant="default">Cari</Button>
        </div>
    )
}

export default Search;

