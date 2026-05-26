import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'PREFECTURE', 'RECEPTIONIST')
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Indicadores gerais' })
  @ApiQuery({ name: 'healthUnitId', required: false })
  getStats(@Query('healthUnitId') healthUnitId?: string) {
    return this.dashboardService.getStats(healthUnitId);
  }

  @Get('appointments-by-specialty')
  @ApiOperation({ summary: 'Consultas por especialidade' })
  @ApiQuery({ name: 'healthUnitId', required: false })
  getBySpecialty(@Query('healthUnitId') healthUnitId?: string) {
    return this.dashboardService.getAppointmentsBySpecialty(healthUnitId);
  }

  @Get('hourly-distribution')
  @ApiOperation({ summary: 'Distribuição por hora' })
  @ApiQuery({ name: 'healthUnitId', required: false })
  getHourly(@Query('healthUnitId') healthUnitId?: string) {
    return this.dashboardService.getHourlyDistribution(healthUnitId);
  }
}
