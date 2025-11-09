// Simple debug component to test experience loading
import { useEffect, useState } from 'react';
import { getExperiences, getExperiencesByCategory, getExperiencesByState } from '../services/experienceService';
import { Experience } from '../components/ExperienceCard';

export default function ExperienceDebug() {
  const [allExperiences, setAllExperiences] = useState<Experience[]>([]);
  const [galiciaExperiences, setGaliciaExperiences] = useState<Experience[]>([]);
  const [sunsetExperiences, setSunsetExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const testAllQueries = async () => {
      try {
        setLoading(true);
        setErrors([]);

        // Test getting all experiences
        try {
          console.log('🔍 Testing getExperiences()...');
          const all = await getExperiences();
          console.log('✅ All experiences:', all.length, all);
          setAllExperiences(all);
        } catch (error) {
          console.error('❌ Error getting all experiences:', error);
          setErrors(prev => [...prev, `All experiences: ${error instanceof Error ? error.message : JSON.stringify(error)}`]);
        }

        // Test getting experiences by category
        try {
          console.log('🔍 Testing getExperiencesByCategory("sunset")...');
          const sunset = await getExperiencesByCategory('sunset');
          console.log('✅ Sunset experiences:', sunset.length, sunset);
          setSunsetExperiences(sunset);
        } catch (error) {
          console.error('❌ Error getting sunset experiences:', error);
          setErrors(prev => [...prev, `Sunset experiences: ${error instanceof Error ? error.message : JSON.stringify(error)}`]);
        }

        // Test getting experiences by state (this might fail if columns don't exist)
        try {
          console.log('🔍 Testing getExperiencesByState("Galicia")...');
          const galicia = await getExperiencesByState('Galicia');
          console.log('✅ Galicia experiences:', galicia.length, galicia);
          setGaliciaExperiences(galicia);
        } catch (error) {
          console.error('❌ Error getting Galicia experiences:', error);
          setErrors(prev => [...prev, `Galicia experiences: ${error instanceof Error ? error.message : JSON.stringify(error)}`]);
        }

      } catch (error) {
        console.error('❌ General error:', error);
        setErrors(prev => [...prev, `General error: ${error instanceof Error ? error.message : JSON.stringify(error)}`]);
      } finally {
        setLoading(false);
      }
    };

    testAllQueries();
  }, []);

  if (loading) {
    return (
      <div className="p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h2 className="text-xl font-bold mb-4">🔍 Testing Experience Queries...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-blue-50 border border-blue-200 rounded-lg">
      <h2 className="text-xl font-bold mb-4">🔍 Experience Query Debug Results</h2>
      
      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-bold text-red-800 mb-2">❌ Errors:</h3>
          {errors.map((error, index) => (
            <p key={index} className="text-red-700 text-sm">{error}</p>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded border">
          <h3 className="font-bold mb-2">📋 All Experiences</h3>
          <p className="text-lg">Count: <span className="font-bold">{allExperiences.length}</span></p>
          {allExperiences.slice(0, 3).map(exp => (
            <p key={exp.id} className="text-sm text-gray-600 mt-1">• {exp.title}</p>
          ))}
        </div>

        <div className="p-4 bg-white rounded border">
          <h3 className="font-bold mb-2">🌅 Sunset Category</h3>
          <p className="text-lg">Count: <span className="font-bold">{sunsetExperiences.length}</span></p>
          {sunsetExperiences.slice(0, 3).map(exp => (
            <p key={exp.id} className="text-sm text-gray-600 mt-1">• {exp.title}</p>
          ))}
        </div>

        <div className="p-4 bg-white rounded border">
          <h3 className="font-bold mb-2">📍 Galicia State</h3>
          <p className="text-lg">Count: <span className="font-bold">{galiciaExperiences.length}</span></p>
          {galiciaExperiences.slice(0, 3).map(exp => (
            <p key={exp.id} className="text-sm text-gray-600 mt-1">• {exp.title}</p>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded border text-sm">
        <p><strong>Instructions:</strong> Check browser console for detailed logs. If "All Experiences" shows 0, there might be a Supabase connection issue. If "Galicia State" shows an error, run the geography SQL script first.</p>
      </div>
    </div>
  );
}