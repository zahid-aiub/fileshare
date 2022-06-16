import { ApiResponse } from '../response/api.response';
import { HttpStatus } from '@nestjs/common';

export class Utils {
  /**
   * Provides ApiResponse object
   *
   * @param responseObj response object
   * @param successMsg success message
   * @param failedMsg failed message
   */
  public static getApiResponse(
    responseObj: any,
    successMsg,
    failedMsg,
  ): ApiResponse {
    return responseObj
      ? new ApiResponse(HttpStatus.OK, successMsg, responseObj)
      : new ApiResponse(HttpStatus.NOT_FOUND, failedMsg);
  }

  public static getResponse(msg: string, status: HttpStatus, resObj?: any) {
    return resObj
      ? new ApiResponse(status, msg, resObj)
      : new ApiResponse(status, msg);
  }
}
