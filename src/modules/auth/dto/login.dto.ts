import { ApiProperty } from '@nestjs/swagger';
import { EGrantType } from '../../../core/enums/grantType.enum';

export class LoginDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
  @ApiProperty({ default: EGrantType.Password })
  grantType: EGrantType;
}
