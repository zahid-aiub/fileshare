import { Controller, Logger } from '@nestjs/common';
import { FilesService } from './modules/files/files.service';
import { Cron } from '@nestjs/schedule';

@Controller()
export class AppController {
  constructor(private readonly filesService: FilesService) {}

  private readonly logger = new Logger(AppController.name);

  @Cron('0 01 0 * * *')
  async handleCron() {
    this.logger.debug(
      '========== Started working on everyday at 12:00 AM ===========',
    );
    await this.filesService.deleteInactiveFiles();
  }

  /*@Get('cache')
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(CacheInterceptor)
    getUserInfo() {
      return this.userService.findAll();
    }*/
}
