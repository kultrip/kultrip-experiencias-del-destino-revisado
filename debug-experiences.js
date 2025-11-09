// Debug script to check Supabase connection and experiences data
// Run with: node debug-experiences.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://znyobiyzwkexzmjvixnu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpueW9iaXl6d2tleHptanZpeG51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMzcyOTcsImV4cCI6MjA3NjcxMzI5N30.dPoY7kw_xy5vMWfMggQwjfPWJnEBqmBUBwO2NRSBPl4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test basic connection
    const { data: authData, error: authError } = await supabase.auth.getUser();
    console.log('✅ Supabase connection successful');
    
    // Check if experiences table exists and get count
    const { count, error: countError } = await supabase
      .from('experiences')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.log('❌ Error accessing experiences table:', countError.message);
      return;
    }
    
    console.log(`📊 Total experiences in database: ${count}`);
    
    // Get first few experiences to see the data structure
    const { data: experiences, error: dataError } = await supabase
      .from('experiences')
      .select('*')
      .limit(3);
    
    if (dataError) {
      console.log('❌ Error fetching experiences:', dataError.message);
      return;
    }
    
    console.log('🔍 Sample experiences:');
    experiences?.forEach((exp, index) => {
      console.log(`${index + 1}. ${exp.title} (Category: ${exp.category}, Status: ${exp.status})`);
    });
    
    // Check categories distribution
    const { data: categories, error: catError } = await supabase
      .from('experiences')
      .select('category')
      .eq('status', 'active');
    
    if (!catError && categories) {
      const categoryCount = {};
      categories.forEach(exp => {
        categoryCount[exp.category] = (categoryCount[exp.category] || 0) + 1;
      });
      
      console.log('\n📋 Category distribution:');
      Object.entries(categoryCount).forEach(([cat, count]) => {
        console.log(`  ${cat}: ${count} experiences`);
      });
    }
    
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
  }
}

testConnection().then(() => {
  process.exit(0);
});