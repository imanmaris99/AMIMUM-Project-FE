// Debug script untuk memverifikasi data productions
export function debugProductionData() {
  console.log('🔍 Debugging Production Data...');
  
  // Simulate the data structure
  const BRAND_DATA = {
    "1": {
      id: 1,
      name: "Air Mancur",
      photo_url: "/airmancur 1.svg",
      description_list: [
        "Brand jamu tradisional dengan kualitas terjamin",
        "Menggunakan bahan-bahan alami pilihan",
        "Proses produksi higienis dan modern"
      ],
      category: "Jamu",
      total_product: 15,
      total_product_with_promo: 7,
      promo_special: 20,
      created_at: "2024-01-01T00:00:00Z"
    },
    "2": {
      id: 2,
      name: "Aji Mujarab",
      photo_url: "/aji-mujarab 1.svg",
      description_list: [
        "Jamu herbal berkualitas tinggi dengan khasiat mujarab",
        "Resep tradisional yang sudah terbukti",
        "Diolah dengan standar farmasi"
      ],
      category: "Jamu",
      total_product: 15,
      total_product_with_promo: 6,
      promo_special: 15,
      created_at: "2024-01-01T00:00:00Z"
    }
  };
  
  const PRODUCTION_DATA = {
    status_code: 200,
    message: "Success",
    data: Object.values(BRAND_DATA).map(brand => ({
      id: brand.id,
      name: brand.name,
      photo_url: brand.photo_url,
      description_list: brand.description_list,
      category: brand.category,
      created_at: brand.created_at
    }))
  };
  
  console.log('PRODUCTION_DATA:', PRODUCTION_DATA);
  console.log('Data length:', PRODUCTION_DATA.data?.length || 0);
  
  // Test validation
  const validateProductionData = (production: any) => {
    return !!(
      production &&
      typeof production.id === 'number' &&
      typeof production.name === 'string' &&
      typeof production.photo_url === 'string' &&
      Array.isArray(production.description_list) &&
      typeof production.category === 'string' &&
      typeof production.created_at === 'string'
    );
  };
  
  const validProductions = PRODUCTION_DATA.data.filter(validateProductionData);
  const invalidProductions = PRODUCTION_DATA.data.filter(prod => !validateProductionData(prod));
  
  console.log('Validation results:');
  console.log('Valid productions:', validProductions.length);
  console.log('Invalid productions:', invalidProductions.length);
  
  if (invalidProductions.length > 0) {
    console.warn('Invalid productions:', invalidProductions);
  }
  
  return {
    total: PRODUCTION_DATA.data.length,
    valid: validProductions.length,
    invalid: invalidProductions.length,
    productions: validProductions
  };
}

// Export untuk digunakan di browser console
if (typeof window !== 'undefined') {
  (window as any).debugProductionData = debugProductionData;
}
