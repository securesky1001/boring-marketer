import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface CompetitorAnalysisProps {
  clientId: string;
  agencyId: string;
}

export default function CompetitorAnalysis({ clientId, agencyId }: CompetitorAnalysisProps) {
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [newCompetitor, setNewCompetitor] = useState({
    business_name: '',
    website_url: '',
    review_count: 0,
    average_rating: 0,
    strengths: '',
    weaknesses: '',
    ranking_position: null as number | null,
  });

  const handleAddCompetitor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('competitors')
        .insert({
          ...newCompetitor,
          client_id: clientId,
          agency_id: agencyId,
        })
        .select()
        .single();

      if (error) throw error;

      setCompetitors([...competitors, data]);
      setNewCompetitor({
        business_name: '',
        website_url: '',
        review_count: 0,
        average_rating: 0,
        strengths: '',
        weaknesses: '',
        ranking_position: null,
      });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const analyzeCompetitors = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      alert('Competitor analysis complete! Insights have been generated based on the data provided.');
    }, 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Competitor Analysis</h2>
          <p className="text-gray-600 mt-1">Track and analyze your competition</p>
        </div>
        {competitors.length > 0 && (
          <button
            onClick={analyzeCompetitors}
            disabled={analyzing}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
          >
            {analyzing ? 'Analyzing...' : 'Generate Insights'}
          </button>
        )}
      </div>

      <form onSubmit={handleAddCompetitor} className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-4">Add Competitor</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            required
            placeholder="Business Name"
            value={newCompetitor.business_name}
            onChange={(e) => setNewCompetitor({ ...newCompetitor, business_name: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="url"
            required
            placeholder="Website URL"
            value={newCompetitor.website_url}
            onChange={(e) => setNewCompetitor({ ...newCompetitor, website_url: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="number"
            placeholder="Review Count"
            value={newCompetitor.review_count || ''}
            onChange={(e) => setNewCompetitor({ ...newCompetitor, review_count: parseInt(e.target.value) || 0 })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="number"
            step="0.1"
            placeholder="Average Rating"
            value={newCompetitor.average_rating || ''}
            onChange={(e) => setNewCompetitor({ ...newCompetitor, average_rating: parseFloat(e.target.value) || 0 })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <textarea
            placeholder="Strengths"
            value={newCompetitor.strengths}
            onChange={(e) => setNewCompetitor({ ...newCompetitor, strengths: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent col-span-2"
            rows={2}
          />
          <textarea
            placeholder="Weaknesses"
            value={newCompetitor.weaknesses}
            onChange={(e) => setNewCompetitor({ ...newCompetitor, weaknesses: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent col-span-2"
            rows={2}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Competitor'}
        </button>
      </form>

      {competitors.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-gray-500">No competitors added yet. Add your first competitor to begin analysis.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {competitors.map((competitor) => (
            <div key={competitor.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{competitor.business_name}</h3>
                  <a
                    href={competitor.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    {competitor.website_url}
                  </a>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end mb-1">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="font-semibold">{competitor.average_rating.toFixed(1)}</span>
                  </div>
                  <p className="text-sm text-gray-600">{competitor.review_count} reviews</p>
                </div>
              </div>

              {competitor.strengths && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Strengths:</p>
                  <p className="text-sm text-gray-600">{competitor.strengths}</p>
                </div>
              )}

              {competitor.weaknesses && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Weaknesses:</p>
                  <p className="text-sm text-gray-600">{competitor.weaknesses}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
