import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: { page?: number; perPage?: number; search?: string }) {
    const { page = 1, perPage = 20, search } = params;
    const where: Prisma.PatientWhereInput = {};

    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { cpf: { contains: search } } },
        { cns: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.patient.findMany({
        where,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true, cpf: true, phone: true, avatar: true } },
        },
      }),
      this.prisma.patient.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) },
    };
  }

  async findById(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, cpf: true, phone: true, avatar: true } },
        medicalRecords: { orderBy: { date: 'desc' }, take: 10 },
        queueTickets: { orderBy: { createdAt: 'desc' }, take: 5 },
        appointments: { orderBy: { date: 'desc' }, take: 10 },
      },
    });

    if (!patient) throw new NotFoundException('Paciente não encontrado');
    return patient;
  }

  async findByUserId(userId: string) {
    return this.prisma.patient.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, name: true, email: true, cpf: true, phone: true } },
      },
    });
  }

  async create(userId: string, data: Prisma.PatientCreateWithoutUserInput) {
    return this.prisma.patient.create({
      data: { ...data, user: { connect: { id: userId } } },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  async update(id: string, data: Prisma.PatientUpdateInput) {
    await this.findById(id);
    return this.prisma.patient.update({ where: { id }, data });
  }
}
