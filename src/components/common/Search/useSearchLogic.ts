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
  // Data ini konsisten dengan data di detail product page dan struktur BE
  const dummyProducts = [
    { 
      id: "1", 
      name: "Jamu Beras Kencur Air Mancur", 
      price: 15000,
      all_variants: [
        { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 15000, updated_at: "2024-01-01T00:00:00Z" },
        { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 28000, updated_at: "2024-01-01T00:00:00Z" }
      ],
      created_at: "2024-01-01T00:00:00Z"
    },
    { 
      id: "2", 
      name: "Jamu Kunyit Asam Air Mancur", 
      price: 18000,
      all_variants: [
        { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 18000, updated_at: "2024-01-01T00:00:00Z" },
        { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 32000, updated_at: "2024-01-01T00:00:00Z" }
      ],
      created_at: "2024-01-01T00:00:00Z"
    },
    { 
      id: "3", 
      name: "Jamu Galian Singset Aji Mujarab", 
      price: 12000,
      all_variants: [
        { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 12000, updated_at: "2024-01-01T00:00:00Z" },
        { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 22000, updated_at: "2024-01-01T00:00:00Z" }
      ],
      created_at: "2024-01-01T00:00:00Z"
    },
    { 
      id: "4", 
      name: "Jamu Beras Kencur Jamu Jago", 
      price: 14000,
      all_variants: [
        { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 14000, updated_at: "2024-01-01T00:00:00Z" },
        { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 26000, updated_at: "2024-01-01T00:00:00Z" }
      ],
      created_at: "2024-01-01T00:00:00Z"
    },
    { 
      id: "5", 
      name: "Jamu Beras Kencur Nyonya Meneer", 
      price: 25000,
      all_variants: [
        { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 25000, updated_at: "2024-01-01T00:00:00Z" },
        { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 45000, updated_at: "2024-01-01T00:00:00Z" }
      ],
      created_at: "2024-01-01T00:00:00Z"
    },
    { 
      id: "6", 
      name: "Jamu Beras Kencur Sabdo Palon", 
      price: 18000,
      all_variants: [
        { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 18000, updated_at: "2024-01-01T00:00:00Z" },
        { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 32000, updated_at: "2024-01-01T00:00:00Z" }
      ],
      created_at: "2024-01-01T00:00:00Z"
    },
    { 
      id: "7", 
      name: "Jamu Beras Kencur Sido Muncul", 
      price: 16000,
      all_variants: [
        { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 16000, updated_at: "2024-01-01T00:00:00Z" },
        { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 28000, updated_at: "2024-01-01T00:00:00Z" }
      ],
      created_at: "2024-01-01T00:00:00Z"
    },
    { 
      id: "8", 
      name: "Jamu Kunyit Asam Sido Muncul", 
      price: 17000,
      all_variants: [
        { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 17000, updated_at: "2024-01-01T00:00:00Z" },
        { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 30000, updated_at: "2024-01-01T00:00:00Z" }
      ],
      created_at: "2024-01-01T00:00:00Z"
    },
    { 
      id: "9", 
      name: "Jamu Galian Singset Sido Muncul", 
      price: 19000,
      all_variants: [
        { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 19000, updated_at: "2024-01-01T00:00:00Z" },
        { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 35000, updated_at: "2024-01-01T00:00:00Z" }
      ],
      created_at: "2024-01-01T00:00:00Z"
    },
    { 
      id: "10", 
      name: "Jamu Temulawak Sido Muncul", 
      price: 20000,
      all_variants: [
        { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 20000, updated_at: "2024-01-01T00:00:00Z" },
        { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 36000, updated_at: "2024-01-01T00:00:00Z" }
      ],
      created_at: "2024-01-01T00:00:00Z"
    },
    { 
      id: "11", 
      name: "Jamu Beras Kencur Aji Mujarab", 
      price: 13000,
      all_variants: [
        { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 13000, updated_at: "2024-01-01T00:00:00Z" },
        { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 24000, updated_at: "2024-01-01T00:00:00Z" }
      ],
      created_at: "2024-01-01T00:00:00Z"
    },
    { 
      id: "12", 
      name: "Jamu Kunyit Asam Jamu Jago", 
      price: 15000,
      all_variants: [
        { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 15000, updated_at: "2024-01-01T00:00:00Z" },
        { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 27000, updated_at: "2024-01-01T00:00:00Z" }
      ],
      created_at: "2024-01-01T00:00:00Z"
    },
    { 
      id: "13", 
      name: "Jamu Galian Singset Jamu Jago", 
      price: 16000,
      all_variants: [
        { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 16000, updated_at: "2024-01-01T00:00:00Z" },
        { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 28000, updated_at: "2024-01-01T00:00:00Z" }
      ],
      created_at: "2024-01-01T00:00:00Z"
    },
    { 
      id: "14", 
      name: "Jamu Temulawak Jamu Jago", 
      price: 17000,
      all_variants: [
        { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 17000, updated_at: "2024-01-01T00:00:00Z" },
        { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 30000, updated_at: "2024-01-01T00:00:00Z" }
      ],
      created_at: "2024-01-01T00:00:00Z"
    },
    { 
      id: "15", 
      name: "Jamu Kunyit Asam Nyonya Meneer", 
      price: 26000,
      all_variants: [
        { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 26000, updated_at: "2024-01-01T00:00:00Z" },
        { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 48000, updated_at: "2024-01-01T00:00:00Z" }
      ],
      created_at: "2024-01-01T00:00:00Z"
    },
    { 
      id: "16", 
      name: "Jamu Galian Singset Nyonya Meneer", 
      price: 27000,
      all_variants: [
        { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 27000, updated_at: "2024-01-01T00:00:00Z" },
        { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 50000, updated_at: "2024-01-01T00:00:00Z" }
      ],
      created_at: "2024-01-01T00:00:00Z"
    },
    { 
      id: "17", 
      name: "Jamu Temulawak Nyonya Meneer", 
      price: 28000,
      all_variants: [
        { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 28000, updated_at: "2024-01-01T00:00:00Z" },
        { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 52000, updated_at: "2024-01-01T00:00:00Z" }
      ],
      created_at: "2024-01-01T00:00:00Z"
    },
    { 
      id: "18", 
      name: "Jamu Kunyit Asam Sabdo Palon", 
      price: 19000,
      all_variants: [
        { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 19000, updated_at: "2024-01-01T00:00:00Z" },
        { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 35000, updated_at: "2024-01-01T00:00:00Z" }
      ],
      created_at: "2024-01-01T00:00:00Z"
    },
    { 
      id: "19", 
      name: "Jamu Galian Singset Sabdo Palon", 
      price: 20000,
      all_variants: [
        { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 20000, updated_at: "2024-01-01T00:00:00Z" },
        { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 36000, updated_at: "2024-01-01T00:00:00Z" }
      ],
      created_at: "2024-01-01T00:00:00Z"
    },
    { 
      id: "20", 
      name: "Jamu Temulawak Sabdo Palon", 
      price: 21000,
      all_variants: [
        { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 21000, updated_at: "2024-01-01T00:00:00Z" },
        { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 38000, updated_at: "2024-01-01T00:00:00Z" }
      ],
      created_at: "2024-01-01T00:00:00Z"
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
