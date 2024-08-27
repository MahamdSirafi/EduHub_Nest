import { ApiProperty } from '@nestjs/swagger';
import { Teacher } from '../../models/teachers';

export abstract class AuthTeacherResponse {
  @ApiProperty()
  token: string;

  @ApiProperty({ type: Teacher })
  teacher: Teacher;
}
