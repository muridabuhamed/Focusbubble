import React, { useState } from 'react';
import { 
  Clock, 
  Brain, 
  Zap, 
  BookOpen, 
  Timer, 
  ChevronRight,
  Settings,
  Info
} from 'lucide-react';
import { SessionType, SessionTemplate, SessionConfig } from '../types';

interface Props {
  onSelectSession: (config: SessionConfig) => void;
  onBack: () => void;
  defaultDuration?: number;
}

// Pre-defined session templates
const sessionTemplates: SessionTemplate[] = [
  {
    id: 'standard',
    name: 'Standard Focus',
    description: 'Traditional focus session with customizable duration',
    icon: 'Clock',
    type: SessionType.STANDARD,
    config: {
      duration: 25,
      allowBreaks: true,
      breakInterval: 30
    },
    color: 'bg-blue-500'
  },
  {
    id: 'pomodoro',
    name: 'Pomodoro Timer',
    description: '25min focus + 5min break cycles. Long break every 4 cycles',
    icon: 'Timer',
    type: SessionType.POMODORO,
    config: {
      duration: 25,
      shortBreak: 5,
      longBreak: 15,
      cycles: 4
    },
    color: 'bg-red-500'
  },
  {
    id: 'deep-work',
    name: 'Deep Work',
    description: 'Extended focus sessions (1-4 hours) with smart break suggestions',
    icon: 'Brain',
    type: SessionType.DEEP_WORK,
    config: {
      duration: 90,
      allowBreaks: true,
      breakInterval: 45,
      shortBreak: 10
    },
    color: 'bg-purple-500'
  },
  {
    id: 'quick-sprint',
    name: 'Quick Sprint',
    description: 'Short burst of focused work (5-15 minutes)',
    icon: 'Zap',
    type: SessionType.QUICK_SPRINT,
    config: {
      duration: 10,
      allowBreaks: false
    },
    color: 'bg-orange-500'
  },
  {
    id: 'study',
    name: 'Study Session',
    description: 'Structured study time with subject tracking',
    icon: 'BookOpen',
    type: SessionType.STUDY,
    config: {
      duration: 50,
      shortBreak: 10,
      allowBreaks: true,
      breakInterval: 25
    },
    color: 'bg-green-500'
  }
];

const getIcon = (iconName: string, className: string) => {
  switch (iconName) {
    case 'Clock': return <Clock className={className} />;
    case 'Timer': return <Timer className={className} />;
    case 'Brain': return <Brain className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'BookOpen': return <BookOpen className={className} />;
    default: return <Clock className={className} />;
  }
};

export const SessionTypeSelector: React.FC<Props> = ({ 
  onSelectSession, 
  onBack, 
  defaultDuration = 25 
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<SessionTemplate | null>(null);
  const [customDuration, setCustomDuration] = useState(defaultDuration);
  const [studySubject, setStudySubject] = useState('');
  const [sessionGoal, setSessionGoal] = useState('');

  const handleSelectTemplate = (template: SessionTemplate) => {
    setSelectedTemplate(template);
    setCustomDuration(template.config.duration);
  };

  const handleStartSession = () => {
    if (!selectedTemplate) return;

    const config: SessionConfig = {
      ...selectedTemplate.config,
      type: selectedTemplate.type,
      duration: customDuration,
      subject: studySubject || undefined,
      goal: sessionGoal || undefined
    };

    onSelectSession(config);
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <div className="px-6 pt-10 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Choose Session Type
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Pick the perfect focus method for your task
          </p>
        </div>
        
        <button 
          onClick={onBack}
          className="p-2 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300 rotate-180" />
        </button>
      </div>

      {/* Session Type Cards */}
      <div className="flex-1 px-6 pb-6 space-y-4">
        {sessionTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => handleSelectTemplate(template)}
            className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
              selectedTemplate?.id === template.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-gray-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${template.color} text-white`}>
                {getIcon(template.icon, 'w-6 h-6')}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {template.name}
                  </h3>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                      {template.config.duration}min
                    </span>
                    {selectedTemplate?.id === template.id && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {template.description}
                </p>

                {/* Session Details */}
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {template.config.shortBreak && (
                    <span>Break: {template.config.shortBreak}min</span>
                  )}
                  {template.config.cycles && (
                    <span>Cycles: {template.config.cycles}</span>
                  )}
                  {template.config.breakInterval && (
                    <span>Break every {template.config.breakInterval}min</span>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Configuration Panel */}
      {selectedTemplate && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700">
          <div className="space-y-4">
            {/* Duration Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration: {customDuration} minutes
              </label>
              <input
                type="range"
                min={selectedTemplate.type === SessionType.QUICK_SPRINT ? 5 : 10}
                max={selectedTemplate.type === SessionType.DEEP_WORK ? 240 : 120}
                value={customDuration}
                onChange={(e) => setCustomDuration(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Study Subject (for Study sessions) */}
            {selectedTemplate.type === SessionType.STUDY && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject (optional)
                </label>
                <input
                  type="text"
                  value={studySubject}
                  onChange={(e) => setStudySubject(e.target.value)}
                  placeholder="e.g., Mathematics, History, Programming"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Session Goal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Session Goal (optional)
              </label>
              <input
                type="text"
                value={sessionGoal}
                onChange={(e) => setSessionGoal(e.target.value)}
                placeholder="What do you want to accomplish?"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartSession}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              Start {selectedTemplate.name}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};