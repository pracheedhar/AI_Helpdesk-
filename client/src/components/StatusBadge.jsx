import React from 'react';
import { Circle, Clock, CheckCircle, XCircle } from 'lucide-react';

const STATUS_CONFIG = {
  open: {
    label: 'Open',
    className: 'badge-open',
    Icon: Circle,
  },
  'in-progress': {
    label: 'In Progress',
    className: 'badge-in-progress',
    Icon: Clock,
  },
  resolved: {
    label: 'Resolved',
    className: 'badge-resolved',
    Icon: CheckCircle,
  },
  closed: {
    label: 'Closed',
    className: 'badge-closed',
    Icon: XCircle,
  },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['open'];
  const { label, className, Icon } = config;

  return (
    <span className={`badge ${className}`}>
      <Icon size={11} />
      {label}
    </span>
  );
}
