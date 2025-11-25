import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthUser {
  user_id: string;
  email: string;
  role: string;
  firebaseUid: string;
}

export const CurrentUser = createParamDecorator(
  (data: keyof AuthUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
