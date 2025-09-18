// Test untuk memverifikasi konsistensi discount antara halaman promo dan detail produk
import { generatePromoProducts, generateDetailProductData } from '@/data/dummyData';

export function testPromoDetailConsistency() {
  console.log('🧪 Testing promo-detail discount consistency...');
  
  // Test brand Nyonya Meneer (ID 4) yang memiliki promo_special 30%
  const brandId = '4';
  const promoProducts = generatePromoProducts(brandId);
  const detailProducts = generateDetailProductData();
  
  console.log(`\n📊 Testing Brand ID ${brandId} (Nyonya Meneer):`);
  console.log(`- Promo products: ${promoProducts.length}`);
  
  if (promoProducts.length === 0) {
    console.log('  ❌ No promo products found');
    return;
  }
  
  // Test first promo product
  const promoProduct = promoProducts[0];
  console.log(`\n🔍 Testing Product: ${promoProduct.name}`);
  console.log(`- Brand highest discount: ${promoProduct.brand_highest_discount}%`);
  
  // Get corresponding detail product
  const detailProduct = detailProducts[promoProduct.id];
  if (!detailProduct) {
    console.log('  ❌ Detail product not found');
    return;
  }
  
  console.log(`- Detail product variants: ${detailProduct.variants_list?.length || 0}`);
  
  if (detailProduct.variants_list) {
    const variants = detailProduct.variants_list;
    const discounts = variants.map(v => v.discount).filter(d => d > 0);
    const maxDiscount = Math.max(...discounts);
    
    console.log(`- Max discount in variants: ${maxDiscount}%`);
    console.log(`- All discounts: [${discounts.join(', ')}]`);
    
    // Check if any variant has the brand's highest discount
    const hasBrandHighestDiscount = variants.some(v => v.discount === promoProduct.brand_highest_discount);
    console.log(`- Has brand highest discount (${promoProduct.brand_highest_discount}%): ${hasBrandHighestDiscount ? '✅' : '❌'}`);
    
    if (hasBrandHighestDiscount) {
      const variantWithMaxDiscount = variants.find(v => v.discount === promoProduct.brand_highest_discount);
      console.log(`- Variant with max discount: ${variantWithMaxDiscount?.variant}`);
      console.log(`- Price: ${variantWithMaxDiscount?.discounted_price} (${variantWithMaxDiscount?.discount}% off)`);
    }
    
    // Test price calculation consistency
    console.log(`\n💰 Price Calculation Test:`);
    const testVariant = variants[0];
    if (testVariant.discount > 0) {
      const calculatedOriginalPrice = Math.round(testVariant.discounted_price / (1 - testVariant.discount / 100));
      console.log(`- Test variant: ${testVariant.variant}`);
      console.log(`- Discount: ${testVariant.discount}%`);
      console.log(`- Discounted price: ${testVariant.discounted_price}`);
      console.log(`- Calculated original price: ${calculatedOriginalPrice}`);
      
      // Verify calculation
      const expectedDiscountedPrice = Math.round(calculatedOriginalPrice * (1 - testVariant.discount / 100));
      console.log(`- Expected discounted price: ${expectedDiscountedPrice}`);
      console.log(`- Calculation correct: ${expectedDiscountedPrice === testVariant.discounted_price ? '✅' : '❌'}`);
    }
  }
  
  // Test all promo products
  console.log(`\n📋 Testing all promo products:`);
  promoProducts.forEach((product, index) => {
    const detailProduct = detailProducts[product.id];
    if (detailProduct?.variants_list) {
      const maxVariantDiscount = Math.max(...detailProduct.variants_list.map(v => v.discount));
      const hasBrandDiscount = detailProduct.variants_list.some(v => v.discount === product.brand_highest_discount);
      
      console.log(`  ${index + 1}. ${product.name}:`);
      console.log(`     - Brand discount: ${product.brand_highest_discount}%`);
      console.log(`     - Max variant discount: ${maxVariantDiscount}%`);
      console.log(`     - Has brand discount: ${hasBrandDiscount ? '✅' : '❌'}`);
    }
  });
  
  console.log('\n✅ Promo-detail consistency test completed!');
}

// Run test if this file is executed directly
if (typeof window === 'undefined') {
  testPromoDetailConsistency();
}
