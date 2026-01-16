
import React from 'react';
import { ShieldCheck, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

interface Props {
  level: 'safe' | 'caution' | 'dangerous' | 'unknown';
  label?: string;
}

const SafetyBadge: React.FC<Props> = ({ level, label }) => {
  const config = {
    safe: {
      color: 'bg-green-100 text-green-700 border-green-200',
      icon: <ShieldCheck className="w-4 h-4" />,
      text: 'Safe'
    },
    caution: {
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      icon: <AlertTriangle className="w-4 h-4" />,
      text: 'Caution'
    },
    dangerous: {
      color: 'bg-red-100 text-red-700 border-red-200',
      icon: <XCircle className="w-4 h-4" />,
      text: 'Dangerous'
    },
    unknown: {
      color: 'bg-gray-100 text-gray-700 border-gray-200',
      icon: <HelpCircle className="w-4 h-4" />,
      text: 'Unknown'
    }
  };

  const active = config[level] || config.unknown;

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-medium ${active.color}`}>
      {active.icon}
      <span>{label || active.text}</span>
    </div>
  );
};

export default SafetyBadge;
