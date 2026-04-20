import csurf from 'csurf';
import { cleanEnv, str } from 'envalid';

const env = cleanEnv(process.env, {
  CSRF_SECRET: str({ length: 32 }),
});

export const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
});

export const getCsrfToken = (req: any, res: Response, next: NextFunction) => {
  res.json({ csrfToken: req.csrfToken() });
};