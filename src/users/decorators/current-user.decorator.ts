import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (_: never, context: ExecutionContext) => {
    // to have access to the session of the user
    const request = context.switchToHttp().getRequest();

    return request.currentUser;
  },
);
