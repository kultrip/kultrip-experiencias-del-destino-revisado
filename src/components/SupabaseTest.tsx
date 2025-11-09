// Simple Supabase connection test
import { supabase } from '../lib/supabase';

export default function SupabaseTest() {
  const testConnection = async () => {
    try {
      console.log('🔍 Testing basic Supabase connection...');
      
      // Test 1: Check if supabase client exists
      console.log('Supabase client:', supabase);
      console.log('Supabase client type:', typeof supabase);
      
      // Test 2: Try a simple query to see table structure
      console.log('🔍 Testing experiences table access...');
      const { data, error, count } = await supabase
        .from('experiences')
        .select('id, title, category, status', { count: 'exact' })
        .eq('status', 'active')
        .limit(5);
      
      console.log('Raw Supabase response:', { data, error, count });
      
      if (error) {
        console.error('❌ Supabase error:', error);
        return { success: false, error: error.message, data: null, count: 0 };
      }
      
      console.log('✅ Supabase query successful!');
      console.log('Sample data:', data);
      console.log('Total count:', count);
      
      return { success: true, error: null, data, count };
      
    } catch (err) {
      console.error('❌ Connection test failed:', err);
      return { success: false, error: String(err), data: null, count: 0 };
    }
  };

  const handleTest = async () => {
    const result = await testConnection();
    alert(JSON.stringify(result, null, 2));
  };

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <h3 className="font-bold mb-2">🧪 Supabase Connection Test</h3>
      <button 
        onClick={handleTest}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Test Supabase Connection
      </button>
      <p className="text-sm text-gray-600 mt-2">
        Click to test the connection. Results will show in console and alert.
      </p>
    </div>
  );
}