/**
 * BLOCK 50 — Playbook Card (Improved UI)
 * Shows recommended action and apply button with better UX
 */

import React, { useState } from 'react';
import { 
  Play, 
  AlertTriangle, 
  Shield, 
  RefreshCw, 
  Pause, 
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';
import { InfoTooltip, FRACTAL_TOOLTIPS } from './InfoTooltip';

const playbookConfig = {
  NO_ACTION: { 
    bg: 'bg-gray-50', 
    border: 'border-gray-200', 
    badge: 'bg-gray-100 text-gray-600',
    icon: CheckCircle,
    description: 'Система работает нормально, действия не требуются'
  },
  INVESTIGATION: { 
    bg: 'bg-blue-50', 
    border: 'border-blue-200', 
    badge: 'bg-blue-100 text-blue-700',
    icon: RefreshCw,
    description: 'Рекомендуется провести анализ текущей ситуации'
  },
  PROTECTION_ESCALATION: { 
    bg: 'bg-amber-50', 
    border: 'border-amber-300', 
    badge: 'bg-amber-100 text-amber-700',
    icon: Shield,
    description: 'Активация защитного режима для снижения риска'
  },
  RECALIBRATION: { 
    bg: 'bg-purple-50', 
    border: 'border-purple-200', 
    badge: 'bg-purple-100 text-purple-700',
    icon: RefreshCw,
    description: 'Требуется перекалибровка параметров системы'
  },
  RECOVERY: { 
    bg: 'bg-green-50', 
    border: 'border-green-200', 
    badge: 'bg-green-100 text-green-700',
    icon: Play,
    description: 'Возможно восстановление нормального режима работы'
  },
  FREEZE_ONLY: { 
    bg: 'bg-red-50', 
    border: 'border-red-300', 
    badge: 'bg-red-100 text-red-700',
    icon: Pause,
    description: 'Критическая ситуация — только удержание текущих позиций'
  },
};

const priorityConfig = {
  1: { label: 'CRITICAL', color: 'bg-red-100 text-red-700', description: 'Требует немедленного действия' },
  2: { label: 'HIGH', color: 'bg-orange-100 text-orange-700', description: 'Высокий приоритет' },
  3: { label: 'MEDIUM', color: 'bg-amber-100 text-amber-700', description: 'Средний приоритет' },
  4: { label: 'LOW', color: 'bg-blue-100 text-blue-700', description: 'Низкий приоритет' },
  5: { label: 'INFO', color: 'bg-gray-100 text-gray-600', description: 'Информационный' },
  6: { label: 'NONE', color: 'bg-gray-100 text-gray-500', description: 'Действия не требуются' },
};

export function PlaybookCard({ recommendation, onApply }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [applying, setApplying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  
  if (!recommendation) return null;
  
  const config = playbookConfig[recommendation.playbook] || playbookConfig.NO_ACTION;
  const priority = priorityConfig[recommendation.priority] || priorityConfig[6];
  const PlaybookIcon = config.icon;
  const canApply = recommendation.playbook !== 'NO_ACTION';
  
  const handleApply = async () => {
    if (recommendation.requiresConfirm && !showConfirm) {
      setShowConfirm(true);
      return;
    }
    
    setApplying(true);
    try {
      await onApply?.(recommendation.playbook);
    } finally {
      setApplying(false);
      setShowConfirm(false);
    }
  };
  
  return (
    <div 
      className={`rounded-2xl border-2 ${config.border} ${config.bg} p-6 transition-all duration-300 hover:shadow-lg`}
      data-testid="playbook-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Playbook</h3>
          <InfoTooltip {...FRACTAL_TOOLTIPS.playbook} placement="right" />
        </div>
        <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${priority.color}`}>
          P{recommendation.priority} — {priority.label}
        </div>
      </div>
      
      {/* Playbook Badge */}
      <div className="mb-5">
        <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-xl ${config.badge}`}>
          <PlaybookIcon className="w-6 h-6" />
          <span className="text-lg font-bold">{recommendation.playbook.replace(/_/g, ' ')}</span>
        </div>
        <p className="mt-3 text-sm text-gray-600">{config.description}</p>
      </div>
      
      {/* Reasons */}
      {recommendation.reasonCodes?.length > 0 && (
        <div className="mb-5">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide hover:text-gray-700 transition-colors"
          >
            Причины ({recommendation.reasonCodes.length})
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {expanded && (
            <ul className="mt-3 space-y-2">
              {recommendation.reasonCodes.map((reason, i) => (
                <li 
                  key={i} 
                  className="flex items-start gap-3 p-2.5 bg-white/60 rounded-xl"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{reason}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      
      {/* Suggested Actions */}
      {recommendation.suggestedActions?.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Рекомендуемые действия</p>
          <div className="space-y-2">
            {recommendation.suggestedActions.map((action, i) => (
              <div 
                key={i} 
                className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100"
              >
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                  {i + 1}
                </div>
                <span className="text-sm text-gray-700 font-mono">{action.action}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Apply Button */}
      {canApply && (
        <div className="mt-5 pt-5 border-t border-gray-200">
          {showConfirm ? (
            <div className="space-y-3">
              <div className="p-3 bg-amber-100 rounded-xl">
                <p className="text-sm text-amber-800 font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Вы уверены, что хотите применить этот playbook?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {applying ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Применение...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Подтвердить
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleApply}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              <Play className="w-5 h-5" />
              Применить рекомендацию
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default PlaybookCard;
