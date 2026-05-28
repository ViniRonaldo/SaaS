import { api } from '@/lib/api';

interface ApiDashboardStats {
  totalPatients: number;
  todayAppointments: number;
  waitingInQueue: number;
  avgWaitTimeMinutes: number;
  attendanceRate: number;
}

export interface DashboardStats {
  todayPatients: number;
  avgWaitTime: number;
  scheduledAppointments: number;
  activeQueues: number;
  attendanceRate: number;
  appointmentsBySpecialty: Array<{ specialty: string; count: number }>;
  hourlyDistribution: Array<{ hour: string; count: number }>;
}

export const dashboardService = {
  async getStats(healthUnitId?: string): Promise<DashboardStats> {
    const query = healthUnitId ? `?healthUnitId=${encodeURIComponent(healthUnitId)}` : '';
    const [stats, appointmentsBySpecialty, hourlyDistribution] = await Promise.all([
      api.get<ApiDashboardStats>(`/dashboard/stats${query}`),
      api.get<DashboardStats['appointmentsBySpecialty']>(`/dashboard/appointments-by-specialty${query}`),
      api.get<DashboardStats['hourlyDistribution']>(`/dashboard/hourly-distribution${query}`),
    ]);

    return {
      todayPatients: stats.totalPatients,
      avgWaitTime: stats.avgWaitTimeMinutes,
      scheduledAppointments: stats.todayAppointments,
      activeQueues: stats.waitingInQueue,
      attendanceRate: stats.attendanceRate,
      appointmentsBySpecialty,
      hourlyDistribution,
    };
  },
};
