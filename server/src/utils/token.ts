import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { cleanEnv } from 'envalid';

// Validate required environment variables
const env = cleanEnv(process.env, {
  JWT_SECRET: str({ length: 32 }),
  JWT_REFRESH_SECRET: str({ length: 32 }),
  JWT_EXPIRES_IN: str({ default: '15m' }),
  JWT_REFRESH_EXPIRES_IN: str({ default: '7d' }),
});

interface TokenPayload {
  userId: string;
  role: string;
  email: string;
}

export const generateTokens = (payload: TokenPayload) => {
  const accessToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

  const refreshToken = jwt.sign(
    { ...payload, jti: uuidv4() },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    }
  );

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string, type: 'access' | 'refresh') => {
  try {
    return jwt.verify(token, type === 'access' ? env.JWT_SECRET : env.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

export const verifyAccessToken = (token: string) => verifyToken(token, 'access');
export const verifyRefreshToken = (token: string) => verifyToken(token, 'refresh');