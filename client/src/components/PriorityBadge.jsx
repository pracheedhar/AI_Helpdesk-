import React from 'react';
import { ArrowDown, ArrowRight, ArrowUp, Zap } from 'lucide-react';

const PRIORITY_CONFIG = {
  low: {
    label: 'Low',
    className: 'badge-low',
    Icon: ArrowDown,
  },
  medium: {
    label: 'Medium',
    className: 'badge-medium',
    Icon: ArrowRight,
  },
  high: {
    label: 'High',
    className: 'badge-high',
    Icon: ArrowUp,
  },
  critical: {
    label: 'Critical',
    className: 'badge-critical',
    Icon: Zap,
  },
};

export default function PriorityBadge({ priority }) {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG['medium'];
  const { label, className, Icon } = config;

  return (
    <span className={`badge ${className}`}>
      <Icon size={11} />
      {label}
    </span>
  );
}
