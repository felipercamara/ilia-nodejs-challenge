import { IsNotEmpty, IsUUID } from 'class-validator';

/**
 * Interface for authenticated user context
 * Should be populated by JWT authentication guard
 */
export interface IUserContext {
  userId: string;
  email?: string;
}

/**
 * Custom decorator to extract user from request
 * Usage: @CurrentUser() user: IUserContext
 */
// import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// export const CurrentUser = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext): IUserContext => {
//     const request = ctx.switchToHttp().getRequest();
//     return request.user;
//   },
// );
