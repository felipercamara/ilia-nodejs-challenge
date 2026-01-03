import { UserResponseDto } from './user-response.dto';

export class AuthResponseDto {
  user: UserResponseDto;
  access_token: string;
}
