// Test untuk memverifikasi konsistensi data di halaman detail produk
import { generateDetailProductData, generateCardProductData } from '@/data/dummyData';
import { getDetailProduct } from '@/data/dataUtils';

export function testDetailProductConsistency() {
  console.log('🧪 Testing detail product data consistency...');
  
  const detailProducts = generateDetailProductData();
  const cardProducts = generateCardProductData();
  
  console.log(`\n📊 Data Overview:`);
  console.log(`- Detail products: ${Object.keys(detailProducts).length}`);
  console.log(`- Card products: ${cardProducts.length}`);
  
  // Test beberapa produk
  const testProductIds = Object.keys(detailProducts).slice(0, 3);
  
  testProductIds.forEach(productId => {
    console.log(`\n🔍 Testing Product ID: ${productId}`);
    
    const detailProduct = detailProducts[productId];
    const cardProduct = cardProducts.find(p => p.id === productId);
    
    if (!detailProduct || !cardProduct) {
      console.log('  ❌ Product not found in one of the datasets');
      return;
    }
    
    // Test basic info consistency
    console.log(`  📝 Basic Info:`);
    console.log(`    - Name: ${detailProduct.name} (detail) vs ${cardProduct.name} (card)`);
    console.log(`    - Company: ${detailProduct.company} vs ${cardProduct.brand_info.name}`);
    console.log(`    - Price: ${detailProduct.price} vs ${cardProduct.price}`);
    
    // Test variants consistency
    console.log(`  🎯 Variants Info:`);
    console.log(`    - Detail variants: ${detailProduct.variants_list?.length || 0}`);
    console.log(`    - Card variants: ${cardProduct.all_variants?.length || 0}`);
    
    if (detailProduct.variants_list && cardProduct.all_variants) {
      const detailVariants = detailProduct.variants_list;
      const cardVariants = cardProduct.all_variants;
      
      if (detailVariants.length === cardVariants.length) {
        console.log(`    ✅ Variant count matches`);
        
        // Test first variant consistency
        const firstDetailVariant = detailVariants[0];
        const firstCardVariant = cardVariants[0];
        
        console.log(`    - First variant name: ${firstDetailVariant.variant} vs ${firstCardVariant.variant}`);
        console.log(`    - First variant discount: ${firstDetailVariant.discount}% vs ${firstCardVariant.discount}%`);
        console.log(`    - First variant price: ${firstDetailVariant.discounted_price} vs ${firstCardVariant.discounted_price}`);
        
        // Test discount consistency
        const detailDiscounts = detailVariants.map(v => v.discount).filter(d => d > 0);
        const cardDiscounts = cardVariants.map(v => v.discount).filter(d => d > 0);
        
        console.log(`    - Discounts in detail: [${detailDiscounts.join(', ')}]`);
        console.log(`    - Discounts in card: [${cardDiscounts.join(', ')}]`);
        
        // Test rating consistency
        console.log(`  ⭐ Rating Info:`);
        console.log(`    - Avg rating: ${detailProduct.avg_rating} (detail) vs ${cardProduct.avg_rating || 'N/A'} (card)`);
        console.log(`    - Total raters: ${detailProduct.total_rater} (detail) vs ${cardProduct.total_rater || 'N/A'} (card)`);
        
        // Test price calculation consistency
        console.log(`  💰 Price Calculation Test:`);
        const testVariant = firstDetailVariant;
        if (testVariant.discount > 0) {
          const calculatedOriginalPrice = Math.round(testVariant.discounted_price / (1 - testVariant.discount / 100));
          console.log(`    - Variant: ${testVariant.variant}`);
          console.log(`    - Discount: ${testVariant.discount}%`);
          console.log(`    - Discounted price: ${testVariant.discounted_price}`);
          console.log(`    - Calculated original price: ${calculatedOriginalPrice}`);
          
          // Verify calculation
          const expectedDiscountedPrice = Math.round(calculatedOriginalPrice * (1 - testVariant.discount / 100));
          console.log(`    - Expected discounted price: ${expectedDiscountedPrice}`);
          console.log(`    - Calculation correct: ${expectedDiscountedPrice === testVariant.discounted_price ? '✅' : '❌'}`);
        }
      } else {
        console.log(`    ❌ Variant count mismatch`);
      }
    }
    
    // Test data access through getDetailProduct
    const accessedProduct = getDetailProduct(productId);
    console.log(`  🔗 Data Access Test:`);
    console.log(`    - getDetailProduct returns data: ${accessedProduct ? '✅' : '❌'}`);
    if (accessedProduct) {
      console.log(`    - Accessed product name: ${accessedProduct.name}`);
      console.log(`    - Accessed product variants: ${accessedProduct.variants_list?.length || 0}`);
    }
  });
  
  console.log('\n✅ Detail product consistency test completed!');
}

// Run test if this file is executed directly
if (typeof window === 'undefined') {
  testDetailProductConsistency();
}
