import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Phase {
  number: number;
  title: string;
  description: string;
  progress: number;
}

interface PhaseTrackerProps {
  projectId: string;
  clientId: string;
}

export default function PhaseTracker({ projectId, clientId }: PhaseTrackerProps) {
  const [phases, setPhases] = useState<Phase[]>([
    { number: 1, title: 'Foundation', description: 'Account setup and website launch', progress: 0 },
    { number: 2, title: 'Intelligence Gathering', description: 'Competitor and market analysis', progress: 0 },
    { number: 3, title: 'Build Your Advantage', description: 'Technical SEO and content creation', progress: 0 },
    { number: 4, title: 'Conversion Optimization', description: 'Trust signals and lead capture', progress: 0 },
    { number: 5, title: 'Growth Acceleration', description: 'Content marketing and expansion', progress: 0 },
    { number: 6, title: 'Domination', description: 'Performance monitoring and improvement', progress: 0 },
  ]);
  const [currentPhase, setCurrentPhase] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  async function loadProject() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) {
      console.error('Error loading project:', error);
      setLoading(false);
      return;
    }

    if (data) {
      setCurrentPhase(data.current_phase);
      setPhases([
        { ...phases[0], progress: data.phase_1_progress },
        { ...phases[1], progress: data.phase_2_progress },
        { ...phases[2], progress: data.phase_3_progress },
        { ...phases[3], progress: data.phase_4_progress },
        { ...phases[4], progress: data.phase_5_progress },
        { ...phases[5], progress: data.phase_6_progress },
      ]);
    }
    setLoading(false);
  }

  function getPhaseColor(phaseNumber: number) {
    if (phaseNumber < currentPhase) return 'bg-green-600';
    if (phaseNumber === currentPhase) return 'bg-blue-600';
    return 'bg-gray-300';
  }

  function getPhaseTextColor(phaseNumber: number) {
    if (phaseNumber < currentPhase) return 'text-green-600';
    if (phaseNumber === currentPhase) return 'text-blue-600';
    return 'text-gray-400';
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Progress</h2>
      <p className="text-gray-600 mb-8">6-Phase Local Domination Blueprint</p>

      <div className="relative">
        <div className="absolute top-0 left-8 h-full w-1 bg-gray-200"></div>

        <div className="space-y-8">
          {phases.map((phase) => (
            <div key={phase.number} className="relative flex items-start">
              <div
                className={`relative z-10 w-16 h-16 rounded-full ${getPhaseColor(phase.number)} flex items-center justify-center text-white font-bold text-xl shadow-lg`}
              >
                {phase.progress === 100 ? (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  phase.number
                )}
              </div>

              <div className="ml-6 flex-1">
                <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-xl font-bold ${getPhaseTextColor(phase.number)}`}>
                      Phase {phase.number}: {phase.title}
                    </h3>
                    <span className={`text-sm font-semibold ${getPhaseTextColor(phase.number)}`}>
                      {phase.progress}%
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{phase.description}</p>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${getPhaseColor(phase.number)} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${phase.progress}%` }}
                    ></div>
                  </div>

                  {phase.number === currentPhase && (
                    <div className="mt-4">
                      <a
                        href={`/projects/${projectId}/phase/${phase.number}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View Tasks
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Current Focus: Phase {currentPhase}</h4>
            <p className="text-sm text-gray-600">
              Complete all tasks in this phase before moving to the next. Each phase builds on the previous one.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
