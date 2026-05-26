import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(healthUnitId?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const unitFilter = healthUnitId ? { healthUnitId } : {};

    const [
      totalPatients,
      todayAppointments,
      completedToday,
      cancelledToday,
      noShowToday,
      waitingInQueue,
      avgWaitTime,
    ] = await Promise.all([
      this.prisma.patient.count(),
      this.prisma.appointment.count({
        where: { ...unitFilter, date: { gte: today, lt: tomorrow } },
      }),
      this.prisma.appointment.count({
        where: { ...unitFilter, date: { gte: today, lt: tomorrow }, status: 'COMPLETED' },
      }),
      this.prisma.appointment.count({
        where: { ...unitFilter, date: { gte: today, lt: tomorrow }, status: 'CANCELLED' },
      }),
      this.prisma.appointment.count({
        where: { ...unitFilter, date: { gte: today, lt: tomorrow }, status: 'NO_SHOW' },
      }),
      this.prisma.queueTicket.count({
        where: {
          queue: unitFilter,
          status: 'WAITING',
          createdAt: { gte: today },
        },
      }),
      this.prisma.queueTicket.aggregate({
        where: {
          queue: unitFilter,
          status: 'COMPLETED',
          createdAt: { gte: today },
          completedAt: { not: null },
        },
        _avg: { estimatedWaitMin: true },
      }),
    ]);

    return {
      totalPatients,
      todayAppointments,
      completedToday,
      cancelledToday,
      noShowToday,
      waitingInQueue,
      avgWaitTimeMinutes: Math.round(avgWaitTime._avg.estimatedWaitMin || 0),
      attendanceRate: todayAppointments > 0
        ? Math.round((completedToday / todayAppointments) * 100)
        : 0,
    };
  }

  async getAppointmentsBySpecialty(healthUnitId?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const unitFilter = healthUnitId ? { healthUnitId } : {};

    const data = await this.prisma.appointment.groupBy({
      by: ['specialty'],
      where: { ...unitFilter, date: { gte: today } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    return data.map((d) => ({ specialty: d.specialty, count: d._count.id }));
  }

  async getHourlyDistribution(healthUnitId?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const unitFilter = healthUnitId ? { healthUnitId } : {};

    const tickets = await this.prisma.queueTicket.findMany({
      where: { queue: unitFilter, createdAt: { gte: today, lt: tomorrow } },
      select: { createdAt: true },
    });

    const hourly: Record<number, number> = {};
    for (let h = 6; h <= 18; h++) hourly[h] = 0;
    tickets.forEach((t) => {
      const h = t.createdAt.getHours();
      if (hourly[h] !== undefined) hourly[h]++;
    });

    return Object.entries(hourly).map(([hour, count]) => ({
      hour: `${hour}:00`,
      count,
    }));
  }
}
