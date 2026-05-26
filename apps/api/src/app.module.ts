import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './shared/prisma/prisma.module';
import { RedisModule } from './shared/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PatientsModule } from './modules/patients/patients.module';
import { QueuesModule } from './modules/queues/queues.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { HealthUnitsModule } from './modules/health-units/health-units.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    RedisModule,
    AuthModule,
    UsersModule,
    PatientsModule,
    QueuesModule,
    AppointmentsModule,
    HealthUnitsModule,
    NotificationsModule,
    DashboardModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
