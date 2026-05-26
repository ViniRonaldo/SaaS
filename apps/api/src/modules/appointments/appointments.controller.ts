import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar agendamentos' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'patientId', required: false })
  @ApiQuery({ name: 'doctorId', required: false })
  @ApiQuery({ name: 'healthUnitId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'date', required: false })
  findAll(
    @Query('page') page?: number,
    @Query('perPage') perPage?: number,
    @Query('patientId') patientId?: string,
    @Query('doctorId') doctorId?: string,
    @Query('healthUnitId') healthUnitId?: string,
    @Query('status') status?: string,
    @Query('date') date?: string,
  ) {
    return this.appointmentsService.findAll({ page, perPage, patientId, doctorId, healthUnitId, status, date });
  }

  @Get('available-slots')
  @ApiOperation({ summary: 'Horários disponíveis' })
  @ApiQuery({ name: 'doctorId', required: true })
  @ApiQuery({ name: 'date', required: true })
  @ApiQuery({ name: 'healthUnitId', required: true })
  getAvailableSlots(
    @Query('doctorId') doctorId: string,
    @Query('date') date: string,
    @Query('healthUnitId') healthUnitId: string,
  ) {
    return this.appointmentsService.getAvailableSlots(doctorId, date, healthUnitId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes do agendamento' })
  findById(@Param('id') id: string) {
    return this.appointmentsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar agendamento' })
  create(@Body() data: any) {
    return this.appointmentsService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar agendamento' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.appointmentsService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancelar agendamento' })
  cancel(@Param('id') id: string) {
    return this.appointmentsService.cancel(id);
  }
}
