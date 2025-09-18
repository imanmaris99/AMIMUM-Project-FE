// Test untuk memverifikasi discount di halaman promo
import { generatePromoProducts } from '@/data/dummyData';

export function testPromoDiscount() {
  console.log('🧪 Testing promo discount consistency...');
  
  // Test semua brand
  const brandIds = ['1', '2', '3', '4', '6'];
  
  brandIds.forEach(brandId => {
    console.log(`\n📊 Testing Brand ID ${brandId}:`);
    
    const promoProducts = generatePromoProducts(brandId);
    
    if (promoProducts.length === 0) {
      console.log('  - No promo products found');
      return;
    }
    
    // Check if all products have brand_highest_discount
    const hasBrandDiscount = promoProducts.every(product => 
      product.brand_highest_discount !== undefined
    );
    
    console.log(`  - Products count: ${promoProducts.length}`);
    console.log(`  - All have brand_highest_discount: ${hasBrandDiscount}`);
    
    if (hasBrandDiscount) {
      // Check if all products show the same discount (brand's highest)
      const discounts = promoProducts.map(p => p.brand_highest_discount);
      const uniqueDiscounts = [...new Set(discounts)];
      
      console.log(`  - Brand highest discount: ${uniqueDiscounts[0]}%`);
      console.log(`  - All products show same discount: ${uniqueDiscounts.length === 1}`);
      
      // Show example product
      const exampleProduct = promoProducts[0];
      console.log(`  - Example product: ${exampleProduct.name}`);
      console.log(`  - Discount badge: -${exampleProduct.brand_highest_discount}%`);
      
      // Calculate example pricing
      const lowestPrice = Math.min(...exampleProduct.all_variants.map(v => v.discounted_price));
      const originalPrice = Math.round(lowestPrice / (1 - (exampleProduct.brand_highest_discount || 0) / 100));
      
      console.log(`  - Example pricing: ${originalPrice.toLocaleString('id-ID')} → ${lowestPrice.toLocaleString('id-ID')}`);
    }
  });
  
  console.log('\n✅ Promo discount test completed!');
}

// Run test if this file is executed directly
if (typeof window === 'undefined') {
  testPromoDiscount();
}
