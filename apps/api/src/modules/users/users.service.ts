import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const userSelect = {
  id: true,
  name: true,
  email: true,
  cpf: true,
  phone: true,
  role: true,
  avatar: true,
  isActive: true,
  healthUnitId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: { page?: number; perPage?: number; search?: string; role?: string }) {
    const { page = 1, perPage = 20, search, role } = params;
    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { cpf: { contains: search } },
      ];
    }

    if (role) {
      where.role = role as any;
    }

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: 'desc' },
        select: userSelect,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) },
    };
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });

    if (!user) throw new NotFoundException('Usuario nao encontrado');
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: CreateUserDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { cpf: data.cpf }] },
    });

    if (existingUser) {
      throw new ConflictException('Email ou CPF ja cadastrado');
    }

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: await bcrypt.hash(data.password, 12),
        cpf: data.cpf,
        phone: data.phone,
        role: data.role,
        healthUnitId: data.healthUnitId || null,
        isActive: data.isActive ?? true,
      },
      select: userSelect,
    });
  }

  async update(id: string, data: UpdateUserDto) {
    await this.findById(id);

    if (data.email || data.cpf) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          id: { not: id },
          OR: [
            ...(data.email ? [{ email: data.email }] : []),
            ...(data.cpf ? [{ cpf: data.cpf }] : []),
          ],
        },
      });

      if (existingUser) {
        throw new ConflictException('Email ou CPF ja cadastrado');
      }
    }

    const updateData: Prisma.UserUpdateInput = {
      name: data.name,
      email: data.email,
      cpf: data.cpf,
      phone: data.phone,
      role: data.role,
      avatar: data.avatar,
      isActive: data.isActive,
    };

    if (data.healthUnitId !== undefined) {
      updateData.healthUnit = data.healthUnitId
        ? { connect: { id: data.healthUnitId } }
        : { disconnect: true };
    }

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 12);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: userSelect,
    });
  }

  async deactivate(id: string) {
    await this.findById(id);
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: userSelect,
    });
  }

  async activate(id: string) {
    await this.findById(id);
    return this.prisma.user.update({
      where: { id },
      data: { isActive: true },
      select: userSelect,
    });
  }
}
