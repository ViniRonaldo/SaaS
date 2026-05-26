import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class HealthUnitsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: { page?: number; perPage?: number; search?: string; type?: string }) {
    const { page = 1, perPage = 20, search, type } = params;
    const where: Prisma.HealthUnitWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { cnes: { contains: search } },
      ];
    }
    if (type) where.type = type as any;

    const [data, total] = await Promise.all([
      this.prisma.healthUnit.findMany({
        where,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { users: true, queues: true } },
          operatingHours: true,
        },
      }),
      this.prisma.healthUnit.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) },
    };
  }

  async findById(id: string) {
    const unit = await this.prisma.healthUnit.findUnique({
      where: { id },
      include: {
        operatingHours: true,
        queues: { where: { isActive: true } },
        users: { select: { id: true, name: true, role: true } },
      },
    });
    if (!unit) throw new NotFoundException('Unidade de saúde não encontrada');
    return unit;
  }

  async create(data: Prisma.HealthUnitCreateInput) {
    return this.prisma.healthUnit.create({ data });
  }

  async update(id: string, data: Prisma.HealthUnitUpdateInput) {
    await this.findById(id);
    return this.prisma.healthUnit.update({ where: { id }, data });
  }
}
