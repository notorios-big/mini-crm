import { useEffect, useState } from 'react';
import { Users, UserCheck, UserPlus, TrendingUp, Eye, CheckCircle } from 'lucide-react';
import { leadsAPI } from '../../services/api';
import type { DashboardStats } from '../../types';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await leadsAPI.getStats();
      setStats(data);
    } catch (error: any) {
      toast.error('Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 spinner"></div>
      </div>
    );
  }

  const statCards = [
    {
      name: 'Total Leads',
      value: stats?.total_leads || 0,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      name: 'Nuevos',
      value: stats?.new_leads || 0,
      icon: UserPlus,
      color: 'bg-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      name: 'Contactados',
      value: stats?.contacted_leads || 0,
      icon: UserCheck,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    {
      name: 'Clientes',
      value: stats?.clients || 0,
      icon: CheckCircle,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  const funnelStats = [
    {
      name: 'Paso 1 (Formulario)',
      value: stats?.step_1_completions || 0,
      percentage: 100,
    },
    {
      name: 'Paso 2 (Video)',
      value: stats?.step_2_completions || 0,
      percentage: stats?.total_leads
        ? Math.round(((stats?.step_2_completions || 0) / stats.total_leads) * 100)
        : 0,
    },
    {
      name: 'Paso 3 (Thank You)',
      value: stats?.step_3_completions || 0,
      percentage: stats?.total_leads
        ? Math.round(((stats?.step_3_completions || 0) / stats.total_leads) * 100)
        : 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Vista general de tu sistema CRM
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    {stat.name}
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Conversion Rate */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            Tasa de Conversión
          </h3>
          <span className="text-3xl font-bold text-primary-600">
            {stats?.conversion_rate || 0}%
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Leads convertidos a clientes
        </p>
      </div>

      {/* Funnel Stats */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-primary-600" />
          Embudo de Conversión
        </h3>
        <div className="space-y-4">
          {funnelStats.map((step, index) => (
            <div key={step.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700 dark:text-gray-300">{step.name}</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {step.value} ({step.percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    index === 0
                      ? 'bg-green-500'
                      : index === 1
                      ? 'bg-blue-500'
                      : 'bg-purple-500'
                  }`}
                  style={{ width: `${step.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Hoy</h4>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {stats?.leads_today || 0}
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">nuevos leads</p>
        </div>

        <div className="card">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Esta Semana</h4>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {stats?.leads_this_week || 0}
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">nuevos leads</p>
        </div>

        <div className="card">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Este Mes</h4>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {stats?.leads_this_month || 0}
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">nuevos leads</p>
        </div>
      </div>
    </div>
  );
}
