import { HttpException, HttpStatus } from '@nestjs/common';

export default class InvalidArgumentException extends HttpException {
  constructor() {
    super(`Invalid Argument Passed`, HttpStatus.BAD_REQUEST);
  }
}
