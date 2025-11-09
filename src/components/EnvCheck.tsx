// Environment check component
export default function EnvCheck() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
      <h3 className="font-bold mb-2">🔧 Environment Check</h3>
      <div className="text-sm">
        <p><strong>VITE_SUPABASE_URL:</strong> {supabaseUrl ? '✅ Set' : '❌ Missing'}</p>
        <p><strong>VITE_SUPABASE_ANON_KEY:</strong> {supabaseKey ? '✅ Set' : '❌ Missing'}</p>
        {supabaseUrl && (
          <p className="mt-2"><strong>URL:</strong> {supabaseUrl.substring(0, 30)}...</p>
        )}
      </div>
    </div>
  );
}