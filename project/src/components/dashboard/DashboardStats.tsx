import React from 'react';
import { Card } from '../ui/Card';
import { Pill, CheckCircle, TrendingUp, Calendar } from 'lucide-react';
import { DashboardStats as Stats } from '../../hooks/useMedications';

interface DashboardStatsProps {
  stats: Stats;
  loading: boolean;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      label: 'Total Medications',
      value: stats.totalMedications,
      icon: Pill,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Taken Today',
      value: stats.takenToday,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Adherence Rate',
      value: `${stats.adherenceRate}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Current Streak',
      value: `${stats.streak} days`,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${item.bgColor}`}>
              <item.icon className={`h-6 w-6 ${item.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{item.label}</p>
              <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};