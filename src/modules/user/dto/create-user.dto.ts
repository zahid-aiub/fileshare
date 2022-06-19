import { RolesEnum } from '../../../core/enums/roles.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  id?: string;
  @ApiProperty()
  fullName: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
  isActive: boolean;
  @ApiPropertyOptional()
  roles?: RolesEnum[];
}
