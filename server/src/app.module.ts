import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobsModule } from './jobs/jobs.module';
import { AuthModule } from './auth/auth.module';
import { GatewayModule } from './gateway/gateway.module';
import { PrinterModule } from './printer/printer.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { JwtStrategy } from './common/strategy/jwt.strategy';
import { CommonModule } from './common/common.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    CommonModule,
    JobsModule,
    AuthModule,
    GatewayModule,
    PrinterModule,
    DatabaseModule,
    UserModule,
    CommonModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}