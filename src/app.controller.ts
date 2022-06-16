import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { Cron } from '@nestjs/schedule';
import { UserService } from './modules/user/user.service';
import { FilesService } from './modules/files/files.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly filesService: FilesService,
  ) {}

  private readonly logger = new Logger(AppController.name);

  /*@Cron('45 * * * * *')
  handleCron() {
    this.logger.debug('========== Called when the current second is 45 ===========');
  }*/

  /*@Get('cache')
  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(CacheInterceptor)
  getUserInfo() {
    return this.userService.findAll();
  }*/
}
