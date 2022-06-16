import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { MulterModule } from '@nestjs/platform-express';
import { FilesModule } from './modules/files/files.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot(),

    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),

    ScheduleModule.forRoot(),
    CacheModule.register({
      ttl: 1, // cache for second
      max: 10,
      isCacheableValue: () => false,

      /*
                  store: redisStore,
                  host: 'localhost',
                  port: 6379,
                  */
    }),

    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './uploads',
      }),
    }),

    FilesModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    AppService,
  ],
})
export class AppModule {}
