// Quick fix untuk masalah productions tidak muncul
export function quickProductionFix() {
  console.log('🚀 Quick Production Fix...');
  
  // Test data structure yang benar
  const testProductions = [
    {
      id: 1,
      name: "Air Mancur",
      photo_url: "/airmancur 1.svg",
      description_list: [
        "Brand jamu tradisional dengan kualitas terjamin",
        "Menggunakan bahan-bahan alami pilihan",
        "Proses produksi higienis dan modern"
      ],
      category: "Jamu",
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 2,
      name: "Aji Mujarab",
      photo_url: "/aji-mujarab 1.svg",
      description_list: [
        "Jamu herbal berkualitas tinggi dengan khasiat mujarab",
        "Resep tradisional yang sudah terbukti",
        "Diolah dengan standar farmasi"
      ],
      category: "Jamu",
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 3,
      name: "Jamu Jago",
      photo_url: "/jamu_jago 1.svg",
      description_list: [
        "Jamu tradisional dengan kualitas jago",
        "Menggunakan teknologi modern",
        "Terpercaya sejak puluhan tahun"
      ],
      category: "Jamu",
      created_at: "2024-01-01T00:00:00Z"
    }
  ];
  
  console.log('Test productions:', testProductions);
  console.log('Number of test productions:', testProductions.length);
  
  // Test validation
  const validateProduction = (production: unknown) => {
    if (!production || typeof production !== 'object') return false;
    const prod = production as Record<string, unknown>;
    
    return !!(
      typeof prod.id === 'number' &&
      typeof prod.name === 'string' &&
      typeof prod.photo_url === 'string' &&
      Array.isArray(prod.description_list) &&
      typeof prod.category === 'string' &&
      typeof prod.created_at === 'string'
    );
  };
  
  const validCount = testProductions.filter(validateProduction).length;
  console.log('Valid productions:', validCount);
  
  return testProductions;
}

// Export untuk digunakan di browser console
if (typeof window !== 'undefined') {
  (window as any).quickProductionFix = quickProductionFix;
}
