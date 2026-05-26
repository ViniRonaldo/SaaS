import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    page?: number;
    perPage?: number;
    patientId?: string;
    doctorId?: string;
    healthUnitId?: string;
    status?: string;
    date?: string;
  }) {
    const { page = 1, perPage = 20, patientId, doctorId, healthUnitId, status, date } = params;
    const where: Prisma.AppointmentWhereInput = {};

    if (patientId) where.patientId = patientId;
    if (doctorId) where.doctorId = doctorId;
    if (healthUnitId) where.healthUnitId = healthUnitId;
    if (status) where.status = status as any;
    if (date) {
      const d = new Date(date);
      where.date = { gte: d, lt: new Date(d.getTime() + 86400000) };
    }

    const [data, total] = await Promise.all([
      this.prisma.appointment.findMany({
        where,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { date: 'asc' },
        include: {
          patient: { include: { user: { select: { name: true, phone: true } } } },
          doctor: { select: { name: true } },
          healthUnit: { select: { name: true } },
        },
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) },
    };
  }

  async findById(id: string) {
    const appt = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: { include: { user: { select: { name: true, phone: true, email: true } } } },
        doctor: { select: { name: true } },
        healthUnit: { select: { name: true } },
      },
    });

    if (!appt) throw new NotFoundException('Agendamento não encontrado');
    return appt;
  }

  async create(data: Prisma.AppointmentUncheckedCreateInput) {
    const conflict = await this.prisma.appointment.findFirst({
      where: {
        doctorId: data.doctorId,
        date: data.date,
        startTime: data.startTime,
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
      },
    });

    if (conflict) throw new BadRequestException('Horário indisponível');

    return this.prisma.appointment.create({
      data,
      include: {
        patient: { include: { user: { select: { name: true } } } },
        doctor: { select: { name: true } },
      },
    });
  }

  async update(id: string, data: Prisma.AppointmentUpdateInput) {
    await this.findById(id);
    return this.prisma.appointment.update({ where: { id }, data });
  }

  async cancel(id: string) {
    return this.update(id, { status: 'CANCELLED' });
  }

  async getAvailableSlots(doctorId: string, date: string, healthUnitId: string) {
    const d = new Date(date);
    const booked = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        healthUnitId,
        date: { gte: d, lt: new Date(d.getTime() + 86400000) },
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
      },
      select: { startTime: true, endTime: true },
    });

    const allSlots = [];
    for (let h = 7; h < 17; h++) {
      for (const m of ['00', '30']) {
        const start = `${String(h).padStart(2, '0')}:${m}`;
        const endH = m === '30' ? h + 1 : h;
        const endM = m === '30' ? '00' : '30';
        const end = `${String(endH).padStart(2, '0')}:${endM}`;
        allSlots.push({ startTime: start, endTime: end });
      }
    }

    const bookedTimes = new Set(booked.map((b) => b.startTime));
    return allSlots.filter((s) => !bookedTimes.has(s.startTime));
  }
}
