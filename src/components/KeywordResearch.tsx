import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface KeywordResearchProps {
  clientId: string;
  agencyId: string;
  serviceType: string;
  location: string;
}

export default function KeywordResearch({ clientId, agencyId, serviceType, location }: KeywordResearchProps) {
  const [keywords, setKeywords] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);
  const [filter, setFilter] = useState('all');

  const generateKeywords = () => {
    setGenerating(true);

    const baseKeywords = [
      `${serviceType} ${location}`,
      `${serviceType} near me`,
      `best ${serviceType} ${location}`,
      `affordable ${serviceType} ${location}`,
      `emergency ${serviceType} ${location}`,
      `24/7 ${serviceType} ${location}`,
      `${serviceType} services ${location}`,
      `local ${serviceType} ${location}`,
      `${serviceType} company ${location}`,
      `${serviceType} contractor ${location}`,
      `residential ${serviceType} ${location}`,
      `commercial ${serviceType} ${location}`,
      `${serviceType} repair ${location}`,
      `${serviceType} installation ${location}`,
      `${serviceType} maintenance ${location}`,
      `cheap ${serviceType} ${location}`,
      `professional ${serviceType} ${location}`,
      `licensed ${serviceType} ${location}`,
      `experienced ${serviceType} ${location}`,
      `${serviceType} specialists ${location}`,
    ];

    const generatedKeywords = baseKeywords.map((keyword, index) => ({
      keyword,
      difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
      commercial_intent: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      keyword_type: index % 5 === 0 ? 'emergency' : index % 3 === 0 ? 'location' : 'service',
      priority: Math.floor(Math.random() * 10) + 1,
      search_volume: Math.floor(Math.random() * 1000) + 100,
    }));

    setTimeout(async () => {
      try {
        const keywordsWithIds = generatedKeywords.map(kw => ({
          ...kw,
          client_id: clientId,
          agency_id: agencyId,
        }));

        const { data, error } = await supabase
          .from('keywords')
          .insert(keywordsWithIds)
          .select();

        if (error) throw error;

        setKeywords(data || []);
        setGenerating(false);
      } catch (err: any) {
        console.error('Error saving keywords:', err);
        setGenerating(false);
      }
    }, 2000);
  };

  const filteredKeywords = keywords.filter(kw => {
    if (filter === 'all') return true;
    if (filter === 'high-priority') return kw.priority >= 7;
    if (filter === 'easy') return kw.difficulty === 'easy';
    if (filter === 'high-intent') return kw.commercial_intent === 'high';
    return true;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Keyword Research</h2>
          <p className="text-gray-600 mt-1">Generate and track ranking keywords</p>
        </div>
        {keywords.length === 0 && (
          <button
            onClick={generateKeywords}
            disabled={generating}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
          >
            {generating ? 'Generating...' : 'Generate Keywords'}
          </button>
        )}
      </div>

      {keywords.length > 0 && (
        <>
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({keywords.length})
            </button>
            <button
              onClick={() => setFilter('high-priority')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'high-priority' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              High Priority
            </button>
            <button
              onClick={() => setFilter('easy')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'easy' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Easy Wins
            </button>
            <button
              onClick={() => setFilter('high-intent')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'high-intent' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              High Intent
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Keyword</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Volume</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Difficulty</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Intent</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Priority</th>
                </tr>
              </thead>
              <tbody>
                {filteredKeywords.map((kw) => (
                  <tr key={kw.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{kw.keyword}</td>
                    <td className="py-3 px-4 text-gray-600">{kw.search_volume?.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(kw.difficulty)}`}>
                        {kw.difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getIntentColor(kw.commercial_intent)}`}>
                        {kw.commercial_intent}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 capitalize">{kw.keyword_type}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${kw.priority * 10}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{kw.priority}/10</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Tip:</strong> Start with high-priority, easy-difficulty keywords with high commercial intent
              for the quickest wins. Target emergency and location-based keywords for local service businesses.
            </p>
          </div>
        </>
      )}

      {keywords.length === 0 && !generating && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <p className="text-gray-500 mb-4">Generate keyword opportunities for this client</p>
        </div>
      )}

      {generating && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating keywords based on service type and location...</p>
        </div>
      )}
    </div>
  );
}
