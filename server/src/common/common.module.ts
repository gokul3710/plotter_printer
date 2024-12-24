import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserGuard } from './guards/user.guard';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: 'your-secret-key',
            signOptions: { expiresIn: '1h' },
        }),
    ],
    providers: [JwtStrategy, UserGuard],
    exports: [JwtStrategy, JwtModule, UserGuard, PassportModule],
})
export class CommonModule {}
