import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

const PRIORITY_WEIGHTS: Record<string, number> = {
  NORMAL: 1,
  ELDERLY: 3,
  PREGNANT: 3,
  DISABLED: 3,
  EMERGENCY: 5,
};

@Injectable()
export class QueuesService {
  constructor(private prisma: PrismaService) {}

  async findAll(healthUnitId?: string) {
    const where = healthUnitId ? { healthUnitId } : {};
    return this.prisma.queue.findMany({
      where,
      include: {
        healthUnit: { select: { id: true, name: true } },
        _count: { select: { tickets: { where: { status: 'WAITING' } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const queue = await this.prisma.queue.findUnique({
      where: { id },
      include: {
        healthUnit: { select: { id: true, name: true } },
        tickets: {
          where: { status: { in: ['WAITING', 'CALLED', 'IN_PROGRESS'] } },
          orderBy: [{ priority: 'desc' }, { position: 'asc' }],
          include: {
            patient: {
              include: { user: { select: { name: true } } },
            },
          },
        },
      },
    });

    if (!queue) throw new NotFoundException('Fila não encontrada');
    return queue;
  }

  async create(data: { name: string; healthUnitId: string; specialty?: string; prefix?: string }) {
    return this.prisma.queue.create({ data });
  }

  async createTicket(queueId: string, patientId?: string, priority: string = 'NORMAL') {
    const queue = await this.prisma.queue.findUnique({ where: { id: queueId } });
    if (!queue) throw new NotFoundException('Fila não encontrada');
    if (!queue.isActive) throw new BadRequestException('Fila inativa');

    const nextNumber = queue.currentNumber + 1;
    const displayNumber = `${queue.prefix}${String(nextNumber).padStart(3, '0')}`;

    const waitingCount = await this.prisma.queueTicket.count({
      where: { queueId, status: 'WAITING' },
    });

    const [ticket] = await this.prisma.$transaction([
      this.prisma.queueTicket.create({
        data: {
          queueId,
          patientId: patientId || null,
          ticketNumber: String(nextNumber),
          displayNumber,
          priority: priority as any,
          position: waitingCount + 1,
          estimatedWaitMin: (waitingCount + 1) * 15,
        },
        include: {
          patient: { include: { user: { select: { name: true } } } },
        },
      }),
      this.prisma.queue.update({
        where: { id: queueId },
        data: { currentNumber: nextNumber },
      }),
    ]);

    return ticket;
  }

  async callNext(queueId: string, counter?: string) {
    const nextTicket = await this.prisma.queueTicket.findFirst({
      where: { queueId, status: 'WAITING' },
      orderBy: [
        { priority: 'desc' },
        { position: 'asc' },
      ],
      include: {
        patient: { include: { user: { select: { name: true, phone: true } } } },
      },
    });

    if (!nextTicket) throw new NotFoundException('Nenhum paciente na fila');

    const updated = await this.prisma.queueTicket.update({
      where: { id: nextTicket.id },
      data: {
        status: 'CALLED',
        calledAt: new Date(),
        counter: counter || null,
      },
      include: {
        patient: { include: { user: { select: { name: true } } } },
        queue: { select: { name: true } },
      },
    });

    await this.recalculatePositions(queueId);
    return updated;
  }

  async startService(ticketId: string) {
    return this.prisma.queueTicket.update({
      where: { id: ticketId },
      data: { status: 'IN_PROGRESS', startedAt: new Date() },
    });
  }

  async completeService(ticketId: string) {
    return this.prisma.queueTicket.update({
      where: { id: ticketId },
      data: { status: 'COMPLETED', completedAt: new Date() },
    });
  }

  async cancelTicket(ticketId: string) {
    const ticket = await this.prisma.queueTicket.update({
      where: { id: ticketId },
      data: { status: 'CANCELLED' },
    });
    await this.recalculatePositions(ticket.queueId);
    return ticket;
  }

  async getDisplayData(healthUnitId: string) {
    const queues = await this.prisma.queue.findMany({
      where: { healthUnitId, isActive: true },
      include: {
        tickets: {
          where: { status: { in: ['CALLED', 'IN_PROGRESS'] } },
          orderBy: { calledAt: 'desc' },
          take: 5,
          include: {
            patient: { include: { user: { select: { name: true } } } },
          },
        },
      },
    });

    const currentTickets = queues.flatMap((q) =>
      q.tickets.map((t) => ({ ...t, queueName: q.name })),
    );

    const nextTickets = await this.prisma.queueTicket.findMany({
      where: {
        queue: { healthUnitId, isActive: true },
        status: 'WAITING',
      },
      orderBy: [{ priority: 'desc' }, { position: 'asc' }],
      take: 10,
      include: {
        queue: { select: { name: true } },
      },
    });

    return { currentTickets, nextTickets };
  }

  private async recalculatePositions(queueId: string) {
    const waiting = await this.prisma.queueTicket.findMany({
      where: { queueId, status: 'WAITING' },
      orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
    });

    for (let i = 0; i < waiting.length; i++) {
      await this.prisma.queueTicket.update({
        where: { id: waiting[i].id },
        data: {
          position: i + 1,
          estimatedWaitMin: (i + 1) * 15,
        },
      });
    }
  }
}
