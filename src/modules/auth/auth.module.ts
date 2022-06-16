import { HttpModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from '../../common/utils/constrains';
import { LocalStrategy } from '../../common/strategies/local.strategy';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '86400s' },
    }),
    UserModule,
    PassportModule,
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
