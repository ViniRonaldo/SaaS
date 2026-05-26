import { Controller, Get, Post, Patch, Param, Query, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('patients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('patients')
export class PatientsController {
  constructor(private patientsService: PatientsService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'RECEPTIONIST', 'DOCTOR', 'NURSE', 'PREFECTURE')
  @ApiOperation({ summary: 'Listar pacientes' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAll(
    @Query('page') page?: number,
    @Query('perPage') perPage?: number,
    @Query('search') search?: string,
  ) {
    return this.patientsService.findAll({ page, perPage, search });
  }

  @Get('me')
  @ApiOperation({ summary: 'Meu perfil de paciente' })
  findMe(@Req() req: any) {
    return this.patientsService.findByUserId(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar paciente por ID' })
  findById(@Param('id') id: string) {
    return this.patientsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar perfil de paciente' })
  create(@Req() req: any, @Body() data: any) {
    return this.patientsService.create(req.user.sub, data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar paciente' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.patientsService.update(id, data);
  }
}
