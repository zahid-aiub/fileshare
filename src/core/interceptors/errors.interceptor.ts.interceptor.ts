// import { CallHandler, CallHandler, ExecutionContext, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
// import { Observable } from 'rxjs';

// @Injectable()
// export class Errors.Interceptor.TsInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     return next.handle();
//   }
// }

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  BadGatewayException,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/common/response/api.response';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    //console.log("=========", next)
    return next
      .handle()
      .pipe(
      catchError(err => throwError(new BadRequestException)),
      //  map(data => {
      //   const http = context.switchToHttp();
      //   const res = http.getResponse();
        

      //   // if(data instanceof ApiResponse) {
      //   //   if(data.status !== undefined) {
      //   //     res.status(data.status);
      //   //   }
      //   // }

      // //  return new ApiResponse(200, null);

      //   //return classToPlain(data);
      // }),
      );
  }
}
