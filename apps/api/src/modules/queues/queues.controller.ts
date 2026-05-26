import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { QueuesService } from './queues.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('queues')
@Controller('queues')
export class QueuesController {
  constructor(private queuesService: QueuesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar filas' })
  @ApiQuery({ name: 'healthUnitId', required: false })
  findAll(@Query('healthUnitId') healthUnitId?: string) {
    return this.queuesService.findAll(healthUnitId);
  }

  @Get('display/:healthUnitId')
  @ApiOperation({ summary: 'Dados do painel TV' })
  getDisplayData(@Param('healthUnitId') healthUnitId: string) {
    return this.queuesService.getDisplayData(healthUnitId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes da fila' })
  findById(@Param('id') id: string) {
    return this.queuesService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'RECEPTIONIST')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar fila' })
  create(@Body() data: { name: string; healthUnitId: string; specialty?: string; prefix?: string }) {
    return this.queuesService.create(data);
  }

  @Post(':queueId/tickets')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar senha na fila' })
  createTicket(
    @Param('queueId') queueId: string,
    @Body() data: { patientId?: string; priority?: string },
  ) {
    return this.queuesService.createTicket(queueId, data.patientId, data.priority);
  }

  @Post(':queueId/call-next')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'RECEPTIONIST', 'DOCTOR', 'NURSE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chamar próximo da fila' })
  callNext(
    @Param('queueId') queueId: string,
    @Body() data: { counter?: string },
  ) {
    return this.queuesService.callNext(queueId, data.counter);
  }

  @Patch('tickets/:ticketId/start')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Iniciar atendimento' })
  startService(@Param('ticketId') ticketId: string) {
    return this.queuesService.startService(ticketId);
  }

  @Patch('tickets/:ticketId/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Finalizar atendimento' })
  completeService(@Param('ticketId') ticketId: string) {
    return this.queuesService.completeService(ticketId);
  }

  @Patch('tickets/:ticketId/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancelar senha' })
  cancelTicket(@Param('ticketId') ticketId: string) {
    return this.queuesService.cancelTicket(ticketId);
  }
}
