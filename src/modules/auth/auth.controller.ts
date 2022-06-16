import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RolesEnum } from '../../core/enums/roles.enum';
import { Roles } from '../../common/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { EGrantType } from '../../core/enums/grantType.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private readonly logger = new Logger(AuthController.name);

  // @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() user: LoginDto) {
    if (!user?.grantType)
      throw new HttpException('Missing Grant Type', HttpStatus.BAD_REQUEST);

    /*if (user.password && user.grantType == EGrantType.Password) {
            return await this.authService.login(req);
        }*/
    /*if (!user.password && user.grantType == EGrantType.OtpEmail) {
      return await this.authService.sendEmailOtp(req.body);
    } else if (!user.password && user.grantType == EGrantType.OtpMobile) {
      return await this.authService.sendMobileOtp(req.body);
    } else if (!user.password && user.grantType == EGrantType.Social) {
      return await this.authService.sendSocialOtp(req.body);
    }*/

    return this.authService.login(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth('JWT')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Get('admin')
  getAdmin(@Request() req) {
    return req.user;
  }
}
