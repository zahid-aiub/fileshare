import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Exception class for not finding entities.
 *
 * @author Md. Shahariar Hossen
 * @since December 9, 2021
 */
export class NotFoundException extends HttpException {
  constructor(message, number: number) {
    super(message, HttpStatus.NOT_FOUND);
  }
}
