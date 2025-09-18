// Test untuk memverifikasi variasi discount berdasarkan brand
import { generateCardProductData } from '@/data/dummyData';

export function testDiscountVariation() {
  console.log('🧪 Testing discount variation by brand...');
  
  const products = generateCardProductData();
  
  // Group products by brand
  const productsByBrand: { [key: number]: any[] } = {};
  
  products.forEach(product => {
    const brandId = product.brand_info.id;
    if (!productsByBrand[brandId]) {
      productsByBrand[brandId] = [];
    }
    productsByBrand[brandId].push(product);
  });
  
  // Analyze discount ranges for each brand
  Object.keys(productsByBrand).forEach(brandIdStr => {
    const brandId = parseInt(brandIdStr);
    const brandProducts = productsByBrand[brandId];
    
    console.log(`\n📊 Brand ID ${brandId} (${brandProducts[0]?.brand_info.name}):`);
    
    const allDiscounts: number[] = [];
    brandProducts.forEach(product => {
      product.all_variants.forEach(variant => {
        if (variant.discount > 0) {
          allDiscounts.push(variant.discount);
        }
      });
    });
    
    if (allDiscounts.length > 0) {
      const minDiscount = Math.min(...allDiscounts);
      const maxDiscount = Math.max(...allDiscounts);
      const avgDiscount = allDiscounts.reduce((sum, d) => sum + d, 0) / allDiscounts.length;
      
      console.log(`  - Discount range: ${minDiscount}% - ${maxDiscount}%`);
      console.log(`  - Average discount: ${avgDiscount.toFixed(1)}%`);
      console.log(`  - Total variants with discount: ${allDiscounts.length}`);
      
      // Show some example discounts
      const uniqueDiscounts = [...new Set(allDiscounts)].sort((a, b) => b - a);
      console.log(`  - Example discounts: ${uniqueDiscounts.slice(0, 5).join('%, ')}%`);
    } else {
      console.log('  - No discounts found');
    }
  });
  
  console.log('\n✅ Discount variation test completed!');
}

// Run test if this file is executed directly
if (typeof window === 'undefined') {
  testDiscountVariation();
}
