// Test script untuk memverifikasi data flow consistency
import { generateCardProductData, generateDetailProductData } from '@/data/dummyData';
import { validateProductData, validateDetailProductData } from '@/utils/dataValidation';

export function testDataFlow() {
  console.log('🧪 Testing Data Flow Consistency...');
  
  // Test 1: Card Product Data Generation
  console.log('\n1. Testing Card Product Data Generation...');
  try {
    const cardProducts = generateCardProductData();
    console.log(`✅ Generated ${cardProducts.length} card products`);
    
    // Validate each product
    const validProducts = cardProducts.filter(validateProductData);
    const invalidProducts = cardProducts.filter(p => !validateProductData(p));
    
    console.log(`✅ Valid products: ${validProducts.length}`);
    if (invalidProducts.length > 0) {
      console.warn(`⚠️ Invalid products: ${invalidProducts.length}`);
      console.warn('Invalid products:', invalidProducts);
    }
  } catch (error) {
    console.error('❌ Error generating card products:', error);
  }
  
  // Test 2: Detail Product Data Generation
  console.log('\n2. Testing Detail Product Data Generation...');
  try {
    const detailProducts = generateDetailProductData();
    const productIds = Object.keys(detailProducts);
    console.log(`✅ Generated ${productIds.length} detail products`);
    
    // Validate each detail product
    let validDetails = 0;
    let invalidDetails = 0;
    
    productIds.forEach(id => {
      const product = detailProducts[id];
      if (validateDetailProductData(product)) {
        validDetails++;
      } else {
        invalidDetails++;
        console.warn(`⚠️ Invalid detail product: ${id}`);
      }
    });
    
    console.log(`✅ Valid detail products: ${validDetails}`);
    if (invalidDetails > 0) {
      console.warn(`⚠️ Invalid detail products: ${invalidDetails}`);
    }
  } catch (error) {
    console.error('❌ Error generating detail products:', error);
  }
  
  // Test 3: Data Consistency Between Card and Detail
  console.log('\n3. Testing Data Consistency Between Card and Detail...');
  try {
    const cardProducts = generateCardProductData();
    const detailProducts = generateDetailProductData();
    
    let consistentCount = 0;
    let inconsistentCount = 0;
    
    cardProducts.forEach(cardProduct => {
      const detailProduct = detailProducts[cardProduct.id];
      if (detailProduct) {
        // Check if basic info matches
        if (cardProduct.name === detailProduct.name && 
            cardProduct.price === detailProduct.price) {
          consistentCount++;
        } else {
          inconsistentCount++;
          console.warn(`⚠️ Inconsistent data for product ${cardProduct.id}:`);
          console.warn(`  Card: ${cardProduct.name} - ${cardProduct.price}`);
          console.warn(`  Detail: ${detailProduct.name} - ${detailProduct.price}`);
        }
      } else {
        console.warn(`⚠️ No detail product found for card product ${cardProduct.id}`);
        inconsistentCount++;
      }
    });
    
    console.log(`✅ Consistent products: ${consistentCount}`);
    if (inconsistentCount > 0) {
      console.warn(`⚠️ Inconsistent products: ${inconsistentCount}`);
    }
  } catch (error) {
    console.error('❌ Error testing data consistency:', error);
  }
  
  // Test 4: Variant Data Consistency
  console.log('\n4. Testing Variant Data Consistency...');
  try {
    const cardProducts = generateCardProductData();
    let validVariants = 0;
    let invalidVariants = 0;
    
    cardProducts.forEach(product => {
      product.all_variants.forEach(variant => {
        if (variant.id && variant.variant && variant.img && 
            typeof variant.discount === 'number' && 
            typeof variant.discounted_price === 'number') {
          validVariants++;
        } else {
          invalidVariants++;
          console.warn(`⚠️ Invalid variant for product ${product.id}:`, variant);
        }
      });
    });
    
    console.log(`✅ Valid variants: ${validVariants}`);
    if (invalidVariants > 0) {
      console.warn(`⚠️ Invalid variants: ${invalidVariants}`);
    }
  } catch (error) {
    console.error('❌ Error testing variant consistency:', error);
  }
  
  console.log('\n🎉 Data Flow Testing Complete!');
}

// Export untuk digunakan di browser console
if (typeof window !== 'undefined') {
  (window as any).testDataFlow = testDataFlow;
}
