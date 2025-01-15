import { ValidationPipe } from '@nestjs/common';
const cookieSession = require('cookie-session');
export const setup = (app:any) => {
    app.use(
        cookieSession({
          keys: ['encryption_key'],
        }),
      );
      app.useGlobalPipes(
        new ValidationPipe({
          //security concerns
          whitelist: true,
        }),
      );
}