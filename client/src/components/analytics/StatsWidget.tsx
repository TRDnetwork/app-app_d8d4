import React from 'react';

interface StatsWidgetProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
}

export const StatsWidget: React.FC<StatsWidgetProps> = ({ 
  title, 
  value, 
  change, 
  icon,
  trend 
}) => {
  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text_dim text-sm">{title}</p>
          <p className="text-2xl font-bold text-text mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 flex items-center ${
              trend === 'up' ? 'text-success' : 'text-warning'
            }`}>
              {trend === 'up' ? '↑' : '↓'} {change}
            </p>
          )}
        </div>
        <div className="text-accent">
          {icon}
        </div>
      </div>
    </div>
  );
};