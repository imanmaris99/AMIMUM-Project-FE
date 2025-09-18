// Test script untuk memverifikasi data productions
import { PRODUCTION_DATA } from '@/data/dummyData';
import { validateProductionData } from '@/utils/dataValidation';

export function testProductionData() {
  console.log('🧪 Testing Production Data...');
  
  console.log('Raw PRODUCTION_DATA:', PRODUCTION_DATA);
  
  const productions = PRODUCTION_DATA.data || [];
  console.log('Extracted productions:', productions);
  console.log('Number of productions:', productions.length);
  
  // Test each production
  productions.forEach((production, index) => {
    console.log(`Production ${index + 1}:`, production);
    const isValid = validateProductionData(production);
    console.log(`  Valid: ${isValid}`);
    
    if (!isValid) {
      console.warn(`  Invalid production at index ${index}:`, production);
    }
  });
  
  const validProductions = productions.filter(validateProductionData);
  const invalidProductions = productions.filter(prod => !validateProductionData(prod));
  
  console.log(`\nSummary:`);
  console.log(`Total productions: ${productions.length}`);
  console.log(`Valid productions: ${validProductions.length}`);
  console.log(`Invalid productions: ${invalidProductions.length}`);
  
  if (invalidProductions.length > 0) {
    console.warn('Invalid productions:', invalidProductions);
  }
  
  return {
    total: productions.length,
    valid: validProductions.length,
    invalid: invalidProductions.length,
    productions: validProductions
  };
}

// Export untuk digunakan di browser console
if (typeof window !== 'undefined') {
  (window as any).testProductionData = testProductionData;
}
