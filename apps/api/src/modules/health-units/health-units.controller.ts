import { Controller, Get, Post, Patch, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { HealthUnitsService } from './health-units.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('health-units')
@Controller('health-units')
export class HealthUnitsController {
  constructor(private healthUnitsService: HealthUnitsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar unidades de saúde' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'type', required: false })
  findAll(
    @Query('page') page?: number,
    @Query('perPage') perPage?: number,
    @Query('search') search?: string,
    @Query('type') type?: string,
  ) {
    return this.healthUnitsService.findAll({ page, perPage, search, type });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes da unidade' })
  findById(@Param('id') id: string) {
    return this.healthUnitsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'PREFECTURE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar unidade de saúde' })
  create(@Body() data: any) {
    return this.healthUnitsService.create(data);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'PREFECTURE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar unidade' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.healthUnitsService.update(id, data);
  }
}
