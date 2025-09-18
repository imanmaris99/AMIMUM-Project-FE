import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CardProductProps } from "./CardProduct/types";

function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
  let timeout: ReturnType<typeof setTimeout>;
  return function(this: unknown, ...args: unknown[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  } as T;
}

const useSearchLogic = () => {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [products, setProducts] = useState<CardProductProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    if (search.trim()) {
      router.push(`/search?q=${search}`);
    }
  };

  const handleSelectProduct = (productId: string) => {
    router.push(`/detail-product/${productId}`);
  };

  // Dummy data untuk search dropdown sementara karena server sedang down
  // Data ini konsisten dengan data di detail product page
  const dummyProducts = [
    { 
      id: "1", 
      name: "Jamu Beras Kencur Air Mancur", 
      price: 15000,
      all_variants: [
        { id: 1, name: "100ml", price: 15000, stock: 50 },
        { id: 2, name: "200ml", price: 28000, stock: 30 }
      ]
    },
    { 
      id: "2", 
      name: "Jamu Kunyit Asam Air Mancur", 
      price: 18000,
      all_variants: [
        { id: 1, name: "100ml", price: 18000, stock: 40 },
        { id: 2, name: "200ml", price: 32000, stock: 25 }
      ]
    },
    { 
      id: "3", 
      name: "Jamu Galian Singset Aji Mujarab", 
      price: 12000,
      all_variants: [
        { id: 1, name: "100ml", price: 12000, stock: 35 },
        { id: 2, name: "200ml", price: 22000, stock: 15 }
      ]
    },
    { 
      id: "4", 
      name: "Jamu Beras Kencur Jamu Jago", 
      price: 14000,
      all_variants: [
        { id: 1, name: "100ml", price: 14000, stock: 60 },
        { id: 2, name: "200ml", price: 26000, stock: 40 }
      ]
    },
    { 
      id: "5", 
      name: "Jamu Beras Kencur Nyonya Meneer", 
      price: 25000,
      all_variants: [
        { id: 1, name: "100ml", price: 25000, stock: 30 },
        { id: 2, name: "200ml", price: 45000, stock: 20 }
      ]
    },
    { 
      id: "6", 
      name: "Jamu Beras Kencur Sabdo Palon", 
      price: 18000,
      all_variants: [
        { id: 1, name: "100ml", price: 18000, stock: 45 },
        { id: 2, name: "200ml", price: 32000, stock: 25 }
      ]
    },
    { 
      id: "7", 
      name: "Jamu Beras Kencur Sido Muncul", 
      price: 16000,
      all_variants: [
        { id: 1, name: "100ml", price: 16000, stock: 40 },
        { id: 2, name: "200ml", price: 28000, stock: 30 }
      ]
    },
    { 
      id: "8", 
      name: "Jamu Kunyit Asam Sido Muncul", 
      price: 17000,
      all_variants: [
        { id: 1, name: "100ml", price: 17000, stock: 25 },
        { id: 2, name: "200ml", price: 30000, stock: 15 }
      ]
    },
    { 
      id: "9", 
      name: "Jamu Galian Singset Sido Muncul", 
      price: 19000,
      all_variants: [
        { id: 1, name: "100ml", price: 19000, stock: 30 },
        { id: 2, name: "200ml", price: 35000, stock: 20 }
      ]
    },
    { 
      id: "10", 
      name: "Jamu Temulawak Sido Muncul", 
      price: 20000,
      all_variants: [
        { id: 1, name: "100ml", price: 20000, stock: 35 },
        { id: 2, name: "200ml", price: 36000, stock: 25 }
      ]
    },
    { 
      id: "11", 
      name: "Jamu Beras Kencur Aji Mujarab", 
      price: 13000,
      all_variants: [
        { id: 1, name: "100ml", price: 13000, stock: 30 },
        { id: 2, name: "200ml", price: 24000, stock: 20 }
      ]
    },
    { 
      id: "12", 
      name: "Jamu Kunyit Asam Jamu Jago", 
      price: 15000,
      all_variants: [
        { id: 1, name: "100ml", price: 15000, stock: 15 },
        { id: 2, name: "200ml", price: 27000, stock: 10 }
      ]
    },
    { 
      id: "13", 
      name: "Jamu Galian Singset Jamu Jago", 
      price: 16000,
      all_variants: [
        { id: 1, name: "100ml", price: 16000, stock: 40 },
        { id: 2, name: "200ml", price: 28000, stock: 25 }
      ]
    },
    { 
      id: "14", 
      name: "Jamu Temulawak Jamu Jago", 
      price: 17000,
      all_variants: [
        { id: 1, name: "100ml", price: 17000, stock: 50 },
        { id: 2, name: "200ml", price: 30000, stock: 35 }
      ]
    },
    { 
      id: "15", 
      name: "Jamu Kunyit Asam Nyonya Meneer", 
      price: 26000,
      all_variants: [
        { id: 1, name: "100ml", price: 26000, stock: 35 },
        { id: 2, name: "200ml", price: 48000, stock: 25 }
      ]
    },
    { 
      id: "16", 
      name: "Jamu Galian Singset Nyonya Meneer", 
      price: 27000,
      all_variants: [
        { id: 1, name: "100ml", price: 27000, stock: 20 },
        { id: 2, name: "200ml", price: 50000, stock: 10 }
      ]
    },
    { 
      id: "17", 
      name: "Jamu Temulawak Nyonya Meneer", 
      price: 28000,
      all_variants: [
        { id: 1, name: "100ml", price: 28000, stock: 30 },
        { id: 2, name: "200ml", price: 52000, stock: 20 }
      ]
    },
    { 
      id: "18", 
      name: "Jamu Kunyit Asam Sabdo Palon", 
      price: 19000,
      all_variants: [
        { id: 1, name: "100ml", price: 19000, stock: 25 },
        { id: 2, name: "200ml", price: 35000, stock: 15 }
      ]
    },
    { 
      id: "19", 
      name: "Jamu Galian Singset Sabdo Palon", 
      price: 20000,
      all_variants: [
        { id: 1, name: "100ml", price: 20000, stock: 40 },
        { id: 2, name: "200ml", price: 36000, stock: 30 }
      ]
    },
    { 
      id: "20", 
      name: "Jamu Temulawak Sabdo Palon", 
      price: 21000,
      all_variants: [
        { id: 1, name: "100ml", price: 21000, stock: 25 },
        { id: 2, name: "200ml", price: 38000, stock: 15 }
      ]
    }
  ];

  // Ganti handleInputChange dengan versi debounce - dinonaktifkan sementara
  const debouncedFetch = debounce(async (value: string) => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage("");
    try {
      // API call dinonaktifkan sementara karena server sedang down
      // const res = await axios.get(`/api/product/search?name=${encodeURIComponent(value)}`);
      // setProducts(Array.isArray(res.data?.data) ? res.data.data : []);
      
      // Menggunakan dummy data sementara
      const filteredProducts = dummyProducts.filter(product => 
        product.name.toLowerCase().includes(value.toLowerCase())
      );
      setProducts(filteredProducts);
    } catch (err: unknown) {
      setIsError(true);
      setErrorMessage(err instanceof Error ? err.message : "Gagal mengambil data produk.");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, 400);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setShowDropdown(value.length > 0);
    if (value.length > 0) {
      debouncedFetch(value);
    } else {
      setProducts([]);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return {
    search,
    setSearch,
    showDropdown,
    setShowDropdown,
    handleSelectProduct,
    searchRef,
    handleInputChange,
    handleSearch,
    products,
    isLoading,
    isError,
    errorMessage,
  };
};

export default useSearchLogic;
